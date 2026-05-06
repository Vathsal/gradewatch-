# GradeWatch — NYC Restaurant Health Tracker

Track NYC restaurant health inspection grades. Search any restaurant, see full violation history, and get plain-English AI explanations of what each violation actually means.

**Live data** from NYC Open Data (DOHMH Restaurant Inspection Results), updated daily.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub

```bash
cd gradewatch
git init
git add .
git commit -m "Initial commit — GradeWatch v1"
```

Go to github.com → New repository → name it `gradewatch` → copy the repo URL, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gradewatch.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project** → Import your `gradewatch` repo
3. Leave all settings as default — Vercel auto-detects Vite
4. Before clicking Deploy, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (starts with `sk-ant-...`)
5. Click **Deploy**

Your app is live at `gradewatch.vercel.app` (or similar) in ~60 seconds.

### Step 3 — Get your Anthropic API key

If you don't have one yet:
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key and add it to Vercel as shown above

---

## Run locally

```bash
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How it works

- **Search** — Hits NYC Open Data API live (`data.cityofnewyork.us`). No key required.
- **Detail** — Shows full inspection timeline, violation codes, scores.
- **AI explanations** — Each violation has an "Explain in plain English" button. Calls `/api/explain` (a Vercel serverless function) which securely calls Claude. Your API key never touches the browser.
- **Saved spots** — Persisted to localStorage. Works offline.

---

## Roadmap

- **V2** — Chrome extension: overlay grades on Google Maps & Yelp
- **V3** — Grade change alerts + user accounts

---

Built with React + Vite · Data: NYC Open Data DOHMH · AI: Claude (Anthropic)
