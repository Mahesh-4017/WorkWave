<div align="center">

# 📌 Posted

**A plain, no-algorithm job board.** Post a role, browse a role, get pinned to the board.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[**Live Demo →**](#) &nbsp;•&nbsp; [Report a Bug](../../issues) &nbsp;•&nbsp; [Request a Feature](../../issues)

</div>

<br />

<!--
  GitHub strips real <iframe> tags from rendered READMEs, so a live embed isn't possible here —
  a screenshot or short demo GIF is the standard stand-in. Drop yours in /docs and update the path below.
-->
<div align="center">
  <img src="./docs/screenshot.png" alt="Posted job board homepage" width="800" />
  <p><em>Add a screenshot or GIF at <code>docs/screenshot.png</code> — this is the first thing visitors see.</em></p>
</div>

<br />

## What is this

Posted is a job board built to feel like an actual corkboard instead of another SaaS dashboard — pinned listing cards, a stamped "hiring" mark, torn-paper index cards instead of the usual template look. Job seekers browse and apply; employers post roles and track applicants from a dashboard.

## Features

- 🔍 **Job search** — keyword + location search with live Firestore-backed autocomplete suggestions
- 📌 **Post a role** — employers submit listings that write straight to Firestore and appear on the board in real time
- 🔐 **Auth** — email/password plus Google, X, and Apple sign-in via Firebase Auth
- 📊 **Employer dashboard** — live counts, applications-by-status chart, full jobs and applications lists
- 👥 **Role-aware UI** — job seeker and employer views branch from the same account system
- 🎨 **A design system, not a template** — custom palette, Fraunces + Inter + IBM Plex Mono type system, pinned-card motif throughout

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth & Data | Firebase Authentication + Cloud Firestore |
| Charts | Recharts |
| Icons | Lucide |
| Location data | [CountryStateCity API](https://countrystatecity.in) |

## Getting started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** and **Cloud Firestore** enabled

### 1. Clone and install

```bash
git clone https://github.com/Mahesh-4017/posted.git
cd posted
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# CountryStateCity API (used for the location autocomplete)
NEXT_PUBLIC_CSC_API_KEY=
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

## Project structure

```
app/
├─ page.tsx                 # landing / logged-in home switch
├─ login/                   # auth pages
├─ signup/
├─ reset/
├─ jobs/                    # job search + results
└─ dashboard/
   ├─ layout.tsx            # sidebar + auth guard
   ├─ page.tsx              # overview: stats, chart, lists
   └─ jobs/new/              # post-a-job form

components/
├─ layout/                  # Navbar, Footer, ConditionalChrome
├─ dashboard/                # DashboardSidebar, StatCard
└─ AutocompleteInput.tsx    # Firestore-backed suggestions

lib/
├─ firebase/                 # auth helpers, config
└─ firestore/                # jobs, applications, users queries
```

## Roadmap

- [ ] Category-based job filtering
- [ ] Saved / bookmarked jobs for job seekers
- [ ] Email notifications on application status change
- [ ] Employer applicant review flow

## Contributing

Issues and PRs are welcome. If you're picking up an item from the roadmap, open an issue first so we're not duplicating work.

## License

[MIT](./LICENSE)

---

<div align="center">
  Built by <a href="https://github.com/Mahesh-4017">Mahesh-4017</a>
</div>
