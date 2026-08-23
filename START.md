# Getting Started

This guide outlines the commands needed to run the Introlic website development server and the Cloudflare Tunnel locally.

---

## 1. Local Development Server

To run the Next.js website locally in development mode:

### Install Dependencies
Run this once to install the project dependencies:
```bash
npm install
```

### Start Development Server
Starts the local development server on port `3004`:
```bash
npm run dev
```
Once started, you can access the website locally at:
* **Local URL**: `http://127.0.0.1:3004`
* **Localhost URL**: `http://localhost:3004`

### Clear Next.js Cache & Restart
If you encounter caching issues or React hydration mismatches:
```powershell
# Stop the dev server, then run:
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 2. Cloudflare Tunnel

To expose your local development server to the public domain (`introlic.site`), start the Cloudflare tunnel client using your local configuration file:

```powershell
cloudflared tunnel --config C:\Users\Pc\.cloudflared\introlic-config.yml run
```

---

## 3. Production Build and Start

If you need to test or deploy the production version of the site locally:

### Build the Project
Compiles the static and dynamic pages:
```bash
npm run build
```

### Run Production Server
Starts the built website in production mode:
```bash
npm start
```
