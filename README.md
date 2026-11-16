# Sumaiya Akter — Senior AI Engineer, Software Architect & Researcher Portfolio

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL_Mode-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

A digital identity, production showcase, and academic research portal engineered for **Sumaiya Akter** (Software Engineer – Backend, AI Team @ ACI Limited).

Positioned for:
1. International Senior AI/ML Engineering & Backend Architecture opportunities.
2. Production AI consulting & technical partnership.
3. Fully funded PhD positions & academic research collaborations.

---

## 🏛️ System Architecture & Highlights

- **Frontend Tier:** Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, responsive glassmorphism aesthetic with Dark/Light theme switching.
- **Backend & API Layer:** Fully typed Next.js Server-Side API routes (`/api/*`) for authentication, project filtering, research papers, video management, and client inquiries.
- **Dynamic Relational CMS:** SQLite database with WAL mode (`better-sqlite3`), parameterized SQL queries, indexing, and foreign keys.
- **Enterprise Security:** Bcrypt salted password hashing, signed HTTP-only JWT cookies, owner-scoped authorization, and input validation.
- **Authentic Assets:** Embedded real portraits of Sumaiya, actual production screenshots (Doctor J, AgroGPT, Snap & Get, Rxpert), and downloadable research manuscripts & transcripts.

---

## 📑 Portfolio Sections & Pages

| Route | Page | Purpose & Content |
| :--- | :--- | :--- |
| `/` | **Home** | Strategic Hero, portrait card, verified metrics strip, featured production systems, research cards, resilience highlight, contact form. |
| `/about` | **About Me** | Comprehensive biography, journey in technology, ULAB degree, IELTS/HackerRank scores, research agenda, engineering philosophy, and academic referees. |
| `/projects` | **Project Portfolio** | Searchable & filterable directory of all 14 projects across 9 categories with status labels. |
| `/projects/[slug]` | **Case Studies** | Deep dive into architecture diagrams, problem statements, solutions, challenges, and live demos. |
| `/live` | **Live Products** | Dedicated showcase for production apps with live URLs (Doctor J, AgroGPT, Snap & Get, Insta-Hygiene). |
| `/research` | **Research & Publications** | Academic portfolio: LLaMA-XR (MDPI Bioengineering), Lung Cancer 3D CNN, LegalSupportAI (RT4RJ JURIX), BibTeX citations, and PDF downloads. |
| `/experience` | **Career & Expertise** | Chronological timeline (ACI Limited, Elitbuzz, Lawyer Lagbe BD, LR Global, BD Apps) and 9-category skills visualizer. |
| `/videos` | **Knowledge Sharing** | Embedded technical demos (Rxpert literature review & QTPP walkthroughs). |
| `/writing` | **Technical Articles** | Articles on paper reading methodology, RAG system resilience, ES6 synopsis, and Redux architecture. |
| `/community` | **Speaking & Leadership** | ULAB 1971 History Club Presidency, ULAB Computer Society, Intelligent Minds mentoring, and technical workshops. |
| `/certificates` | **Credentials & Medals** | National Taekwondo Championships (2x Gold, Black Belt), Karate medals, degree transcripts, and HackerRank 5-Star SQL. |
| `/contact` | **Collaboration Inquiries** | Multi-intent inquiry transmission form with database persistence. |
| `/admin` | **Admin Dashboard** | Dynamic CMS: live metrics, full CRUD for projects, research, articles, videos, inquiries, and media library. |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js:** v18.x to v25.x
- **npm:** v9+

### 1. Clone & Install Dependencies
```bash
cd "Protfolio-Sumaiya Akter"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Defaults in `.env.local` are preconfigured for local development).*

### 3. Initialize & Seed Database
```bash
npm run db:seed
```
This automatically seeds the SQLite database (`data/portfolio.db`) with all 14 projects, 6 publications, 7 work experiences, 11 certifications, 4 articles, and 4 video demos, as well as the default admin user.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin CMS Authentication

- **Admin Login Route:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Email:** `sumaiya205.akter@gmail.com`
- **Default Password:** `Sumaiya@AI2026!`

*Note: Public admin registration is disabled. You can update the admin password anytime via `ADMIN_INITIAL_PASSWORD` in `.env.local` and running `npm run db:seed`.*

---

## 🐳 Docker Deployment

To build and run the production container:

```bash
# Using Docker Compose
docker-compose up -d --build

# View logs
docker-compose logs -f
```

The application will be accessible at [http://localhost:3000](http://localhost:3000). Persistent data and file uploads are stored in Docker volumes `portfolio_data` and `portfolio_uploads`.

---

## 🛡️ Security & Backup Strategy

1. **Database Backups:**
   - The SQLite database file resides at `data/portfolio.db`.
   - To perform a hot backup without downtime:
     ```bash
     sqlite3 data/portfolio.db ".backup data/backup_$(date +%Y%m%d_%H%M%S).db"
     ```
2. **Session Security:**
   - Authentication tokens are signed with HMAC-SHA256 (`JWT_SECRET`) and delivered via secure `httpOnly` cookies with `SameSite=Lax`.
3. **Data Isolation & IDOR Shielding:**
   - All mutations on `/api/projects/*`, `/api/research/*`, and `/api/articles/*` require a validated server session. Public endpoints are read-only.
