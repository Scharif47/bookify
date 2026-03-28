# Bookify

Next.js app for managing and listening to book collections with AI-generated voice narration.

## Tech Stack

- **Framework**: Next.js (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB + Mongoose
- **Auth**: Clerk
- **UI**: shadcn/ui + Tailwind CSS 4 + Lucide icons
- **Forms**: React Hook Form + Zod
- **Storage**: Vercel Blob
- **Toasts**: Sonner

## Project Structure

```
/app          → Next.js routes (App Router, grouped under (root))
/components   → Reusable UI components
/lib          → Server actions, utils, Zod schemas, constants
/database     → Mongoose models and connection
/types.d.ts   → Global type definitions
```

## Coding Standards (Always Apply)

### DRY & Reusability
- Extract any logic used more than once into a shared util, hook, or component
- Prefer composable, single-responsibility components and functions
- Centralize constants in `/lib/constants.ts`, types in `types.d.ts`, schemas in `/lib/zod.ts`

### Clean Code & Readability
- Use meaningful, intention-revealing names — no abbreviations, no need for comments
- Functions should do one thing; if a function is getting long, split it
- Files should stay focused — if a file is growing large, extract into smaller modules
- Follow the "Clean Code" principle: a function should fit on one screen

### Design Patterns & Best Practices
- Apply relevant design patterns (factory, strategy, adapter, etc.) when they reduce complexity
- Prefer composition over inheritance
- Keep server actions, data fetching, and UI logic clearly separated
- Use Zod for all external/user input validation
- Follow Next.js App Router conventions: Server Components by default, `"use client"` only when needed

### Refactoring
- Always look for refactor opportunities before adding new code
- Prefer editing existing abstractions over duplicating logic
- If a component or function has too many responsibilities, break it up proactively
- Remove dead code rather than commenting it out

### Naming Conventions
- Components: `PascalCase`
- Functions, variables, hooks: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
- Files: `PascalCase` for components, `camelCase` for utils/hooks

### TypeScript
- No `any` — use proper types or generics
- Define shared types in `types.d.ts`; keep local types close to where they're used
- Use Zod schemas as the source of truth for runtime + static types (`z.infer<typeof schema>`)
