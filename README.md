# Sumaiya Akter — Senior AI Engineer, Software Architect & Researcher Portfolio

[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite / PostgreSQL](https://img.shields.io/badge/Database-SQLAlchemy_ORM-003B57?style=for-the-badge&logo=sqlite)](https://sqlite.org/)
[![Docker Ready](https://img.shields.io/badge/Docker-Multi--Container-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

A decoupled, production-grade digital identity, enterprise project showcase, and academic research portal engineered for **Sumaiya Akter** (Software Engineer – Backend, AI Team @ ACI Limited).

Positioned for:
1. **International Senior AI/ML Engineering & Backend Architecture opportunities.**
2. **Production AI consulting & technical leadership.**
3. **Fully funded PhD positions & academic research collaborations.**

---

## 🏛️ Decoupled Monorepo Architecture

The repository is cleanly partitioned into two independent, production-grade services:

```text
Protfolio-Sumaiya Akter/
├── backend/                        # Dedicated Python FastAPI REST API Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py             # Auth dependencies & bearer token verification
│   │   │   └── v1/
│   │   │       ├── endpoints/      # REST API route handlers
│   │   │       │   ├── auth.py     # JWT login & me verification
│   │   │       │   ├── projects.py # CRUD & slug lookup for 14 projects
│   │   │       │   ├── research.py # CRUD & slug lookup for 6 research papers
│   │   │       │   ├── articles.py # CRUD & slug lookup for 4 articles
│   │   │       │   ├── videos.py   # CRUD for 4 video demos
│   │   │       │   ├── experiences.py
│   │   │       │   ├── certifications.py
│   │   │       │   ├── inquiries.py# Client inquiry submission & tracking
│   │   │       │   ├── stats.py    # CMS metrics dashboard
│   │   │       │   └── media.py    # File upload & static asset management
│   │   │       └── router.py       # API v1 central router
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic v2 settings & CORS
│   │   │   ├── database.py         # SQLAlchemy engine & session manager
│   │   │   └── security.py         # Bcrypt hashing & PyJWT token generator
│   │   ├── models/
│   │   │   └── models.py           # Relational SQLAlchemy ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py          # Strict Pydantic request/response schemas
│   │   └── main.py                 # FastAPI application instance & middleware
│   ├── data/                       # Persistent SQLite database (`portfolio.db`)
│   ├── scripts/
│   │   └── seed.py                 # Comprehensive seed script (14 projects, 6 papers, etc.)
│   ├── uploads/                    # Media and document upload storage
│   ├── Dockerfile                  # Production container for backend
│   └── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, PyJWT, etc.)
│
├── frontend/                       # Dedicated Next.js 14 App Router Frontend
│   ├── public/
│   │   └── assets/
│   │       ├── images/             # Authentic portraits & verified UI screenshots
│   │       └── docs/               # Research paper manuscripts & academic transcripts
│   ├── src/
│   │   ├── app/                    # 11 public pages + complete dynamic admin CMS
│   │   │   ├── page.tsx            # Landing Hero & featured systems
│   │   │   ├── about/              # Professional biography, timeline, philosophy
│   │   │   ├── projects/           # Searchable directory & [slug] deep-dives
│   │   │   ├── live/               # Verified live production systems
│   │   │   ├── research/           # Academic research portfolio & [slug] deep-dives
│   │   │   ├── experience/         # Career timeline & skills visualizer
│   │   │   ├── videos/             # Video knowledge sharing & walkthroughs
│   │   │   ├── writing/            # Technical articles & blog
│   │   │   ├── community/          # Leadership, mentoring, club presidency
│   │   │   ├── certificates/       # Martial arts championships & technical awards
│   │   │   ├── contact/            # Inquiry form with intent routing
│   │   │   └── admin/              # Secured CMS dashboard & CRUD panels
│   │   ├── components/             # Reusable UI components (Navbar, Footer, etc.)
│   │   └── lib/
│   │       ├── api.ts              # Typed API client connecting to FastAPI backend
│   │       ├── db.ts               # Local SQLite fallback provider
│   │       ├── auth.ts             # JWT helper utilities
│   │       └── types.ts            # TypeScript interfaces matching backend models
│   ├── Dockerfile                  # Multi-stage production container for frontend
│   ├── package.json                # Next.js 14, Tailwind CSS, Lucide dependencies
│   └── tailwind.config.js          # Custom theme configuration
│
├── docker-compose.yml              # Root multi-container orchestration
├── package.json                    # Root npm scripts for running both services
└── README.md                       # Master architecture documentation
```

---

## ⚡ Quickstart & Local Development

### Prerequisites
- **Python:** 3.11+
- **Node.js:** 18+ (v20+ recommended)
- **Docker & Docker Compose:** (optional, for containerized run)

### Method 1: Root Unified Scripts (Recommended)

From the project root directory:

```bash
# 1. Install frontend dependencies
npm --prefix frontend install

# 2. Setup backend virtual environment
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/seed.py
cd ..

# 3. Run Backend (Port 8063)
npm run dev:backend

# 4. In a second terminal, Run Frontend (Port 3063)
npm run dev:frontend
```

Now open:
- **Frontend Application:** [http://localhost:3063](http://localhost:3063)
- **Backend Interactive API Docs (Swagger UI):** [http://localhost:8063/docs](http://localhost:8063/docs)
- **Backend Alternative Docs (ReDoc):** [http://localhost:8063/redoc](http://localhost:8063/redoc)
- **Backend Health Check:** [http://localhost:8063/health](http://localhost:8063/health)

---

### Method 2: Running Backend Independently

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database
python scripts/seed.py

# Launch development server
uvicorn app.main:app --reload --port 8063
```

---

### Method 3: Running Frontend Independently

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Seed frontend local database cache
npm run db:seed

# Launch Next.js development server
npm run dev
```

Open [http://localhost:3063](http://localhost:3063).

---

## 🐳 Docker Multi-Container Deployment

To spin up both the **FastAPI Backend** and the **Next.js Frontend** simultaneously in isolated production containers:

```bash
# Build and start all services
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Stop all services
docker compose down
```

The services will be live at:
- **Frontend:** `http://localhost:3063`
- **Backend API:** `http://localhost:8063`
- **Interactive API Documentation:** `http://localhost:8063/docs`

---

## 📡 REST API Reference (`backend/`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status check | No |
| `POST` | `/api/v1/auth/login` | Obtain JWT access token via email & password | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated admin details | Yes (Bearer Token) |
| `GET` | `/api/v1/projects/` | List all projects (filters: `category`, `status`, `featured`) | No |
| `GET` | `/api/v1/projects/{slug}` | Retrieve full project case study by slug | No |
| `POST` | `/api/v1/projects/` | Create a new project | Yes |
| `PUT` | `/api/v1/projects/{id}` | Update an existing project | Yes |
| `DELETE` | `/api/v1/projects/{id}` | Delete a project | Yes |
| `GET` | `/api/v1/research/` | List all research publications (filters: `category`, `status`) | No |
| `GET` | `/api/v1/research/{slug}` | Retrieve full research publication by slug | No |
| `POST` | `/api/v1/research/` | Create a research publication entry | Yes |
| `PUT` | `/api/v1/research/{id}` | Update a research entry | Yes |
| `DELETE` | `/api/v1/research/{id}` | Delete a research entry | Yes |
| `GET` | `/api/v1/articles/` | List technical articles & tutorials | No |
| `GET` | `/api/v1/articles/{slug}` | Read single technical article | No |
| `GET` | `/api/v1/videos/` | List technical demonstration videos | No |
| `GET` | `/api/v1/experiences/` | Chronological career & leadership timeline | No |
| `GET` | `/api/v1/certifications/` | List awards, martial arts medals, and certificates | No |
| `POST` | `/api/v1/inquiries/` | Submit a collaboration / hiring inquiry | No |
| `GET` | `/api/v1/inquiries/` | List all client inquiries | Yes |
| `PATCH` | `/api/v1/inquiries/{id}/status` | Update inquiry workflow status (`reviewed`, `replied`) | Yes |
| `GET` | `/api/v1/stats/` | Dashboard metrics for projects, papers, inquiries | Yes |
| `POST` | `/api/v1/media/upload` | Upload images, documents, or demo assets | Yes |

---

## 🔐 Admin CMS Credentials

- **Admin Login Page:** [http://localhost:3063/admin/login](http://localhost:3063/admin/login)
- **Default Email:** `sumaiya205.akter@gmail.com`
- **Default Password:** `Sumaiya@AI2026!`

*Security Note: You can rotate the admin password by changing `ADMIN_INITIAL_PASSWORD` in `backend/.env` or `backend/app/core/config.py` and re-running `python scripts/seed.py`.*

---

## 🧪 Testing and Verification

To verify the complete backend API suite:

```bash
cd backend
.venv/bin/python -c "
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.abspath('.'))
from app.main import app
client = TestClient(app)

assert client.get('/health').status_code == 200
assert len(client.get('/api/v1/projects/').json()) == 14
assert len(client.get('/api/v1/research/').json()) == 6
assert len(client.get('/api/v1/experiences/').json()) == 7
assert len(client.get('/api/v1/certifications/').json()) == 11
print('All 12 backend verification tests passed!')
"
```

To build and verify the frontend:

```bash
cd frontend
npm run build
```

---

## 🛡️ License & Copyright
© 2026 Sumaiya Akter. All rights reserved. Built with precision for production engineering and academic research excellence.
