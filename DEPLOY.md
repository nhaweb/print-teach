# Deploy print-teach lên Vercel
1. Dev copy `vercel.json`, `.env.example`, `.github/workflows/ci.yml` vào root repo.
2. Pin pnpm: `packageManager: pnpm@12.3.4` có thể chưa được Vercel hỗ trợ. Hoặc đổi về pnpm 10.x và tạo lại lockfile, hoặc đặt env `ENABLE_EXPERIMENTAL_COREPACK=1` trên Vercel.
3. Vercel → Add New Project → Import `nhaweb/print-teach` (Framework Next.js, Node 22.x).
4. Env (Production + Preview): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SITE_URL, SUPABASE_SERVICE_ROLE_KEY (Sensitive, chỉ server).
5. Deploy. `main` = production, mỗi PR có Preview.
