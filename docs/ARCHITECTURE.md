# GrantOS Architecture

## Design Philosophy

GrantOS was built with three constraints that shaped every decision:

1. **Zero external dependencies.** The app must work fully offline. No database, no auth server, no payment provider, no email service. This forced a client-first architecture where all data lives in `localStorage` and all UI is synchronous.

2. **Graceful degradation.** Every feature that depends on an external capability must work without it. The AI draft generator is the prime example — if `GROQ_API_KEY` is missing, the user gets a full-featured manual text editor instead of a broken page.

3. **State as a UI concern.** Without a backend, data fetching becomes synchronous. There's no loading state for data — the app is either in its initial state (empty lists, onboarding prompt) or showing user data. This shifted complexity from data-fetching patterns to UI state management.

---

## Data Layer: `store.ts`

The entire persistence layer is a single module with no dependencies beyond `localStorage`:

```
localStorage key: "grantos-state"
├── profile: ProjectProfile | null
├── applications: Application[]
└── milestones: Milestone[]
```

### Why not a React Context?

A Context-based store would cause re-renders on every data mutation. Since `localStorage` reads are synchronous (<1ms), we treat the data layer as a simple import-and-call API. Components that need to refresh after a mutation call `onRefresh()` which re-reads from the store. This keeps the data layer framework-agnostic and testable without React.

### Key Design Decisions

- **`genId()` uses `crypto.randomUUID()`** — available in all modern browsers and secure contexts. Falls back to a timestamp + random string for non-secure contexts.
- **Functions are synchronous.** No Promises, no async. This means components never need loading states for data reads.
- **`getApplicationsWithGrants()`** joins applications with hardcoded grant data and milestones. This replaces what would be a SQL JOIN in a traditional backend.
- **`deleteApplication()`** cascades to delete associated milestones — a referential integrity concern handled in application code.

---

## Route Architecture

```
/                     Landing page (static)
├── /onboarding       Profile setup (static, no layout)
└── /dashboard/*      Protected by layout check (client-side)
    ├── /dashboard              Overview
    ├── /dashboard/grants        Grant calendar
    ├── /dashboard/tracker       Kanban pipeline
    ├── /dashboard/draft/[id]    AI draft generator
    └── /dashboard/settings      Profile editor
```

### Route Groups

The `(dashboard)` route group provides a shared layout with sidebar + mobile nav. This layout runs a `useEffect` that checks for a saved profile — if missing, it redirects to `/onboarding`. This is the entirety of the "auth" system: **if you have a profile, you're in.**

### Why Onboarding is Outside the Group

The onboarding page lives at `/onboarding` (root level), not inside `(dashboard)`. This breaks a circular dependency: the dashboard layout checks for a profile and redirects to onboarding if missing, but if onboarding were inside the same layout, it would get caught by the same check and never render.

---

## Component Tree

```
RootLayout
├── LandingPage (/)
└── DashboardLayout (guarded by profile check)
    ├── Sidebar + MobileNav
    └── <DashboardPage>
        ├── DashboardHeader (breadcrumb + title)
        ├── GrantCalendar
        │   ├── SearchBar
        │   ├── EcosystemFilter (Select)
        │   ├── SortToggle
        │   └── DataTable
        │       └── Row → Dialog (details) + Track button
        ├── KanbanBoard
        │   └── Column (×6)
        │       └── ApplicationCard
        │           ├── DropdownMenu (status, notes, draft, delete)
        │           ├── MilestoneManager (if won)
        │           └── NotesDialog
        ├── DraftGenerator
        │   ├── ProjectProfile card
        │   ├── AI Generator → fetch('/api/drafts/generate')
        │   └── Manual Textarea (fallback)
        └── SettingsForm
            └── IdentityCard + MetricsCard
```

---

## The AI Draft Generator Flow

```
User clicks "Generate with AI"
  → POST /api/drafts/generate
    → Check GROQ_API_KEY
      → Missing? Return 501 → Show manual textarea
      → Present? Stream from Groq API
        → ReadableStream consumed by client
        → Text appended to content state (real-time)
        → On complete: save to localStorage
          → Show "Auto-saved" indicator
```

The API route is a thin proxy — it takes project info and grant context, forwards to Groq, and pipes the streamed response back. No auth, no rate limiting, no session management. The client handles all error cases: network failure, missing key, API error, and stream interruption all result in the same graceful fallback to manual mode.

---

## Why No Framework State Library?

GrantOS has exactly **three** pieces of mutable state:
1. Profile (one object)
2. Applications (array)
3. Milestones (array, dependent on applications)

All stored in `localStorage`. All read synchronously. All mutated through simple CRUD functions. Adding Redux, Zustand, or Jotai would introduce:

- Boilerplate (stores, actions, selectors)
- Re-render complexity (subscriptions, selectors)
- Bundle size (~1-3 KB gzipped minimum)
- Serialization concerns (localStorage ↔ store sync)

The `store.ts` module is 180 lines of pure functions. It has zero imports from React or any framework. It can be tested with `localStorage.mock` in Jest in under 10 lines of setup. This is intentionally minimal — the app's data complexity doesn't justify a state library.

---

## Tailwind + shadcn/ui Configuration

The project uses Tailwind CSS v4 with the `@tailwindcss/postcss` plugin (PostCSS-based, no config file). The `globals.css` file serves as the single configuration point:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

All 17 UI primitives are generated from shadcn/ui patterns but hand-tuned for the dark theme. The component files are standalone — each is a single `.tsx` file with inline variants (via CVA) and no external style dependencies.

---

## Performance Characteristics

| Metric | Value | Why |
|--------|-------|-----|
| Bundle size (client) | ~120 KB gzip | Tailwind is large but tree-shaken; no heavy libs |
| First load | Static HTML + JS | All pages except draft are static |
| Data reads | <1ms | Synchronous localStorage |
| Data writes | <1ms | JSON.stringify to localStorage |
| AI streaming | First token ~500ms | Groq inference time |
| Build time | ~25s | Turbopack in Next.js 16 |

The app has no API waterfalls, no loading spinners for data, and no server-side data dependencies. Every page renders instantly with whatever data is in localStorage.

---

## Security Considerations

Since GrantOS has no backend, the security model is simple:

- **No authentication.** All data is local to the device. There are no sessions, tokens, or passwords.
- **No API keys exposed to client.** The only API call is to `/api/drafts/generate`, which runs server-side. The Groq API key stays on the server.
- **No user data transmitted.** Grant program data is hardcoded. User project data stays in localStorage.
- **localStorage isolation.** Each browser/profile has its own storage. No data crosses origins.

For production use with a team, localStorage would be replaced with a database. But for a single-user or demo scenario, it's secure by isolation.
