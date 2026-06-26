# Contributing to GrantOS

## Development Workflow

```bash
git clone https://github.com/theweb3wizard/Grant-OS.git
cd grantos
npm install
npm run dev
```

## Code Style

- **TypeScript strict mode** — no `any` unless absolutely necessary (and justified in a comment).
- **shadcn/ui conventions** — components use CVA variants, forward refs, and expose `className` for composition.
- **Tailwind classes** — prefer `cn()` from `@/lib/utils` for conditional classes.
- **File naming** — kebab-case for files, PascalCase for components, camelCase for utilities.

## Component Guidelines

1. Each component lives in its domain folder: `components/grants/`, `components/tracker/`, etc.
2. UI primitives live in `components/ui/` and follow the shadcn pattern of being generic, unstyled shells with CVA variants.
3. Domain components compose primitives. They own the data-fetching (or in our case, store-reading) logic.
4. Client components use `'use client'` only when necessary. If a page reads from `store.ts`, it must be a client component.

## Data Layer

The `store.ts` module is intentionally flat and synchronous. When adding new data:

1. Add the type to the interface
2. Add the field to `AppState`
3. Add CRUD functions following existing patterns
4. Keep functions pure and synchronous

## Adding a New Grant Program

Edit `src/lib/grants-data.ts`:

```typescript
{
  id: 'my-grant-program',
  name: 'My Grant Program',
  ecosystem: 'Optimism',
  fundingRange: '$10k - $100k',
  deadline: '2026-12-31',
  focusAreas: ['DeFi', 'Infra'],
  description: 'Description of the program.',
  officialUrl: 'https://example.com',
  promptTemplate: 'Custom AI system prompt for this committee...',
}
```

The grant will appear in the calendar automatically.

## Build Verification

```bash
npm run build    # Must pass with zero errors
npm run lint     # Must pass with zero warnings
```

## Pull Request Process

1. One feature or fix per PR.
2. Keep PRs under 300 lines when possible.
3. Update README if the feature changes the user-facing experience.
4. Verify the build passes before requesting review.
