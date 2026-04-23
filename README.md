# Troopod AI Personalized Landing Page Agent 

A working prototype built for the AI PM Assignment at Troopod. This tool allows users to input any **Ad Creative** and **Target URL**, instantly proxying the site and autonomously modifying its headings, subheadings, and Call-to-Actions (CTAs) based on Conversion Rate Optimization (CRO) principles—all while maintaining the original site's layout and styling.

![Troopod Assignment UI Demo](<img width="1904" height="910" alt="Screenshot 2026-04-23 135741" src="https://github.com/user-attachments/assets/dd310449-ecb5-473d-abdc-407107df559a" />

) *(Replace with actual screenshot)*

##  Features

- **Live URL Proxying:** Reliably renders external websites (including complex Single-Page Apps built with Next.js or Vite) exactly as they originally appear using smart `<base>` tag injection and a dedicated proxy API route.
- **Agentic DOM Personalization:** Automatically parses the page structure and targets high-converting HTML nodes (`<h1>`, `<h2>`, and `.btn` variants).
- **Post-Hydration Execution:** Prevents fatal Client-Side Hydration crashes often found in React sites by waiting for the target application to mount before applying DOM modifications visually on the client side.
- **Premium Interface:** Built with Next.js, Tailwind CSS, and Framer Motion for a sleek, top-tier SaaS aesthetic, featuring smooth transitions and beautiful dark-mode elements.
- **Split View Comparison:** Empowers users to compare the "Baseline Original" and the "Optimized AI Personalized" versions of the target website side-by-side.

## ⚙️ How It Works (The Flow)

1. **Input:** The user pastes a Target URL and describes their Ad Creative.
2. **Proxy Request:** The Next.js API (`/api/personalize`) proxies the target URL, injecting scripts and handling edge cases like stripping `crossorigin` to prevent network blocks.
3. **Execution:** It loads the proxy directly into an `<iframe>` (bypassing restrictive null-origin `srcDoc` errors). 
4. **Mock Interception:** Next.js uses an elegant Client-Side Mutator that blocks the `window.history.replaceState` (to bypass SecurityErrors), waits for the target site's JS bundles to execute, and replaces the copy dynamically.
5. **Output:** The user is presented with a dynamically optimized version of the landing page seamlessly aligned to their provided Ad Creative.

## Quick Start To Run Locally

Ensure you have Node.js installed, then clone the repository and run:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.

*(For the assignment demo, try inputting a standard SSR site or SPA Next.js site to see the agent seamlessly apply CRO copy modifications).*
## 🛠️ Built With
* [Next.js 14 (App Router)](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Lucide Icons](https://lucide.dev/)
* [Cheerio](https://cheerio.js.org/) (for initial backend DOM manipulations)

---

**Assignment Prepared for:** Troopod  
**Position:** AI Product Manager  
