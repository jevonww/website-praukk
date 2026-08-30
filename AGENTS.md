# OpenCode Instructions

### Development
- **Dev Server**: `npm run dev` (concurrently runs `next dev -H 0.0.0.0` and `tsx watch src/server.ts`).
- **Database**: Prisma v7 + Better-SQLite3.
  - Setup: `npx prisma generate` && `npx prisma db push` && `npm run seed`.
- **Testing**: `npm run seed` runs `prisma/seed.ts` (resets `dev.db`).
- **Verification**: `npm run lint`.

### Architecture
- **FE/BE**: Next.js 16 (App Router) + Express 5.2.1.
- **MVC**: `src/controllers`, `src/services`, `src/repositories`.
- **Routes**: Express handlers MUST use `src/utils/async-handler.ts`.
- **API**: Returns standard `{ success: boolean, data?: any, message?: string, error?: string }`.
- **Auth**: Custom localStorage (`user` key), emits `tb-auth-change`.
- **Uploads**: Cloudinary (via `multer-storage-cloudinary`).

### Guidelines
- **Tools**: NEVER use `Select-Object -First/Last` for truncation. Use `grep` or `read`.
- **Git**: Commit ONLY when explicitly requested. Verify status/diff first.
