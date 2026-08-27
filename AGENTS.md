# OpenCode Instructions

### Core Development
- **Installation**: `npm install`
- **Environment**: Required `.env` keys: `DATABASE_URL`, `API_URL`, `PORT`.
- **Database**: `npx prisma generate` → `npx prisma db push` → `npm run seed`.
- **Dev Server**: `npm run dev` (concurrent: Next.js + Express `src/server.ts`).

### Verification & Build
- **Verify**: `npm run lint` → `npm run build`
- **Testing/Reset**: `npm run seed` (runs `prisma/seed.ts`).

### Architecture Notes
- **FE/BE**: Next.js 16 (App Router) + Express 5.2.1 (MVC: `src/controllers`, `src/services`, `src/repositories`).
- **Database**: Prisma v7 + Better-SQLite3 (`dev.db`). Client generated to `src/generated/prisma`.
- **Auth**: Custom localStorage-based (`user` key), emits `tb-auth-change` event.
- **Routes**: Express handlers MUST use `src/utils/async-handler.ts`.
- **API Format**: `{ success: boolean, data?: any, message?: string, error?: string }`.
- **File Uploads**: Multer saves to `public/uploads/` (filename: `timestamp-original`).
- **Scripts**: `npm run dev` (concurrent: Next.js + Express `src/server.ts`).

### Operational Guidelines
- **Important**: NEVER use `Select-Object -First` or `Select-Object -Last` for truncation in this environment. Capture output and use tools (e.g., `grep`, `read`) to search.
- **Git**: ONLY commit/push/merge when explicitly requested. Always verify `git status` and `git diff` first.
- **Lint/Typecheck**: Run `npm run lint` periodically to ensure code quality.

