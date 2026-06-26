# 🚀 GrantOS — Grant CRM for Web3 Teams

> **Track ecosystem rounds, generate AI-tailored applications, and never miss a reporting milestone.**

GrantOS is a full-featured grant management CRM built for Web3 teams navigating Optimism, Arbitrum, Base, Solana, and Ethereum grant programs. It replaces spreadsheets and scattered tabs with a purpose-built interface for the entire grant lifecycle — from discovery through application to reporting.

**[Live Demo](https://grantos.vercel.app) · [Report Bug](https://github.com/theweb3wizard/Grant-OS/issues) · [Request Feature](https://github.com/theweb3wizard/Grant-OS/issues)**

---

## ✨ Features

### 📅 Grant Calendar
Browse active grant programs across 5+ ecosystems in a sortable, filterable table. Every program includes ecosystem badges, funding ranges, deadline indicators (past-due strikethrough, upcoming highlights), and a detail modal with full descriptions and focus areas.

**What it demonstrates:** Complex filtering/sorting logic with `useMemo`, compound component composition (Dialog + Table + Badge), date formatting with `date-fns`, and a polished dark-themed data table.

### 🎯 Application Tracker (Kanban)
Six-stage pipeline — Interested → Drafting → Submitted → Under Review → Won → Lost. Drag-free status progression via dropdown with smart next-status logic. Each card shows ecosystem, grant name, notes, and a milestone manager for won grants.

**What it demonstrates:** State management across components, optimistic UI updates, modal/dropdown/alert-dialog composition (Radix UI), and a user-friendly empty state that guides the user to the next action.

### 🤖 AI Draft Generator
One-click generation of committee-specific grant applications using Groq's Llama 3.3 70B. Each draft is tailored to the grant program's priorities via custom prompt templates. Falls back gracefully to a manual editor if no API key is configured — the app never breaks.

**What it demonstrates:** Streaming API responses with `fetch` + `ReadableStream`, graceful degradation patterns, and separation of concerns between AI and manual modes.

### 📋 Milestone Manager
For won grants, track reporting deliverables with titles, due dates, and completion checkboxes. Persisted to localStorage. Designed as an inline expandable section within the Kanban card.

**What it demonstrates:** Inline CRUD operations, form validation, and sub-component architecture within a card-based layout.

### 🏗️ Architecture Highlights

| Pattern | Implementation |
|---------|---------------|
| **Zero external dependencies** | Everything runs on-device via `localStorage`. No database, no auth server, no payment provider. |
| **Graceful degradation** | AI draft generation is fully optional. Missing API key = manual editor, not a broken page. |
| **Client-first architecture** | All data operations are synchronous local calls. No loading spinners for data fetching — instant UI. |
| **Component composition** | 17 UI primitives built on Radix + shadcn, composed into domain components (Kanban, Calendar, Milestones). |
| **Route groups** | Clean URL organization with Next.js route groups: `(dashboard)`, protected layout with onboarding guard. |

---

## 🛠️ Tech Stack

| Category | Choice | Why |
|----------|--------|-----|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | Production React with file-based routing, SSR, and streaming |
| **Language** | TypeScript 5 | Full type safety across the entire codebase |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first with Radix-powered accessible components |
| **State** | React hooks + `localStorage` | Zero-dependency persistence; synchronous reads for instant UI |
| **AI** | Groq API (Llama 3.3 70B) | Streaming, low-latency inference with graceful fallback |
| **Icons** | Lucide React | Consistent, tree-shakeable icon system |
| **Dates** | date-fns | Lightweight, immutable date utilities |
| **Fonts** | Geist (Vercel) | Modern, optimized variable fonts via `next/font` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/dashboard/     # Protected dashboard pages
│   │   ├── page.tsx               # Overview with stats + upcoming deadlines
│   │   ├── grants/page.tsx        # Grant calendar (table + filters)
│   │   ├── tracker/page.tsx       # Kanban application tracker
│   │   ├── settings/page.tsx      # Project profile editor
│   │   └── draft/[id]/page.tsx    # AI draft generator page
│   ├── api/drafts/generate/       # Groq proxy route (streaming)
│   ├── onboarding/page.tsx        # First-run profile setup
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout + Toaster
├── components/
│   ├── draft/draft-generator.tsx   # AI + manual editor with fallback
│   ├── grants/grant-calendar.tsx   # Filterable/sortable grant table
│   ├── tracker/
│   │   ├── kanban-board.tsx        # 6-column pipeline view
│   │   ├── application-card.tsx    # Card with dropdown actions
│   │   └── milestone-manager.tsx   # Inline CRUD for deliverables
│   ├── layout/                     # Sidebar, mobile nav, skeletons
│   ├── profile/settings-form.tsx   # Project info + metrics
│   └── ui/                         # 17 shadcn UI primitives
└── lib/
    ├── store.ts                    # localStorage data layer
    ├── grants-data.ts              # Hardcoded grant programs
    └── utils.ts                    # cn() utility
```

---

## 🚦 Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static | Landing page |
| `/onboarding` | Static | First-run profile setup |
| `/dashboard` | Static | Overview with stats + deadlines |
| `/dashboard/grants` | Static | Grant calendar with search/filter |
| `/dashboard/tracker` | Static | Kanban application pipeline |
| `/dashboard/draft/[id]` | Dynamic | AI draft generator |
| `/dashboard/settings` | Static | Edit project profile |
| `/api/drafts/generate` | Dynamic | Groq proxy (streaming) |

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
git clone https://github.com/theweb3wizard/Grant-OS.git
cd grantos
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on the onboarding page. Fill in your project details and you're in.

### Optional: Enable AI Drafts

```bash
# .env.local
GROQ_API_KEY=gsk_your_groq_key_here
```

Get a free key at [console.groq.com](https://console.groq.com). Without it, the AI Draft Generator still works — it shows a manual text editor instead.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎯 What This Project Demonstrates

| Skill | Evidence |
|-------|----------|
| **React + Next.js (App Router)** | Route groups, client/server components, dynamic routes, layout nesting |
| **TypeScript** | Strict mode, full type definitions in `store.ts`, generic data operations |
| **Tailwind CSS + shadcn/ui** | Consistent dark theme, 17 Radix-based primitives, responsive sidebar/mobile |
| **Component architecture** | Domain components composed from primitives; Kanban, Calendar, Milestones |
| **State management** | Custom localStorage data layer with synchronous reads for instant UI |
| **AI integration** | Streaming HTTP responses with graceful degradation when unavailable |
| **Error handling** | Error boundaries, 404 page, empty states, toast notifications on every action |
| **UX patterns** | Loading skeletons, optimistic updates, confirmation dialogs, guided empty states |
| **Accessibility** | Radix primitives handle ARIA, keyboard nav, focus management |
| **Web3 domain** | Grant ecosystem knowledge baked into data model and AI prompt templates |

---

## 🚀 Deployment

Deploy to Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theweb3wizard/Grant-OS)

Set `GROQ_API_KEY` as an environment variable for AI draft support (optional).

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 👨‍💻 About the Developer

**I turn complex Web3 ideas into clean, wallet-connected dApps that anyone can use.**

I'm a frontend-focused Web3 developer who bridges the gap between intimidating blockchain tech and smooth user experiences. Instead of just talking about simplicity, I build it — pixel by pixel, transaction by transaction.

**My stack:** React · Next.js · TypeScript · Tailwind CSS · ethers.js · wagmi · Solidity

Before writing code full-time, I spent years demystifying blockchain as **[The Web3 Wizard](https://twitter.com/khalidx_dev)**. That background gave me a sharp eye for the exact moments where users get confused, scared, or lost. Now I eliminate those moments at the interface level.

📩 Open to freelance contracts, project-based work, and full-time roles.
