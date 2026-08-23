# INTROLIC — Master Conversation Handover & Project Architecture

> **Purpose of this Document**: This file stores a complete, comprehensive record of all technical discussions, brand guidelines, architectural implementations, design decisions, database schemas, and deployment configurations for **Introlic** (`https://introlic.in`). When starting a new session, provide this file to the AI assistant to instantly restore full context.

---

## 1. Project Identity & Overview

- **Organization**: **Introlic** (Independent AI Research & Software Systems Lab)
- **Tagline**: *"Engineering High-Performance AI & Software Systems."* / *"Founded in India • Building for the World"*
- **Domain**: `https://introlic.in` (Production on AWS EC2)
- **Secondary Domain**: `https://introlic.site` (Configured with 301 permanent redirect to `https://introlic.in`)
- **Core Architecture**:
  - **Framework**: Next.js 16 (App Router, Turbopack, Server Actions, React 19)
  - **Database**: PostgreSQL 16 managed via Drizzle ORM
  - **Cache & Telemetry**: Redis Server
  - **Process Management**: PM2 daemon (`introlic` process)
  - **Reverse Proxy & SSL**: Nginx with Let's Encrypt SSL certificates (HTTP/2, HSTS enabled)
  - **Production Server**: AWS EC2 Instance (`65.1.248.239`, Ubuntu 24.04 LTS, 4GB Swap configured)
  - **Email Infrastructure**: Resend API (`contact@introlic.in`, domain DKIM/SPF configured on GoDaddy DNS)

---

## 2. Strict Brand Rules & Design System

### 2.1 Logo & Emblem
- **Official Emblem**: The pure white Introlic geometric symbol (`/icon.png` rendered with `filter brightness-0 invert opacity-95` or `/icon-white.png`).
- **Rule**: Never change the logo emblem color away from pure white. Never replace it with a generic "i" icon or unapproved gradients.

### 2.2 Color Palette
- **Primary Brand Accent**: Electric Blue / Cyan (`#00a3ff` / `COLORS.brand.blue`)
- **Deep Blue**: `#0066cc` / `COLORS.brand.blueDeep`
- **Secondary Accents**: Sky (`sky-400`), Blue (`blue-400`), Emerald (`emerald-400`), Amber (`amber-400`), Teal (`teal-400`)
- **Backgrounds & Glass**: Pure Deep Black (`#000000`, `#020202`), Dark Glass (`#050505`, `#09090b`, `#070709`, `#0a0a0c`), and subtle borders (`border-white/5`, `border-white/10`).
- **STRICT PROHIBITION**: Strictly **NO** purple, violet, pink, magenta, or rose colors across any public or admin interfaces.

### 2.3 Tone of Voice & Terminology
- **Rule**: Strictly **NO** fictional sci-fi buzzwords (e.g., *Project Forge*, *Silicon Template Node Broadcasting*, *Uplink Protocols*).
- **Approved Style**: Clean, authoritative, modern deep-tech and engineering terminology (e.g., *Overview*, *New Project*, *Publish Paper*, *Category Manager*, *Type Manager*, *Live Preview*).
- **Minimalism**: No excessive "AI slop", neon halos, or glowing pulse effects on profile footers or metric cards.

---

## 3. Comprehensive Summary of Accomplished Work

### 3.1 Admin Authentication & Dashboard Foundation
- **Login Portal (`/admin/login`)**:
  - Centered dark glass card with pure white emblem, high-contrast credential fields, password reveal toggle, caps-lock detector, and rate-limiting error alerts.
- **Admin Sidebar (`Sidebar.tsx`)**:
  - **Elevated Brand Header**: Fixed `h-16` header holding the pure white Introlic emblem in a sleek `w-9 h-9` container, balanced `gap-3.5` with the **INTROLiC** / *Admin Portal* title.
  - **Navigation**: Clean active indicators in `#00a3ff` without heavy glow shadows.
  - **Admin Profile Footer**: Clean minimalist card for active admin (`MF9 Coding Admin` / `superadmin`) with a discreet `w-8 h-8` dark monogram avatar, role indicator, and quick logout button.

### 3.2 Projects Management (`/admin/projects` & `ProjectsClient.tsx`)
- **Header Navigation**: Segmented pill tabs for `Overview` (with project count badge), `New / Edit Project`, and `Category Manager` (with category count badge), plus `+ New Project` CTA.
- **3-Way View Switcher**:
  1. **Cards Grid (`LayoutGrid`)**: High-visual cards with category pills, live links, and action buttons.
  2. **Data Table (`List`)**: Structured density table with sticky headers.
  3. **Master-Detail Split (`Columns`)**: Left sidebar list selector + Right full Markdown document preview.
- **Project Editor Studio**: 2-column layout with Markdown editor (**Write** & **Live Preview** tabs, custom `MarkdownToolbar`), WebP image cover selector, and contributor management.
- **Category Manager**: Live route preview box (`introlic.in/projects?category={slug}`), auto-slug generator, 4 metric cards, and dual Cards/Table layout with 1-click **Copy Slug** feedback.
- **Cleaned**: Removed all "Import from Local" buttons and purged all purple styling.

