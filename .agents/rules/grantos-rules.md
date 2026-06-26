---
trigger: always_on
---

1. This is a Next.js 16 App Router project using TypeScript strict mode. All code must be TypeScript.

2. Database is Supabase (Postgres). Use @supabase/supabase-js and @supabase/ssr for all database operations. Never use the service role key on the client side.

3. Styling uses Tailwind CSS with shadcn/ui components. Follow dark-mode-first design. Background colors should use zinc-950 or zinc-900. Accent color is cyan-400.

4. All API routes live in src/app/api/. They must return typed NextResponse objects.

5. Never hardcode API keys or secrets. Always use environment variables from .env.local.

6. Never install packages without stating them explicitly in the response first.

7. All AI calls use Vercel AI SDK (the 'ai' package) with @ai-sdk/anthropic. The model is 'claude-sonnet-4-6'.

8. Run 'npm run build' mentally before finishing. Flag any TypeScript errors in the implementation plan.