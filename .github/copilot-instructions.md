# Copilot Workspace Instructions for Bookify

## Overview

This project is a [Next.js](https://nextjs.org) application bootstrapped with `create-next-app`. It uses TypeScript, Tailwind CSS, and a modular component structure. The codebase follows clean code principles, DRY, and meaningful naming conventions. UI components are organized under `components/`, and utility logic under `lib/`.

## Build & Development

- **Development:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Lint:** `npm run lint`

## Key Conventions

- **Component Structure:** Place reusable UI in `components/`, with atomic design encouraged.
- **Styling:** Use Tailwind CSS utility classes. Custom classes are defined in `app/globals.css`.
- **Type Safety:** Use TypeScript for all code. Shared types go in `types.d.ts`.
- **Imports:** Use path aliases as defined in `components.json` for cleaner imports (e.g., `@/components`, `@/lib/utils`).
- **Best Practices:**
  - Use meaningful, descriptive variable and function names.
  - Keep components and functions small and focused.
  - Prefer composition over inheritance.
  - Avoid code duplication; extract shared logic to utilities or hooks.
  - Write pure functions where possible.

## Project Structure

- `app/` — Next.js app directory (routes, layouts, pages)
- `components/` — UI and form components
- `lib/` — Utility functions and constants
- `public/` — Static assets
- `types.d.ts` — Global TypeScript types

## Testing

- (Add test setup instructions here if/when tests are added)

## Pitfalls & Tips

- **Tailwind:** Only use static class names for dynamic styling to ensure correct build output.
- **Globals:** Use `app/globals.css` for global styles and custom Tailwind classes.
- **ESLint:** Run `npm run lint` to catch code quality issues early.

## Documentation

- See [README.md](README.md) for getting started, deployment, and learning resources.
- For UI conventions, review custom classes in `app/globals.css`.

## Example Prompts

- "How do I add a new page?"
- "What is the pattern for creating a new component?"
- "How do I use Tailwind custom classes?"

---

For advanced customization, consider creating agent instructions for specific folders (e.g., `/components`, `/lib`) to enforce stricter conventions or automate repetitive tasks.