### 3.3 Research Papers Management (`/admin/research` & `ResearchClient.tsx`)
- **3-Way View Switcher**:
  1. **Cards Grid**: Rich cards with paper type, author, institution, keywords, abstract snippet, DOI, and external link.
  2. **Data Table**: High-density table with quick actions.
  3. **Master-Detail Split**: Left paper selector + Right full Markdown paper reader with abstract and metadata.
- **Publish / Edit Paper Studio**: 2-column form with Title, Abstract, Type selector (with instant `+ Add Type` modal), Markdown editor with `MarkdownToolbar` (Headers, Bold, Code, Tables, Quotes), Author dropdown + Custom Author fallback, DOI, and External URL.
- **Type Manager**: 4 Stat Cards, Left Create/Edit card with route preview (`introlic.in/research?type={slug}`), auto slug generation, and dual Cards/Table directory with one-click **Copy Slug** feedback.

### 3.4 Blog Management (`/admin/blog` & `BlogClient.tsx`)
- **3-Way View Switcher**:
  1. **Cards Grid**: Visual cards with WebP thumbnail preview, category badge, author, read time, date, and excerpt.
  2. **Data Table**: Clean tabular layout with thumbnail monograms.
  3. **Master-Detail Split**: Left article list + Right full Markdown reader with thumbnail and metadata.
- **Create / Edit Post Studio**: 2-column form with Title, Slug, Category (with instant `+ Add Category` modal), Excerpt, Markdown editor with `MarkdownToolbar`, WebP Thumbnail uploader with instant preview / remove / replace and CSS Art cover fallback, Author selector, Status, and Read Time.
- **Category Manager**: 4 Stat Cards, Left Create/Edit card with route preview (`introlic.in/blog?category={slug}`), auto slug generator, and dual Cards/Table directory with copy slug feedback.

### 3.5 Contact Dispatch & Official Email Branding
- **Messages Inbox (`/admin/messages` & `/admin/messages/[id]`)**:
  - Official reply modal with customizable response templates.
  - Email templates styled with the pure white Introlic emblem, official signature (*The Introlic Team — Foundational AI Research & Engineering*), and clean, professional dispatch copy.

### 3.6 Mobile Navigation Drawer (`Navbar.tsx`)
- **Resolved Clashing Close Buttons**: Fixed the double `X` button bug by smoothly fading out the main header toggle button (`opacity-0 scale-75 pointer-events-none`) when `isMenuOpen` is active, allowing the drawer's native top-right `X` close button to control closing without overlap.
- **Dedicated Top Drawer Header**: Features the pure white emblem, uppercase **INTROLiC** wordmark, and clean close button.

### 3.7 Mobile Hero Experience (`Hero.tsx`)
- **Desktop View**: Retained 100% of the desktop experience (single-line headline, fluid canvas background, balanced `h-[54px] sm:w-[240px]` dual pill buttons).
- **Mobile View**:
  - **Active Lab Telemetry Pill**: Frosted glass badge (`bg-white/90 backdrop-blur-md border border-black/[0.08]`) with cyan pulse dot.
  - **Capability Micro-Matrix**: Dedicated 3-item badge row (`⚡ Model Architectures`, `⚡ Generative Systems`, `⚡ Digital Platforms`).
  - **Responsive Headline**: High-impact font scale (`text-[1.95rem] xs:text-[2.2rem]`) with natural breaks.
  - **Ergonomic Action Buttons**: Full-width mobile CTA cards (`h-[48px] w-full max-w-[320px] rounded-full active:scale-95`) for *Join the Movement* and *Introlic Documentation*.

### 3.8 Presentation Deck (`/ppt` & `ppt/page.tsx`)
- **Pitch Deck Strategic Positioning**:
  - **Core Focus**: **Discrete Diffusion Language Models (DLMs)** and **SEDD (Score Entropy Discrete Diffusion)** architectures to challenge the left-to-right autoregressive Transformer bottleneck and context window problem.
  - **The Gold Mine Thesis**: While the entire AI industry is crowded into established Transformers (facing $O(N^2)$ quadratic context costs and hallucination traps), DLMs represent an untapped **gold mine** for discovering fundamental breakthroughs, real-time error correction, and bidirectional non-autoregressive reasoning.
  - **Frontier Inspiration**: Paralleling DeepSeek's MoE disruption with frontier labs like Inception Labs and Stanford SEDD. Introlic is opening this exact DLM frontier in India.
  - **Fellowship Target**: **`Kothari Fellowship ($5,000 – $7,000)`** to fund cloud GPU compute clusters (H100/A100 instances) for training and benchmarking 220M SEDD prototype models.
  - **Developer Alliance**: The **"in1" movement** on social media to build sovereign Indian DLMs and foundational open research.
  - **Cleaned**: All references to "$3,000 Feather Grant" and "Transformer-Mamba" completely removed and replaced.

