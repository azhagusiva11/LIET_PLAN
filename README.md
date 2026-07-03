# LIET — EMR + Scribe (demo)

Clickable prototype: Solo / Multi-Doctor / Multi-Specialty tiers, live scribe,
reception desk, patient timeline, labs, Rx print. Mock data only — no backend,
no patient data. Vite + React + lucide-react.

## Run locally
    npm install
    npm run dev

## Deploy to Vercel (pick one)

**A. Fastest — Vercel CLI (~1 min):**
    npm i -g vercel
    vercel
Accept the defaults (it auto-detects Vite). It prints a live URL.

**B. Familiar — GitHub → Vercel:**
1. Push this folder to a new GitHub repo (clean, single branch).
2. vercel.com → New Project → Import that repo.
3. It auto-detects: Framework = Vite, Build = `vite build`, Output = `dist`. Deploy.

No env vars, no config needed — it's a static frontend.