### 3.9 Production AWS Deployment & Database Sync
- **Server Specifications**:
  - Host: `65.1.248.239` (AWS EC2, Ubuntu)
  - Domains: `introlic.in`, `www.introlic.in` (SSL enabled via Certbot)
  - PostgreSQL: Local port `5432` (`DATABASE_URL="postgresql://introlic:introlic_secret@127.0.0.1:5432/introlic"`)
  - Verified migrations for `visits` (`state`, `device_brand`, `device_model`, `visitor_id`) and `login_attempts` tables.
  - PM2 daemon running Next.js production build (`pm2 reload introlic`).

---

## 4. Key Directory & File Mapping

```
introlic-website/
├── src/
│   ├── app/
│   │   ├── (public pages: /, /about, /projects, /research, /blog, /docs, /contact, /terms, /privacy, /cookies, /ethics)
│   │   ├── admin/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── Sidebar.tsx                # Admin sidebar with elevated white emblem & clean profile footer
│   │   │   │   ├── layout.tsx                 # Dashboard session-protected layout
│   │   │   │   ├── page.tsx                   # Admin Overview
│   │   │   │   ├── projects/                  # Projects management (ProjectsClient.tsx)
│   │   │   │   ├── research/                  # Research papers management (ResearchClient.tsx)
│   │   │   │   ├── blog/                      # Blog posts management (BlogClient.tsx)
│   │   │   │   ├── messages/                  # Contact inbox & email dispatch (MessagesClient.tsx)
│   │   │   │   ├── users/                     # User management (UsersClient.tsx)
│   │   │   │   ├── authors/                   # Author profiles management
│   │   │   │   ├── visitor-logs/              # Real-time analytics & visitor metrics
│   │   │   │   └── security-logs/             # Audit logs & failed login tracker
│   │   │   ├── login/page.tsx                 # Admin login authentication screen
│   │   │   └── LogoutButton.tsx               # Minimalist Sign Out action trigger
│   │   └── api/
│   │       ├── projects/                      # Projects CRUD endpoints
│   │       ├── research/                      # Research papers CRUD endpoints
│   │       ├── blog/                          # Blog posts CRUD endpoints
│   │       ├── categories/                    # Category/Type taxonomy endpoints (?type=project|research|blog)
│   │       ├── authors/                       # Authors CRUD endpoints
│   │       ├── upload/thumbnail/              # WebP image uploader endpoint
│   │       └── admin/messages/reply/          # Resend email dispatch endpoint
│   ├── components/
│   │   ├── Navbar.tsx                         # Header navbar & mobile drawer with white emblem
│   │   ├── Hero.tsx                           # Dual-optimized Hero (Desktop single-line + Mobile capability matrix)
│   │   ├── FluidBackground.tsx                # WebGL interactive fluid background canvas
│   │   └── auth/AuthModal.tsx                 # User authentication modal
│   ├── db/
│   │   ├── schema.ts                          # Drizzle ORM database schema definitions
│   │   ├── index.ts                           # Database client initialization
│   │   └── migrate.ts                         # Database migration runner
│   └── lib/
│       ├── auth.ts                            # Session & JWT authentication helpers
│       └── email.ts                           # Resend email dispatch service & templates
├── public/
│   ├── icon.png                               # Introlic official emblem (brightness-0 invert for white)
│   ├── icon-white.png                         # Pure white emblem asset
│   └── uploads/                               # Dynamic user-uploaded assets
└── drizzle.config.ts                          # Drizzle ORM configuration
```

---

## 5. Development & Deployment Reference Commands

### 5.1 Local Development
```bash
# Start local Next.js dev server on port 3004
npm run dev

# Run TypeScript check & full production build test
npm run build
```

### 5.2 Deploying to AWS EC2 Server
```bash
# 1. Package codebase excluding build artifacts
tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf "introlic-deploy.tar.gz" -C "c:/Projects/introlic-website" .

# 2. Upload archive to EC2 instance
scp -i "C:/Users/Pc/Downloads/introlic-key.pem" -o StrictHostKeyChecking=no "introlic-deploy.tar.gz" ubuntu@65.1.248.239:~/introlic-deploy.tar.gz

# 3. Extract, rebuild, and reload PM2 on EC2
ssh -i "C:/Users/Pc/Downloads/introlic-key.pem" -o StrictHostKeyChecking=no ubuntu@65.1.248.239 "tar -xzf ~/introlic-deploy.tar.gz -C ~/introlic-website && cd ~/introlic-website && npm install && npm run build && pm2 reload introlic"

# 4. Verify live deployment
curl -I https://introlic.in
```

---

## 6. Immediate Next Steps & Context for Future Sessions

1. **Brand Continuity**: Always adhere to the pure white Introlic emblem and `#00a3ff` / dark glass theme. Never introduce purple or pink accents.
2. **Mobile-First Validation**: Whenever modifying public pages (Home, Projects, Research, Blog, Docs, Contact), always verify both mobile (`< sm`) and desktop (`>= sm`) responsiveness.
3. **Database Consistency**: Local Docker Postgres runs on port `5433`, while AWS EC2 Postgres runs on port `5432`. Keep `.env.local` configured appropriately per environment.
4. **Admin Dashboard Standard**: All new admin sections must follow the established 3-way layout switcher (Cards Grid, Data Table, Master-Detail Split) and dedicated Category/Type managers.
