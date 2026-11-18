const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'portfolio.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('--- Initializing Database Schema ---');

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    role TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    thumbnail TEXT NOT NULL,
    gallery TEXT,
    summary TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    solution_overview TEXT NOT NULL,
    architecture_details TEXT NOT NULL,
    architecture_diagram TEXT,
    engineering_challenges TEXT NOT NULL,
    key_features TEXT NOT NULL,
    technologies TEXT NOT NULL,
    measurable_outcomes TEXT,
    live_url TEXT,
    github_url TEXT,
    paper_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    authors TEXT NOT NULL,
    venue TEXT NOT NULL,
    year INTEGER NOT NULL,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    abstract TEXT NOT NULL,
    methodology TEXT NOT NULL,
    dataset_details TEXT,
    key_findings TEXT NOT NULL,
    metrics TEXT,
    pdf_url TEXT,
    arxiv_url TEXT,
    doi TEXT,
    bibtex TEXT,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    read_time_minutes INTEGER DEFAULT 5,
    published_date TEXT NOT NULL,
    tags TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration TEXT NOT NULL,
    topics TEXT NOT NULL,
    related_project_slug TEXT,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    period TEXT NOT NULL,
    location TEXT NOT NULL,
    is_current INTEGER DEFAULT 0,
    responsibilities TEXT NOT NULL,
    achievements TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    badge TEXT,
    pdf_url TEXT
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    intent TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS media_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    folder TEXT DEFAULT 'general',
    alt_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('--- Clearing existing seed data ---');
db.exec(`
  DELETE FROM projects;
  DELETE FROM publications;
  DELETE FROM articles;
  DELETE FROM videos;
  DELETE FROM experiences;
  DELETE FROM certifications;
  DELETE FROM media_assets;
`);

// 1. Admin User
const adminEmail = process.env.ADMIN_EMAIL || 'sumaiya205.akter@gmail.com';
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Sumaiya@AI2026!';
const passwordHash = bcrypt.hashSync(adminPassword, 10);

const upsertAdmin = db.prepare(`
  INSERT INTO admin_users (email, password_hash, role)
  VALUES (?, ?, 'admin')
  ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash
`);
upsertAdmin.run(adminEmail, passwordHash);
console.log(`Admin user seeded: ${adminEmail}`);

// 2. Projects Seeding
const insertProject = db.prepare(`
  INSERT INTO projects (
    title, slug, tagline, category, status, role, featured, order_index,
    thumbnail, gallery, summary, problem_statement, solution_overview,
    architecture_details, architecture_diagram, engineering_challenges,
    key_features, technologies, measurable_outcomes, live_url, github_url, paper_url
  ) VALUES (
    @title, @slug, @tagline, @category, @status, @role, @featured, @order_index,
    @thumbnail, @gallery, @summary, @problem_statement, @solution_overview,
    @architecture_details, @architecture_diagram, @engineering_challenges,
    @key_features, @technologies, @measurable_outcomes, @live_url, @github_url, @paper_url
  )
`);

const projects = [
  // 1. Doctor J (Featured 1)
  {
    title: 'Doctor J (MedGPT / MedAssist AI)',
    slug: 'doctor-j',
    tagline: 'Production AI healthcare platform with multimodal vision, streaming clinical reasoning, and IDOR compliance.',
    category: 'Healthcare Technology',
    status: 'Live in Production',
    role: 'Lead Backend AI Engineer & Architect',
    featured: 1,
    order_index: 1,
    thumbnail: '/assets/images/doctorj-hero.webp',
    gallery: JSON.stringify(['/assets/images/doctorj-hero.webp', '/assets/images/rxpert-fig1_pipeline.webp']),
    summary: 'A mission-critical clinical AI platform engineered with FastAPI, PostgreSQL, Redis, Next.js 14, and Google Gemini Vision. Capable of analyzing complex medical artifacts including X-Rays, MRIs, CT scans, and multi-page lab reports while maintaining strict patient data isolation, atomic Lua rate-limits, and a 5-key dynamic rotation manager.',
    problem_statement: 'Clinical diagnostic workflows suffer from heavy physician fatigue, delayed second-opinion turnaround, and manual data transcription overhead. General LLMs fail in medical environments due to hallucinations, lack of vision grounding on raw radiology scans, and unpredictable API latency.',
    solution_overview: 'Doctor J integrates an end-to-end multimodal diagnostic pipeline: Gemini 2.5/1.5 Flash Vision for artifact analysis, server-authoritative Redis/PostgreSQL streaming persistence, atomic Lua-scripted rate limiting, a 5-key automatic rotation manager with 60-second cooldown resilience, and IDOR prevention ensuring tenant-level isolation.',
    architecture_details: 'Edge reverse proxy via Nginx 1.27 with Cloudflare Tunnel termination (stage.doctorj.health). Presentation tier in Next.js 14 App Router with Zustand stores and SSR-safe localization. Core API Gateway powered by FastAPI with Prometheus instrumentation, routing to clinical task classifiers, MinIO S3 object storage, and vector retrieval pipelines.',
    architecture_diagram: `flowchart TD
  Client["Web / PWA / Mobile"] --> Nginx["Nginx Edge Proxy"]
  Nginx --> FastApi["FastAPI Gateway (Port 18000)"]
  FastApi --> Auth["JWT & Google Auth (IDOR Check)"]
  FastApi --> Vision["Multimodal Vision (X-Ray/MRI/CT)"]
  FastApi --> DocOcr["Prescription OCR & Dosage Evaluator"]`,
    engineering_challenges: 'Handling upstream Gemini rate limits and quota failures during peak hospital hours: Built a resilient 5-key rotation manager with 60s cooldown and atomic Redis Lua token buckets.',
    key_features: JSON.stringify([
      'Multimodal Medical Imaging: Instant diagnosis on X-Ray, CT scans, MRI, and skin pathology.',
      'Prescription OCR: Accurate extraction of handwritten dosages, brand names, and generic drug schedules.',
      '5-Key Rotation Manager: Zero downtime with automated fallback across API quotas.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'PostgreSQL', 'Redis', 'Gemini Vision', 'Next.js 14', 'Celery', 'Docker']),
    measurable_outcomes: 'Deployed at stage.doctorj.health; sub-800ms time-to-first-token on streaming medical explanations.',
    live_url: 'https://stage.doctorj.health',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: '/research/llama-xr-radiology-report'
  },

  // 2. AgroGPT (Featured 2)
  {
    title: 'AgroGPT (Agro-GPT v2)',
    slug: 'agrogpt',
    tagline: 'Production agricultural AI platform featuring crop disease detection, localized Bangla voice interaction, and weather intelligence.',
    category: 'AI & Machine Learning',
    status: 'Live in Production',
    role: 'AI Engineer & System Architect',
    featured: 1,
    order_index: 2,
    thumbnail: '/assets/images/agrogpt-hero.webp',
    gallery: JSON.stringify(['/assets/images/agrogpt-hero.webp', '/assets/images/agrogpt-web.webp']),
    summary: 'A production agricultural AI platform engineered for rural farmers across Bangladesh. Delivers real-time multimodal crop disease detection, native localized Bangla voice recognition via Whisper, district-level microclimate weather alerts, and crop market pricing feeds over low-bandwidth mobile networks.',
    problem_statement: 'Over 60% of smallholder farmers suffer severe crop losses due to unaddressed fungal and bacterial leaf diseases and lack access to agricultural extension officers.',
    solution_overview: 'Engineered a lightweight, mobile-first AI platform integrating computer vision for instant leaf lesion classification with streaming voice processing in native rural Bangla dialects.',
    architecture_details: 'FastAPI microservices communicating over WebSockets for bi-directional audio streaming, connected to Gemini Vision for pathological leaf segmentation and Redis for weather caching.',
    architecture_diagram: `flowchart LR
  Farmer["Farmer Mobile Device"] --> WS["WebSocket Gateway"]
  WS --> Whisper["Bangla Speech-to-Text"]
  WS --> VisionAI["Leaf Pathology Classifier"]
  VisionAI --> Diagnosis["Treatment Prescription & Dosage"]`,
    engineering_challenges: 'Ensuring real-time voice streaming and image classification under 2G/3G mobile connectivity: Implemented adaptive image compression and client-side audio chunking.',
    key_features: JSON.stringify([
      'Multimodal Crop Pathology: Identifies rice blast, bacterial blight, and corn rust from camera photos.',
      'Localized Bangla Voice: Full conversational voice interaction adapted for regional agricultural dialects.',
      'Microclimate Weather & Market Rates: Real-time agricultural pricing and localized rainfall forecasts.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'WebSockets', 'Gemini Vision', 'Whisper', 'React', 'Redis', 'Docker']),
    measurable_outcomes: 'Over 94% diagnostic accuracy across 18 major regional crop pathologies; operational response time under 1.2s.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 3. Snap & Get (Featured 3)
  {
    title: 'Snap & Get',
    slug: 'snap-and-get',
    tagline: 'AI visual search and e-commerce product discovery engine with automated merchant price aggregation.',
    category: 'Computer Vision',
    status: 'Live in Production',
    role: 'Computer Vision & Backend Engineer',
    featured: 1,
    order_index: 3,
    thumbnail: '/assets/images/snap-and-get.webp',
    gallery: JSON.stringify(['/assets/images/snap-and-get.webp']),
    summary: 'A production mobile and backend system enabling shoppers to photograph any retail item or garment and instantly discover matching catalog products, compare merchant pricing, and receive purchasing recommendations.',
    problem_statement: 'Traditional text-based retail search fails when users do not know the exact brand name, model, or product terminology.',
    solution_overview: 'Built a visual search pipeline utilizing edge camera image capture, Gemini Vision feature embeddings, MinIO S3 temporary artifact caching, and asynchronous Celery worker pipelines.',
    architecture_details: 'Flutter client communicating with FastAPI gateway, image processing pipeline with background Celery workers, MinIO object storage, and Redis cache.',
    architecture_diagram: `flowchart TD
  Camera["User Snap"] --> Upload["MinIO S3 Pre-Signed Upload"]
  Upload --> Vision["Gemini Feature Extractor"]
  Vision --> Catalog["Vector Match Against Merchant Inventory"]
  Catalog --> Result["Aggregated Price Comparison"]`,
    engineering_challenges: 'Minimizing image transfer latency from mobile clients while executing multi-store price comparisons in parallel.',
    key_features: JSON.stringify([
      'Visual Feature Matching: Matches colors, patterns, and item geometries against catalog databases.',
      'Merchant Aggregation: Real-time cross-store price comparison and discount alerts.',
      'Asynchronous Processing: Celery distributed job queue with MinIO S3 object storage.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Gemini Vision', 'MinIO', 'Redis', 'Flutter', 'Celery', 'Docker']),
    measurable_outcomes: 'Sub-2 second end-to-end search latency from mobile photo upload to price-ranked product carousel.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 4. Rxpert Platform (Featured 4)
  {
    title: 'Healthcare RxPERT AI (QTPP & Formulation)',
    slug: 'rxpert-pharmaceutical',
    tagline: 'Enterprise pharmaceutical intelligence platform for QTPP synthesis, formulation matching, and regulatory literature synthesis.',
    category: 'Enterprise Systems',
    status: 'Production-Ready',
    role: 'Lead Architect & Module Lead',
    featured: 1,
    order_index: 4,
    thumbnail: '/assets/images/rxpert-fig1_pipeline.webp',
    gallery: JSON.stringify(['/assets/images/rxpert-fig1_pipeline.webp', '/assets/images/rxpert-qtpp.webp', '/assets/images/rxpert-formulation.webp']),
    summary: 'An enterprise pharmaceutical R&D platform engineered to synthesize Quality Target Product Profiles (QTPP), predict Critical Quality Attributes (CQA), evaluate excipient compatibility, and extract regulatory knowledge from FDA guidances and pharmacopeias under strict ALCOA+ data integrity standards.',
    problem_statement: 'Drug formulation feasibility takes pharmaceutical scientists 3-6 months of manual literature searching, monograph cross-referencing, and formulation trial-and-error.',
    solution_overview: 'Constructed an end-to-end pharmaceutical R&D workspace: RLD characterization, dosage form specification, automated QTPP/CQA synthesis, and formulation excipient matching backed by PostgreSQL and ChromaDB.',
    architecture_details: 'Modular FastAPI monolith under strict bounded contexts (Formulation, API Selection, QTPP, Literature Review), PostgreSQL permanent storage, MinIO artifact bucket, and Redis Celery workers.',
    architecture_diagram: `flowchart TD
  User["Formulation Scientist"] --> UI["Next.js 15 App Router"]
  UI --> API["FastAPI Modular Monolith"]
  API --> QTPP["QTPP & CQA Engine"]
  API --> Form["Excipient Compatibility Analyzer"]
  API --> DB[("PostgreSQL ALCOA+ Audit Trail")]`,
    engineering_challenges: 'Enforcing strict module isolation and 21 CFR Part 11 audit trails without cross-module database imports.',
    key_features: JSON.stringify([
      'QTPP & CQA Synthesis: Automated extraction of target dissolution, assay, and bioequivalence parameters.',
      'Excipient Compatibility Matrix: Evaluates drug-excipient interactions and physicochemical stability.',
      'ALCOA+ Compliance: Tamper-evident audit logging for pharmaceutical regulatory inspections.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js 15', 'PostgreSQL', 'LangChain', 'MinIO', 'ChromaDB', 'Docker']),
    measurable_outcomes: 'Reduces formulation feasibility research timeline from weeks to minutes with zero data tampering risk.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 5. RA Script (Featured 5)
  {
    title: 'RA Script (Pharmaceutical AI Regulatory Affairs)',
    slug: 'ra-script',
    tagline: 'AI-powered pharmaceutical regulatory affairs platform for CTD/eCTD dossier analysis, module drafting, and compliance auditing.',
    category: 'Enterprise Systems',
    status: 'Production-Ready',
    role: 'System Architect & AI Engineer',
    featured: 1,
    order_index: 5,
    thumbnail: '/assets/images/rascript-hero.webp',
    gallery: JSON.stringify(['/assets/images/rascript-hero.webp']),
    summary: 'An enterprise regulatory affairs copilot designed for pharmaceutical dossier specialists. Analyzes Common Technical Document (CTD) and electronic CTD (eCTD) modules, flags regulatory inconsistencies across sections, and generates audit-ready compliance verification reports.',
    problem_statement: 'Pharmaceutical regulatory submissions often span hundreds of complex documents where minor terminology or dosage discrepancies result in costly agency rejection cycles.',
    solution_overview: 'Created an intelligent regulatory review system combining LangChain document extraction, consistency validation rules, and tamper-evident audit logging compliant with 21 CFR Part 11.',
    architecture_details: 'FastAPI microservices, Celery asynchronous queue for long-running document analysis, PostgreSQL relational database, and Next.js management dashboard.',
    architecture_diagram: `flowchart LR
  Dossier["eCTD Dossier (PDF/XML)"] --> Ingest["Document Parser"]
  Ingest --> Celery["Celery Task Queue"]
  Celery --> LLM["Regulatory Consistency Verifier"]
  LLM --> Audit["21 CFR Part 11 Compliance Report"]`,
    engineering_challenges: 'Parsing deeply nested eCTD XML hierarchies and ensuring deterministic consistency checking across multi-gigabyte document batches.',
    key_features: JSON.stringify([
      'eCTD Module Validation: Validates Module 1 through Module 5 cross-references and nomenclature.',
      'Discrepancy Detection: Identifies contradictions between clinical summaries and packaging inserts.',
      '21 CFR Part 11 Audit Trail: Cryptographically verified action logs for FDA/EMA inspection.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'LangChain', 'Celery', 'PostgreSQL', 'Next.js', 'Docker', 'Redis']),
    measurable_outcomes: 'Identifies 99.2% of cross-module regulatory formatting and consistency defects prior to agency submission.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 6. Insta-Hygiene (Featured 6)
  {
    title: 'Insta-Hygiene',
    slug: 'insta-hygiene',
    tagline: 'Multi-vendor hygiene e-commerce platform with automated inventory reconciliation and role-based access control.',
    category: 'Full-Stack Software',
    status: 'Live in Production',
    role: 'Lead Full-Stack & DevOps Engineer',
    featured: 1,
    order_index: 6,
    thumbnail: '/assets/images/instahygiene-hero.webp',
    gallery: JSON.stringify(['/assets/images/instahygiene-hero.webp']),
    summary: 'A production multi-vendor hygiene and sanitary supplies e-commerce platform engineered with FastAPI, Next.js, Redis, and PostgreSQL. Features real-time stock allocation, automated order fulfillment pipelines, role-based vendor dashboards, and containerized cloud deployment.',
    problem_statement: 'High concurrency during bulk procurement spikes leads to overselling, race conditions in stock reservation, and fragmented vendor payouts.',
    solution_overview: 'Implemented atomic Redis stock reservation with TTL lock expiration, pessimistic locking on checkout mutations, and isolated vendor portal dashboards.',
    architecture_details: 'Next.js client interface with responsive Tailwind design, FastAPI backend API, Redis for session and cart state, PostgreSQL for transactional integrity, and Docker orchestration.',
    architecture_diagram: `flowchart TD
  Buyer["Customer Browser"] --> Cart["Redis Session Cart"]
  Cart --> Lock["Atomic Inventory Reservation"]
  Lock --> Checkout["Payment Gateway"]
  Checkout --> DB[("PostgreSQL Order Ledger")]`,
    engineering_challenges: 'Eliminating race conditions during flash discounts and peak multi-vendor bulk orders.',
    key_features: JSON.stringify([
      'Multi-Vendor Portals: Isolated vendor inventory management, sales reporting, and payout tracking.',
      'Atomic Cart Reservation: Prevents inventory overselling through Redis distributed locks.',
      'Production Docker Deployment: Fully containerized with health checks and automated migrations.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js 14', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS']),
    measurable_outcomes: 'Zero inventory oversell incidents recorded; handles sub-50ms cart mutation latency under high concurrent load.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 7. LabInsight (Pharmaceutical QC & LIMS)
  {
    title: 'LabInsight (Pharmaceutical QC Laboratory & LIMS)',
    slug: 'labinsight',
    tagline: 'Comprehensive QC laboratory information management system compliant with EU GMP Annex 11 and 21 CFR Part 11.',
    category: 'Enterprise Systems',
    status: 'Production-Ready',
    role: 'Lead Architect & Full-Stack Engineer',
    featured: 0,
    order_index: 7,
    thumbnail: '/assets/images/labinsight-hero.webp',
    gallery: JSON.stringify(['/assets/images/labinsight-hero.webp']),
    summary: 'A compliant QC Laboratory Information Management System (LIMS) for pharmaceutical manufacturing plants. Manages sample lifecycles, out-of-specification (OOS) investigations, stability study scheduling, analytical instrument calibrations, and ALCOA+ data integrity audits.',
    problem_statement: 'Manual paper logbooks in pharmaceutical QC laboratories introduce transcription errors, risk data integrity citations during regulatory audits, and delay batch release.',
    solution_overview: 'Built a 21 CFR Part 11 compliant digital laboratory platform with cryptographic audit trails, dual-analyst review workflows, and automated instrument data ingestion.',
    architecture_details: 'Next.js 15 presentation tier, FastAPI backend microservices, PostgreSQL with audit trigger schemas, MinIO S3 for analytical raw data files, and Docker deployment.',
    architecture_diagram: `flowchart TD
  Sample["QC Sample Intake"] --> Test["Analytical Testing (HPLC/UV)"]
  Test --> Review["Dual-Analyst Electronic Signature"]
  Review --> Audit["ALCOA+ Cryptographic Audit Log"]
  Audit --> Release["Certificate of Analysis (CoA) Release"]`,
    engineering_challenges: 'Architecting immutable, tamper-evident audit logging for all analytical result modifications to pass FDA and WHO GMP inspections.',
    key_features: JSON.stringify([
      'ALCOA+ Data Integrity: Attributable, legible, contemporaneous, original, and accurate data governance.',
      'OOS & OOT Investigation: Automated root-cause analysis workflow for out-of-specification test results.',
      'Instrument Calibration Tracking: Automated preventive maintenance and calibration alerts.'
    ]),
    technologies: JSON.stringify(['Next.js 15', 'FastAPI', 'PostgreSQL', 'MinIO', 'Docker', 'TypeScript']),
    measurable_outcomes: 'Eliminated 100% of manual transcription discrepancies; reduced batch release turnaround by 45%.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 8. Career Radar (Job Radar)
  {
    title: 'Career Radar (Job Radar)',
    slug: 'job-radar',
    tagline: 'Autonomous career and academic opportunity discovery crawler with AI semantic resume matching.',
    category: 'AI & Machine Learning',
    status: 'Live in Production',
    role: 'System Architect & Python Engineer',
    featured: 0,
    order_index: 8,
    thumbnail: '/assets/images/jobradar-hero.webp',
    gallery: JSON.stringify(['/assets/images/jobradar-hero.webp']),
    summary: 'An autonomous multi-portal career and academic opportunity intelligence platform. Periodically scrapes and aggregates openings across Bdjobs, Skilljobs, AllJobs, and university fellowship portals, categorizing opportunities using NLP and computing semantic fit against applicant profiles.',
    problem_statement: 'Job seekers and academic researchers waste hundreds of hours manually browsing fractured employment portals and filtering irrelevant openings.',
    solution_overview: 'Engineered a resilient crawler fleet with anti-detection headers, automated deduping, and a vector matching engine that ranks listings by candidate qualification fit.',
    architecture_details: 'Python 3.12, FastAPI, BeautifulSoup4 and Playwright scrapers, Redis job queues, PostgreSQL storage, and Next.js 15 frontend interface.',
    architecture_diagram: `flowchart LR
  Portals["Job Portals (Bdjobs/Skilljobs)"] --> Scrapers["Playwright & BS4 Crawlers"]
  Scrapers --> Queue["Redis Work Queue"]
  Queue --> Parser["NLP Entity & Skill Extractor"]
  Parser --> DB[("PostgreSQL Deduplicated Catalog")]`,
    engineering_challenges: 'Handling dynamic JavaScript hydration and bot-detection heuristics across diverse job boards while maintaining high crawler throughput.',
    key_features: JSON.stringify([
      'Multi-Portal Aggregation: Unifies national and academic employment portals into a single live feed.',
      'Semantic Resume Match: Computes contextual similarity score between resume text and job requirements.',
      'Automated Alert Engine: Instant notification when high-match opportunities are published.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js 15', 'Python 3.12', 'Playwright', 'Redis', 'PostgreSQL']),
    measurable_outcomes: 'Indexes over 5,000 active opportunities daily with 98% field extraction precision.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 9. ACI ReportCraft
  {
    title: 'ACI ReportCraft',
    slug: 'aci-reportcraft',
    tagline: 'Enterprise financial reporting and AI-powered executive management commentary platform.',
    category: 'Enterprise Systems',
    status: 'Live in Production',
    role: 'Backend & Data Engineer',
    featured: 0,
    order_index: 9,
    thumbnail: '/assets/images/reportcraft-hero.webp',
    gallery: JSON.stringify(['/assets/images/reportcraft-hero.webp']),
    summary: 'A production enterprise platform automating corporate financial reporting, variance analysis, and executive commentary generation across business conglomerates. Pulls ERP transactional ledgers, performs statistical variance calculations, and generates board-level narrative decks.',
    problem_statement: 'Finance teams spend days manually consolidating spreadsheets and writing variance commentary before monthly executive board meetings.',
    solution_overview: 'Developed an automated pipeline that computes revenue, margin, and cost variances against budgets and leverages fine-tuned LLMs to draft accurate management commentary.',
    architecture_details: 'FastAPI core, PostgreSQL ledger store, Celery task workers for spreadsheet parsing, Next.js analytical dashboards, and Docker production deployment.',
    architecture_diagram: `flowchart TD
  ERP["ERP / SAP Ledgers"] --> Ingest["Financial Data Ingestion"]
  Ingest --> Variance["Variance Calculation Engine"]
  Variance --> Commentary["AI Executive Commentary Generator"]
  Commentary --> Deck["Formatted PDF / Web Executive Report"]`,
    engineering_challenges: 'Guaranteed mathematical precision: AI commentary is constrained by strict factual guards ensuring generated narratives exactly match raw accounting totals.',
    key_features: JSON.stringify([
      'Automated Variance Analysis: Real-time calculation of EBITDA, gross margin, and overhead variances.',
      'Executive Narrative Generation: Synthesizes high-level board commentary explaining operational drivers.',
      'Thin Deployment Pattern: Zero-downtime containerized deployment with reverse proxy integration.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js', 'PostgreSQL', 'Docker', 'Celery', 'TimescaleDB']),
    measurable_outcomes: 'Shortened monthly financial close reporting cycle by 70%; adopted across divisional finance units.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 10. Sales & Demand Forecast
  {
    title: 'Sales & Demand Forecasting Platform',
    slug: 'sales-demand-forecast',
    tagline: 'Enterprise AI demand prediction engine with time-series forecasting and supply chain optimization.',
    category: 'AI & Machine Learning',
    status: 'Live in Production',
    role: 'Machine Learning & Backend Engineer',
    featured: 0,
    order_index: 10,
    thumbnail: '/assets/images/sales-forecast-hero.webp',
    gallery: JSON.stringify(['/assets/images/sales-forecast-hero.webp']),
    summary: 'An enterprise demand forecasting system deployed for retail and manufacturing distribution networks. Predicts SKU-level future sales volumes by factoring in historical time-series trends, promotional campaigns, seasonal variations, and regional distributor purchase orders.',
    problem_statement: 'Supply chain stockouts and excess inventory write-offs cost manufacturing enterprises millions annually due to inaccurate manual sales projections.',
    solution_overview: 'Built an end-to-end forecasting pipeline combining historical time-series modeling with external macroeconomic indicators and automated model re-training.',
    architecture_details: 'FastAPI microservices, TimescaleDB optimized time-series persistence, Python ML modeling stack, Celery background worker fleet, and Docker containers.',
    architecture_diagram: `flowchart LR
  Historical["Historical Sales DB"] --> Preprocess["Seasonality & Outlier Cleaning"]
  Preprocess --> Model["Ensemble Time-Series Forecasting"]
  Model --> Optimization["Safety Stock & Reorder Point Engine"]
  Optimization --> ERP["ERP Purchase Order Sync"]`,
    engineering_challenges: 'Maintaining low inference latency across 10,000+ distinct SKU time-series simultaneously.',
    key_features: JSON.stringify([
      'SKU-Level Demand Forecasting: Multi-horizon predictions with statistical confidence intervals.',
      'Safety Stock Recommendation: Computes dynamic reorder points to prevent distribution stockouts.',
      'Promotion Impact Modeling: Adjusts forecast trajectories for seasonal marketing campaigns.'
    ]),
    technologies: JSON.stringify(['Python ML', 'FastAPI', 'TimescaleDB', 'Celery', 'Redis', 'Docker']),
    measurable_outcomes: 'Achieved Mean Absolute Percentage Error (MAPE) below 4.5% across flagship consumer SKUs.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 11. Formora (AI Application Copilot)
  {
    title: 'Formora (AI Application Copilot)',
    slug: 'formora',
    tagline: 'Human-in-the-loop AI copilot and Chrome extension for legitimate public online applications with zero hallucination.',
    category: 'RAG & AI Agents',
    status: 'Production-Ready',
    role: 'Lead Architect & Extension Developer',
    featured: 0,
    order_index: 11,
    thumbnail: '/assets/images/formora-hero.webp',
    gallery: JSON.stringify(['/assets/images/formora-hero.webp']),
    summary: 'A production-grade AI platform and Manifest V3 Chrome Extension that assists applicants in completing online application portals for universities, fellowships, grants, and jobs. Extracts criteria, validates user credentials, and provides human-in-the-loop autofill with absolute zero hallucination guarantees.',
    problem_statement: 'Complex public application forms are tedious, error-prone, and often cause qualified applicants to be rejected due to minor formatting mistakes or missing documents.',
    solution_overview: 'Engineered a browser-integrated copilot that parses DOM form elements, matches them against verified user knowledge bases, and assists applicants while keeping human approval mandatory.',
    architecture_details: 'Chrome Extension MV3 client, Next.js frontend, FastAPI backend server with Playwright document analysis and local vector matching.',
    architecture_diagram: `flowchart TD
  Extension["Chrome MV3 Extension"] --> DOM["DOM Form Inspector"]
  DOM --> Copilot["FastAPI Formora Agent"]
  Copilot --> UserVault["Verified Candidate Data Vault"]
  Copilot --> Preview["Human Approval Dialog"]
  Preview --> Form["Safe Verified Autofill"]`,
    engineering_challenges: 'Ensuring zero hallucination on formal legal and academic forms: Built strict rule-based grounding where only verified user data can populate fields.',
    key_features: JSON.stringify([
      'Zero Hallucination Autofill: Enforces deterministic grounding on verified candidate credentials.',
      'Human-in-the-Loop Safety: Every field mutation requires explicit user visual confirmation.',
      'Manifest V3 Extension: Secure, modern Chrome extension respecting strict content security policies.'
    ]),
    technologies: JSON.stringify(['Chrome MV3', 'Next.js', 'FastAPI', 'Playwright', 'TypeScript', 'Tailwind CSS']),
    measurable_outcomes: 'Reduces application completion time from 90 minutes to under 12 minutes with 100% data fidelity.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 12. SmartBiz AI & Unifi Suite
  {
    title: 'SmartBiz AI & Unifi Suite ERP',
    slug: 'smartbiz-ai',
    tagline: 'Multi-tenant commercial retail ERP and SaaS subscription platform with real-time POS and inventory synchronization.',
    category: 'Enterprise Systems',
    status: 'Live in Production',
    role: 'Lead Architect & Full-Stack Engineer',
    featured: 0,
    order_index: 12,
    thumbnail: '/assets/images/smartbiz-hero.webp',
    gallery: JSON.stringify(['/assets/images/smartbiz-hero.webp']),
    summary: 'A commercial retail ERP and multi-tenant SaaS business platform built for retail chains and e-commerce enterprises. Includes lightning-fast barcode POS checkout, multi-warehouse inventory reconciliation, customer credit ledgers, automated purchase orders, and tenant-isolated analytics.',
    problem_statement: 'Retailers face fragmentation between offline store POS checkouts, online inventories, and back-office accounting ledgers.',
    solution_overview: 'Created an all-in-one modular monolith architecture with PostgreSQL row-level tenant security, real-time WebSocket POS sync, and automated accounting double-entry ledgers.',
    architecture_details: 'FastAPI backend modular services, Next.js 14 responsive application, PostgreSQL database with tenant isolation, Redis caching, and Docker orchestration.',
    architecture_diagram: `flowchart LR
  POS["Retail Store POS Terminal"] --> Ingress["Tenant Secure Gateway"]
  Ingress --> Inventory["Real-Time Stock Synchronizer"]
  Ingress --> Ledger["Accounting Double-Entry Service"]
  Inventory --> DB[("PostgreSQL Multi-Tenant")]`,
    engineering_challenges: 'Guaranteeing offline-resilient POS checkout functionality during temporary internet connectivity outages.',
    key_features: JSON.stringify([
      'Real-Time POS Checkout: High-speed barcode scanning with thermal receipt printing.',
      'Multi-Branch Inventory: Live stock transfers between central warehouses and retail outlets.',
      'Tenant Row-Level Security: Complete physical/logical data isolation between competing businesses.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js 14', 'PostgreSQL', 'Redis', 'Docker', 'WebSockets']),
    measurable_outcomes: 'Successfully deployed across commercial retail branches with sub-100ms barcode scanning latency.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 13. Markhub (AI Marketing SaaS)
  {
    title: 'Markhub (AI Marketing Manager SaaS)',
    slug: 'markhub',
    tagline: 'Automated AI business marketing manager SaaS for multi-channel campaign generation, scheduling, and analytics.',
    category: 'Generative AI & LLMs',
    status: 'Production-Ready',
    role: 'System Architect & AI Engineer',
    featured: 0,
    order_index: 13,
    thumbnail: '/assets/images/markhub-hero.webp',
    gallery: JSON.stringify(['/assets/images/markhub-hero.webp']),
    summary: 'A low-cost, highly automated AI marketing manager platform built for startups and growing enterprises. Automatically analyzes brand identity, writes localized campaign copy, generates creative image prompts, and orchestrates scheduled publishing across social channels.',
    problem_statement: 'Small businesses struggle to maintain consistent social media presence and cannot afford dedicated marketing agency retainers.',
    solution_overview: 'Architected an autonomous marketing pipeline that generates brand-aligned content calendars, coordinates approval workflows, and manages publishing queues.',
    architecture_details: 'FastAPI backend, Next.js 16 App Router, Celery task workers with Redis transport, PostgreSQL database, and social platform API integrations.',
    architecture_diagram: `flowchart TD
  Brand["Brand Profile & Goals"] --> Calendar["AI Monthly Content Planner"]
  Calendar --> Generator["Copy & Creative Visual Prompts"]
  Generator --> Approval["Client Approval Flow"]
  Approval --> Scheduler["Automated Publishing Dispatcher"]`,
    engineering_challenges: 'Managing token consumption and API costs while maintaining distinct brand tones for multiple client workspaces.',
    key_features: JSON.stringify([
      'Automated Content Calendars: Generates 30-day cross-platform marketing schedules in seconds.',
      'Multi-Channel Publishing: Automated dispatching to Facebook, LinkedIn, Instagram, and Twitter.',
      'Engagement Analytics Dashboard: Tracks reach, click-through rates, and follower growth.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js 16', 'Celery', 'Redis', 'PostgreSQL', 'Docker']),
    measurable_outcomes: 'Saves businesses 20+ hours per week in campaign drafting with 3x higher posting consistency.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 14. AI Estimator
  {
    title: 'AI Estimator (Construction Proposal OS)',
    slug: 'ai-estimator',
    tagline: 'AI-powered construction estimation platform for architectural blueprint analysis, quantity takeoff, and cost estimation.',
    category: 'AI & Machine Learning',
    status: 'Production-Ready',
    role: 'AI Engineer & Full-Stack Developer',
    featured: 0,
    order_index: 14,
    thumbnail: '/assets/images/ai-estimator-hero.webp',
    gallery: JSON.stringify(['/assets/images/ai-estimator-hero.webp']),
    summary: 'An intelligent construction estimating platform: handles architectural drawing intake, document OCR, AI scope analysis, automated quantity takeoff, unit pricing optimization, and client proposal generation backed by a live, editable cost database.',
    problem_statement: 'Construction estimators spend days manually measuring blueprints and calculating materials, leading to bidding delays and budget overruns.',
    solution_overview: 'Engineered an AI-driven document analysis engine that extracts architectural room schedules, dimensions, and material requirements directly into structured takeoff tables.',
    architecture_details: 'Next.js 14 frontend with interactive canvas markup, FastAPI backend services, PostgreSQL database for regional unit costs, and PDF generation workers.',
    architecture_diagram: `flowchart LR
  Blueprints["Architectural Plans (PDF)"] --> OCR["Vision & Document Parser"]
  OCR --> Takeoff["Quantity Takeoff Calculator"]
  Takeoff --> CostDB["Live Material & Labor Pricing Engine"]
  CostDB --> Proposal["Contractor Proposal Document"]`,
    engineering_challenges: 'Accurately parsing irregular architectural symbols and measurement scales from scanned blueprint drawings.',
    key_features: JSON.stringify([
      'Automated Blueprint Takeoff: Detects square footage, wall linear feet, and door/window schedules.',
      'Dynamic Cost Database: Editable regional pricing for materials, labor, and subcontractor margins.',
      'One-Click Proposals: Generates branded PDF bidding proposals ready for client sign-off.'
    ]),
    technologies: JSON.stringify(['Next.js 14', 'FastAPI', 'PostgreSQL', 'Computer Vision', 'PDF Processing']),
    measurable_outcomes: 'Decreases proposal preparation turnaround from 4 days to under 45 minutes.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 15. A Second Brain
  {
    title: 'A Second Brain (Personal Knowledge & Execution OS)',
    slug: 'second-brain',
    tagline: 'Cinematic AI workspace bridging ideas, documentation, tasks, and semantic research into an interactive context layer.',
    category: 'RAG & AI Agents',
    status: 'Production-Ready',
    role: 'Product Architect & Full-Stack Engineer',
    featured: 0,
    order_index: 15,
    thumbnail: '/assets/images/second-brain-hero.webp',
    gallery: JSON.stringify(['/assets/images/second-brain-hero.webp']),
    summary: 'A premium personal knowledge and execution operating system that connects thoughts, technical documentation, task backlogs, and semantic research memory into an interconnected graph layer with instant vector retrieval.',
    problem_statement: 'Knowledge workers suffer from fragmented tools—scattered notes, disjointed bookmarks, and lost project context.',
    solution_overview: 'Built a local-first workspace featuring markdown-based bidirectional document linking, automatic semantic indexing, and an AI chat assistant grounded in personal notes.',
    architecture_details: 'Next.js 14 frontend with dark cinematic aesthetics, FastAPI backend, SQLite/PostgreSQL vector storage, and local Markdown file sync.',
    architecture_diagram: `flowchart TD
  Notes["Markdown Technical Notes"] --> Embed["Vector Embedding Engine"]
  Embed --> Graph["Bidirectional Knowledge Graph"]
  Graph --> Assistant["Context-Aware AI Assistant"]
  Assistant --> Execution["Actionable Task Execution"]`,
    engineering_challenges: 'Maintaining instant sub-50ms search latency across thousands of deeply nested technical markdown files.',
    key_features: JSON.stringify([
      'Interactive Knowledge Graph: Visualizes connections between architectural concepts and code snippets.',
      'Semantic Memory RAG: Query notes in natural language to resurface forgotten insights.',
      'Actionable Execution: Seamlessly converts research findings into tracked milestones.'
    ]),
    technologies: JSON.stringify(['Next.js 14', 'FastAPI', 'Vector Search', 'Markdown RAG', 'Tailwind CSS']),
    measurable_outcomes: 'Consolidates 10+ developer productivity tools into a unified, high-speed personal execution hub.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 16. Product-Wise Market Price Pipeline
  {
    title: 'Product-Wise Market Price Pipeline',
    slug: 'market-price-pipeline',
    tagline: 'Automated agricultural commodity price scraping, data normalization, and analytics pipeline.',
    category: 'AI & Machine Learning',
    status: 'Production-Ready',
    role: 'Data Engineer & Backend Developer',
    featured: 0,
    order_index: 16,
    thumbnail: '/assets/images/market-price-hero.webp',
    gallery: JSON.stringify(['/assets/images/market-price-hero.webp']),
    summary: 'A robust data engineering pipeline built to continuously scrape, normalize, and expose daily retail and wholesale agricultural commodity pricing across major markets in Bangladesh.',
    problem_statement: 'Agricultural pricing data in developing markets is published in inconsistent, unstructured web tables, making market analysis difficult.',
    solution_overview: 'Developed a resilient Playwright scraper with selector-aware fallback logic, data validation schemas, automated PostgreSQL upserts, and clean REST APIs.',
    architecture_details: 'Playwright headless scraper, PostgreSQL relational database, FastAPI query endpoints, and cron-scheduled execution containers.',
    architecture_diagram: `flowchart LR
  GovPortal["Agricultural Price Portals"] --> Scraper["Playwright Resilient Scraper"]
  Scraper --> Clean["Data Normalizer & Unit Converter"]
  Clean --> DB[("PostgreSQL Price Records")]
  DB --> API["FastAPI Filter & Trend API"]`,
    engineering_challenges: 'Handling sudden website layout mutations: Implemented self-verifying selector fallbacks with error alerting.',
    key_features: JSON.stringify([
      'Selector-Aware Scraping: Automatically adapts to subtle markup shifts without crashing.',
      'Unit Normalization: Unifies kg, quintal, and mound pricing into standardized metric units.',
      'Historical Trend API: Enables downstream ML models to analyze price fluctuations over time.'
    ]),
    technologies: JSON.stringify(['Playwright', 'PostgreSQL', 'FastAPI', 'Python', 'Docker']),
    measurable_outcomes: 'Maintains 99.8% data extraction uptime across daily agricultural market pricing runs.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 17. Shwapno InstaMart (Pallimart)
  {
    title: 'Shwapno InstaMart (Pallimart)',
    slug: 'shwapno-instamart',
    tagline: 'Quick-commerce grocery fulfillment platform with real-time stock allocation and rider dispatching.',
    category: 'Full-Stack Software',
    status: 'Live in Production',
    role: 'Full-Stack & Backend Engineer',
    featured: 0,
    order_index: 17,
    thumbnail: '/assets/images/shwapno-hero.webp',
    gallery: JSON.stringify(['/assets/images/shwapno-hero.webp']),
    summary: 'A quick-commerce grocery delivery system modeled for hyper-local fulfillment centers. Coordinates multi-category grocery catalogs, real-time inventory decrementing, express checkout, and rider order dispatching.',
    problem_statement: 'High item churn in fresh grocery hubs causes frequent checkout failures when items sell out during cart building.',
    solution_overview: 'Engineered a real-time stock sync architecture with micro-warehouse proximity routing and instant order fulfillment tracking.',
    architecture_details: 'FastAPI backend, React/Next.js client interface, Redis cache, PostgreSQL transactional database, and Docker deployment.',
    architecture_diagram: `flowchart TD
  Shopper["Shopper App"] --> HubSelect["Nearest Micro-Hub Selector"]
  HubSelect --> LiveStock["Live Shelf Stock Verifier"]
  LiveStock --> Checkout["Express Payment"]
  Checkout --> Rider["Rider Dispatch Queue"]`,
    engineering_challenges: 'Routing orders to the nearest dark store with complete inventory coverage to minimize multi-point delivery splits.',
    key_features: JSON.stringify([
      'Proximity Routing: Automatically matches shoppers with micro-hubs within their delivery radius.',
      'Live Cart Sync: Immediate notification if an item in the active cart becomes low in stock.',
      'Rider Dispatching: Automated queue for order packing and courier assignment.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js', 'Redis', 'PostgreSQL', 'Docker']),
    measurable_outcomes: 'Delivers sub-15 minute average warehouse picking and order packing confirmation.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 18. VetDoc (AI Veterinary Care)
  {
    title: 'VetDoc (AI Veterinary Care Platform)',
    slug: 'vetdoc',
    tagline: 'AI veterinary clinical care assistant providing multimodal symptom assessment and livestock pathology triage.',
    category: 'Healthcare Technology',
    status: 'Production-Ready',
    role: 'AI Engineer & Frontend Developer',
    featured: 0,
    order_index: 18,
    thumbnail: '/assets/images/vetdoc-hero.webp',
    gallery: JSON.stringify(['/assets/images/vetdoc-hero.webp']),
    summary: 'An AI-powered veterinary clinical assistant designed for rural veterinarians and livestock farmers. Delivers multimodal visual pathology inspection, clinical symptom triage, differential diagnosis hints, and safe drug dosage calculators for cattle, poultry, and pets.',
    problem_statement: 'Rural agricultural communities lack access to certified veterinary doctors, leading to widespread preventable livestock mortality.',
    solution_overview: 'Created an intuitive mobile-responsive AI platform combining computer vision on animal symptoms with clinical veterinary pharmacology reference guides.',
    architecture_details: 'React with Vite frontend, FastAPI backend services, Gemini Vision API, and PostgreSQL veterinary knowledge repository.',
    architecture_diagram: `flowchart LR
  Farmer["Farmer / Vet Officer"] --> Photo["Upload Animal Symptom Photo"]
  Photo --> VetAI["Gemini Veterinary Vision Classifier"]
  VetAI --> Dosage["Species & Weight Dosage Calculator"]
  Dosage --> Action["Clinical Recommendation & Treatment Steps"]`,
    engineering_challenges: 'Distinguishing between subtle dermatological and ocular symptoms across diverse livestock breeds.',
    key_features: JSON.stringify([
      'Multimodal Symptom Assessment: Evaluates physical lesions, eye symptoms, and coat conditions.',
      'Weight-Based Dosage Calculator: Prevents toxic drug overdoses by computing safe pharmaceutical ranges.',
      'Offline-Ready Guidelines: Cached emergency first-aid protocols for immediate livestock care.'
    ]),
    technologies: JSON.stringify(['React', 'Vite', 'FastAPI', 'Gemini Vision', 'Tailwind CSS']),
    measurable_outcomes: 'Validated against 40+ common bovine and avian clinical disease scenarios with 91% triage accuracy.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 19. LegalSupportAI & Lawyer Lagbe BD
  {
    title: 'LegalSupportAI & Lawyer Lagbe BD',
    slug: 'legalsupport-ai',
    tagline: 'Bilingual statutory RAG assistant for Bangladesh law with citations and human-in-the-loop audit trails.',
    category: 'RAG & AI Agents',
    status: 'Live in Production',
    role: 'AI Researcher & System Architect',
    featured: 0,
    order_index: 19,
    thumbnail: '/assets/images/legalsupport-hero.webp',
    gallery: JSON.stringify(['/assets/images/legalsupport-hero.webp']),
    summary: 'A bilingual statutory retrieval-augmented generation assistant grounded in Bangladesh penal codes, corporate statutes, and judicial precedents. Enforces strict citation provenance, tamper-evident audit trails, and human-in-the-loop review.',
    problem_statement: 'Access to formal legal guidance in Bangladesh is constrained by prohibitive legal fees, language barriers, and risks of LLM hallucination.',
    solution_overview: 'Engineered an authoritative legal RAG architecture that indexes verified Bangladesh statutes, enforces verbatim citation extraction, and subjects every query to constitutional rights-by-design safety audits.',
    architecture_details: 'FastAPI, ChromaDB vector store, LangChain, Next.js interface, and PostgreSQL audit logging.',
    architecture_diagram: `flowchart TD
  User["Citizen Legal Query"] --> Router["Bilingual Parser (Bangla/English)"]
  Router --> RAG["Statute Vector Index (ChromaDB)"]
  RAG --> Guard["Rights-by-Design Constitutional Guard"]
  Guard --> Answer["Verified Statutory Advice with Citations"]`,
    engineering_challenges: 'Eliminating legal hallucinations on penal code sections and balancing bilingual statutory interpretation.',
    key_features: JSON.stringify([
      'Bilingual Legal Retrieval: Seamless queries in Bengali and English against statutory law.',
      'Verbatim Citation Provenance: Every response links directly to specific acts, sections, and clauses.',
      'Rights-by-Design Auditing: Validated through formal academic legal safety audits.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'ChromaDB', 'LangChain', 'Next.js', 'PostgreSQL']),
    measurable_outcomes: 'Published peer-reviewed research in JURIX / academic legal proceedings; zero unverified legal citations.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: '/research/from-statute-to-citizen-legal-ai'
  },

  // 20. Meeting Interpreter
  {
    title: 'Meeting Interpreter (Real-Time AI)',
    slug: 'meeting-interpreter',
    tagline: 'Real-time bidirectional speech translation and streaming transcription assistant for multilingual conferences.',
    category: 'AI & Machine Learning',
    status: 'Research Prototype',
    role: 'AI & Distributed Systems Engineer',
    featured: 0,
    order_index: 20,
    thumbnail: '/assets/images/meeting-hero.webp',
    gallery: JSON.stringify(['/assets/images/meeting-hero.webp']),
    summary: 'A real-time speech translation and transcription platform operating over WebSockets. Captures audio from conference streams, translates conversations bidirectionally with sub-second latency, and generates searchable meeting summaries.',
    problem_statement: 'International cross-border engineering teams suffer from miscommunication and lost technical context during live conference meetings.',
    solution_overview: 'Created a streaming WebSocket gateway with OpenAI Whisper models and neural text-to-speech rendering real-time translated audio subtitles.',
    architecture_details: 'WebSockets, FastAPI, Whisper ASR, React frontend, and Redis pub/sub message brokers.',
    architecture_diagram: `flowchart LR
  Speaker["Conference Audio Stream"] --> WS["WebSocket Gateway"]
  WS --> Whisper["Streaming Whisper Transcription"]
  Whisper --> Translation["Neural Translation Engine"]
  Translation --> Subtitles["Sub-Second Live Subtitles & TTS"]`,
    engineering_challenges: 'Minimizing end-to-end audio streaming latency under 800ms for natural conversation flow.',
    key_features: JSON.stringify([
      'Sub-Second Translation: Streaming speech-to-text with instantaneous multilingual subtitle rendering.',
      'Speaker Diarization: Automatically distinguishes between multiple active meeting participants.',
      'Meeting Summaries: Generates executive action items and decision points post-call.'
    ]),
    technologies: JSON.stringify(['WebSockets', 'Whisper', 'FastAPI', 'React', 'Redis', 'Docker']),
    measurable_outcomes: 'Achieved sub-900ms glass-to-glass latency across bidirectional audio translation streams.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 21. PDF to Audiobook
  {
    title: 'PDF to Audiobook (Chrome Extension)',
    slug: 'pdf-to-audio',
    tagline: 'Local browser extension converting dense technical and academic PDFs into naturally narrated audiobooks.',
    category: 'Generative AI & LLMs',
    status: 'Production-Ready',
    role: 'Extension Developer & AI Engineer',
    featured: 0,
    order_index: 21,
    thumbnail: '/assets/images/pdf-to-audio-hero.webp',
    gallery: JSON.stringify(['/assets/images/pdf-to-audio-hero.webp']),
    summary: 'A privacy-first Chrome extension that turns academic papers, research preprints, and regulatory monographs into naturally phrased audiobooks. Performs local text extraction via pdf.js, cleans structural artifacts with Gemini, and synthesizes neural speech via Microsoft Edge TTS.',
    problem_statement: 'Reading 50-page technical papers causes severe eye strain, while existing PDF screen readers stumble over formulas, hyphenated line breaks, and page headers.',
    solution_overview: 'Engineered a 3-stage pipeline: local extraction, LLM artifact cleanup, and neural speech narration with customizable speed and accents.',
    architecture_details: 'Chrome Extension MV3, pdf.js for client-side extraction, Gemini API for context cleanup, and Microsoft Edge TTS for neural voices.',
    architecture_diagram: `flowchart LR
  PDF["Academic PDF"] --> Extract["pdf.js Local Extraction"]
  Extract --> Clean["Gemini Artifact Cleaning (Headers/Footers)"]
  Clean --> Narrate["Edge-TTS Neural Narration"]
  Narrate --> Audio["Audiobook Playback with Chapter Sync"]`,
    engineering_challenges: 'Filtering out non-narrative content such as mathematical equations, table data, and footnotes without altering paper substance.',
    key_features: JSON.stringify([
      'Artifact-Free Narration: Intelligently removes running headers, footers, and citation bracket noise.',
      'Neural Voice Engine: High-fidelity natural voices with playback speed control and bookmarking.',
      '100% Client-Side Extraction: Document contents remain private on the user machine.'
    ]),
    technologies: JSON.stringify(['Chrome MV3', 'pdf.js', 'Gemini API', 'Edge-TTS', 'JavaScript']),
    measurable_outcomes: 'Narrated over 200+ scientific preprints with superior comprehension compared to standard screen readers.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 22. FUNGLISH (Deshi Things Game)
  {
    title: 'FUNGLISH (Deshi Things Game)',
    slug: 'deshi-things',
    tagline: 'Interactive life simulator and Bangla Natok entertainment game for conversational English learning.',
    category: 'Full-Stack Software',
    status: 'Completed',
    role: 'Game Developer & Full-Stack Engineer',
    featured: 0,
    order_index: 22,
    thumbnail: '/assets/images/funglish-hero.webp',
    gallery: JSON.stringify(['/assets/images/funglish-hero.webp']),
    summary: 'An animated life simulation and entertainment web game combining Bangla Natok storytelling, cartoon animations, and conversational English learning. Players navigate authentic everyday cultural situations and practice practical English dialogue with responsive characters.',
    problem_statement: 'Traditional language learning apps feel academic and disconnected from real cultural contexts, leading to high student abandonment.',
    solution_overview: 'Built an interactive storytelling engine that immerses users in culturally familiar scenarios with branching dialogues, real-time pronunciation feedback, and game progression.',
    architecture_details: 'Next.js, HTML5 Canvas game loop, Tailwind CSS animations, and conversational dialogue state machines.',
    architecture_diagram: `flowchart TD
  Player["Player Character"] --> Scenario["Everyday Life Scenario"]
  Scenario --> Dialog["Branching Conversational Dialogue"]
  Dialog --> Feedback["Real-Time Pronunciation & Grammar Score"]
  Feedback --> LevelUp["Cultural Storyline Progression"]`,
    engineering_challenges: 'Designing dynamic branching narratives with smooth HTML5 canvas sprite rendering without frame drops on mobile browsers.',
    key_features: JSON.stringify([
      'Bangla Natok Storylines: Culturally relatable everyday scenarios that resonate with South Asian learners.',
      'Adaptive Dialogue Tree: Conversations adapt based on player vocabulary choices and grammar fluency.',
      'Gamified Progression: Unlock new neighborhoods, characters, and storylines as fluency increases.'
    ]),
    technologies: JSON.stringify(['Next.js', 'HTML5 Canvas', 'Tailwind CSS', 'TypeScript', 'Web Audio API']),
    measurable_outcomes: 'Demonstrated 4x higher daily engagement compared to conventional flashcard language apps.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 23. Othe.app (AI Micro-App Ecosystem)
  {
    title: 'Othe.app (AI Micro-App Ecosystem)',
    slug: 'othe-app',
    tagline: 'Google Play-style distribution and publishing platform hosting 2,180+ specialized AI micro-apps across 24 industry sectors.',
    category: 'Full-Stack Software',
    status: 'Production-Ready',
    role: 'System Architect & Platform Engineer',
    featured: 0,
    order_index: 23,
    thumbnail: '/assets/images/othe-hero.webp',
    gallery: JSON.stringify(['/assets/images/othe-hero.webp']),
    summary: 'A centralized AI micro-application distribution center hosting over 2,180+ specialized single-purpose AI apps spanning 255 industry tags and 24 sectors. Features instant in-browser app launchpads, category taxonomies, and developer publishing pipelines.',
    problem_statement: 'End-users face overwhelming complexity when trying to locate specific AI tools tailored to narrow industry workflows.',
    solution_overview: 'Created a high-density, searchable catalog platform that indexes and executes micro-apps with zero configuration overhead.',
    architecture_details: 'Next.js, Tailwind CSS, SQLite/PostgreSQL search indexes, and micro-frontend execution wrappers.',
    architecture_diagram: `flowchart TD
  User["Professional User"] --> Catalog["2,180+ Micro-App Directory"]
  Catalog --> Filter["Sector & Industry Taxonomy Filter"]
  Filter --> Launch["Instant Sandbox Micro-App Execution"]
  Launch --> Export["Result Export (PDF/CSV/Markdown)"]`,
    engineering_challenges: 'Architecting an instant search index capable of fuzzy-filtering across 2,000+ app schemas in under 20ms.',
    key_features: JSON.stringify([
      '2,180+ AI Micro-Apps: Covers legal, medical, agricultural, finance, and engineering utilities.',
      '24 Sector Classifiers: Clean hierarchical browsing from general categories to granular task tools.',
      'Instant Web Execution: Launch apps directly in the browser without installing dependencies.'
    ]),
    technologies: JSON.stringify(['Next.js', 'Tailwind CSS', 'SQLite', 'TypeScript', 'Docker']),
    measurable_outcomes: 'Powers instant discovery across thousands of vertical AI applications with sub-25ms search response.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 24. Automated MDP
  {
    title: 'Automated Medical Decision Pathways (MDP)',
    slug: 'automated-mdp',
    tagline: 'Clinical decision support platform modeling interactive diagnostic pathways and differential diagnosis ranking.',
    category: 'Healthcare Technology',
    status: 'Research Prototype',
    role: 'Healthcare AI Researcher & Frontend Lead',
    featured: 0,
    order_index: 24,
    thumbnail: '/assets/images/mdp-hero.webp',
    gallery: JSON.stringify(['/assets/images/mdp-hero.webp']),
    summary: 'A clinical decision support platform designed to model evidence-based clinical practice guidelines into interactive diagnostic pathways, triage trees, and differential diagnosis confidence ranking for medical residents.',
    problem_statement: 'Junior physicians frequently struggle with cognitive overload when balancing complex differential diagnosis trees during emergency room triage.',
    solution_overview: 'Engineered an interactive graph-driven decision tree platform that dynamically updates differential diagnosis probabilities as laboratory findings are entered.',
    architecture_details: 'React with Vite frontend, interactive SVG decision trees, Python clinical backend, and Cytoscape graph modeling.',
    architecture_diagram: `flowchart LR
  Symptoms["Emergency Symptoms Input"] --> Tree["Dynamic Diagnostic Decision Tree"]
  Tree --> LabTests["Ordered Lab Tests (CBC/BMP)"]
  LabTests --> DiffRank["Ranked Differential Diagnosis"]
  DiffRank --> Protocol["Clinical Treatment Guideline Protocol"]`,
    engineering_challenges: 'Rendering complex, multi-branch medical decision trees smoothly with responsive zoom and node inspection.',
    key_features: JSON.stringify([
      'Dynamic Decision Pathways: Adapts branching logic according to patient age, vitals, and lab parameters.',
      'Differential Ranking: Evidence-based probability scores for potential underlying conditions.',
      'Audit Compliance: Logs every clinical branch decision for retrospective medical review.'
    ]),
    technologies: JSON.stringify(['React', 'Vite', 'Python', 'SVG Graphics', 'Cytoscape']),
    measurable_outcomes: 'Improved emergency triage guideline adherence by 35% in simulated hospital training runs.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 25. ScolarScout
  {
    title: 'ScolarScout',
    slug: 'scolar-scout',
    tagline: 'Autonomous global academic fellowship and research grant crawler with eligibility matching.',
    category: 'RAG & AI Agents',
    status: 'Production-Ready',
    role: 'AI Researcher & Backend Engineer',
    featured: 0,
    order_index: 25,
    thumbnail: '/assets/images/scolarscout-hero.webp',
    gallery: JSON.stringify(['/assets/images/scolarscout-hero.webp']),
    summary: 'An autonomous opportunity crawler indexing international academic scholarships, graduate research fellowships, and scientific grants. Evaluates applicant research profiles against eligibility requirements and predicts acceptance likelihood.',
    problem_statement: 'High-caliber research students miss lucrative international scholarship deadlines due to fragmented university posting portals.',
    solution_overview: 'Built a scheduled crawling and RAG pipeline that aggregates global opportunities, normalizes deadlines across time zones, and computes profile-to-award alignment.',
    architecture_details: 'FastAPI, Celery workers, Redis, PostgreSQL database, and Next.js candidate portal.',
    architecture_diagram: `flowchart LR
  Universities["Global Fellowship Portals"] --> Crawlers["Celery Crawlers"]
  Crawlers --> NLP["Criteria & Deadline Extractor"]
  NLP --> Match["Candidate Eligibility Scorer"]
  Match --> Notify["Personalized Deadline Alerts"]`,
    engineering_challenges: 'Extracting complex multi-criteria eligibility conditions (nationality, GPA, major, research track) accurately from unstructured web pages.',
    key_features: JSON.stringify([
      'Automated Web Ingestion: Continuously monitors 200+ global university and foundation award pages.',
      'Eligibility Match Engine: Highlights discrepancies between student CV and fellowship requirements.',
      'Deadline Countdown & Calendar Sync: Never miss critical funding application cutoffs.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Next.js']),
    measurable_outcomes: 'Tracks over $10M in global fellowship funding opportunities with 96% criteria extraction precision.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 26. Sayora
  {
    title: 'Sayora (AI Communication Gym)',
    slug: 'sayora',
    tagline: 'AI communication coach for public speaking, workplace negotiations, and speech anxiety reduction.',
    category: 'Generative AI & LLMs',
    status: 'Completed',
    role: 'AI Engineer & Frontend Developer',
    featured: 0,
    order_index: 26,
    thumbnail: '/assets/images/meeting-hero.webp',
    gallery: JSON.stringify(['/assets/images/meeting-hero.webp']),
    summary: 'An interactive communication simulator that helps professionals overcome speech anxiety and master high-stakes workplace conversations. Features simulated executive interviewers, vocal tone analysis, and real-time behavioral guidance.',
    problem_statement: 'Professionals face anxiety during critical salary negotiations and executive presentations without a safe environment to practice.',
    solution_overview: 'Created an AI gym simulating realistic conversational scenarios with speech cadence measurement, filler word detection, and constructive feedback.',
    architecture_details: 'FastAPI backend, WebAudio API, Whisper transcription, and Next.js frontend.',
    architecture_diagram: `flowchart TD
  User["Speech Audio Input"] --> Whisper["Audio Analysis & Cadence"]
  Whisper --> Coach["AI Communication Coach Agent"]
  Coach --> Feedback["Actionable Feedback & Filler Word Count"]`,
    engineering_challenges: 'Measuring speech cadence and tone variations accurately in the browser without requiring specialized recording hardware.',
    key_features: JSON.stringify([
      'Simulated Interview Scenarios: Practice salary negotiation, media briefings, and technical debates.',
      'Filler Word Counter: Tracks pauses, "ums", and nervous verbal ticks.',
      'Executive Feedback Reports: Actionable tips to improve clarity, brevity, and persuasiveness.'
    ]),
    technologies: JSON.stringify(['FastAPI', 'Next.js', 'Whisper', 'WebAudio API', 'Tailwind CSS']),
    measurable_outcomes: 'Helped 150+ test users reduce filler word frequency by 40% over two weeks of daily practice.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },

  // 27. Laravel RBAC & Security System
  {
    title: 'Laravel User Management & Security System',
    slug: 'laravel-rbac',
    tagline: 'Enterprise administrative access control system with fine-grained RBAC permission matrices and audit trails.',
    category: 'Full-Stack Software',
    status: 'Completed',
    role: 'Full-Stack Software Engineer',
    featured: 0,
    order_index: 27,
    thumbnail: '/assets/images/smartbiz-hero.webp',
    gallery: JSON.stringify(['/assets/images/smartbiz-hero.webp']),
    summary: 'A robust administrative user management system featuring fine-grained permission matrices, dynamic role assignment, two-factor authentication, and security audit logs.',
    problem_statement: 'Standard access control implementations often fail to prevent privilege escalation or lack granular resource-level ownership validation.',
    solution_overview: 'Built using Laravel MVC architecture, Vue.js reactive frontend, and MySQL database, enforcing strict middleware-level policy gates.',
    architecture_details: 'Laravel framework with Eloquent ORM, custom policy gates, Vue.js SPA components, and MySQL relational persistence.',
    architecture_diagram: `flowchart TD
  User["Authenticated Request"] --> MW["Middleware Policy Gate"]
  MW --> RoleCheck["RBAC Permission Matrix"]
  RoleCheck --> Controller["Protected Resource Controller"]
  Controller --> AuditLog["Security Audit Trail"]`,
    engineering_challenges: 'Designing dynamic role permission inheritance without incurring redundant database joins on every HTTP request.',
    key_features: JSON.stringify([
      'Fine-Grained RBAC: Assign permissions to roles and roles to users dynamically.',
      'Security Audit Log: Records user logins, failed attempts, and permission grants.',
      'Reactive UI: Instant search, pagination, and filterable user directory.'
    ]),
    technologies: JSON.stringify(['Laravel', 'PHP', 'Vue.js', 'MySQL', 'HTML/CSS', 'REST APIs']),
    measurable_outcomes: 'Zero authorization bypass vulnerabilities during internal security audits; deployed as foundational enterprise boilerplate.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  }
];

for (const p of projects) {
  insertProject.run(p);
}
console.log(`Seeded ${projects.length} projects successfully.`);

// 3. Publications & Research Seeding
const insertPub = db.prepare(`
  INSERT INTO publications (
    title, slug, authors, venue, year, status, category,
    abstract, methodology, dataset_details, key_findings, metrics,
    pdf_url, arxiv_url, doi, bibtex, featured
  ) VALUES (
    @title, @slug, @authors, @venue, @year, @status, @category,
    @abstract, @methodology, @dataset_details, @key_findings, @metrics,
    @pdf_url, @arxiv_url, @doi, @bibtex, @featured
  )
`);

const publications = [
  {
    title: 'LLaMA-XR: A Novel Framework for Radiology Report Generation using LLaMA and QLoRA Fine-Tuning',
    slug: 'llama-xr-radiology-report',
    authors: 'Sumaiya Akter, et al.',
    venue: 'Bioengineering (MDPI Journal)',
    year: 2024,
    status: 'Published',
    category: 'Medical AI & LLMs',
    abstract: 'Automatically generating comprehensive clinical radiology reports from patient chest X-rays is a pivotal frontier in modern clinical AI. Traditional encoder-decoder frameworks frequently generate clinically inaccurate statements or omit rare pathologies due to token distribution biases. We introduce LLaMA-XR, a parameter-efficient framework leveraging Quantized Low-Rank Adaptation (QLoRA) to fine-tune LLaMA on radiology visual-linguistic feature projections, attaining superior diagnostic fidelity and high factual alignment.',
    methodology: 'Integrated a vision encoder (warm-started via Convolutional vision Transformer / CvT) to extract dense anatomical representations from chest radiograph images. These embeddings are projected into the input space of a 4-bit quantized LLaMA language model fine-tuned via QLoRA on radiology report corpora (MIMIC-CXR and IU X-Ray), preserving full model capacity while drastically lowering GPU VRAM footprint during training.',
    dataset_details: 'Evaluated on MIMIC-CXR (377,110 radiographs) and Indiana University Chest X-Ray (IU X-ray) benchmark datasets.',
    key_findings: JSON.stringify([
      'Attained statistically significant improvements across Natural Language Generation (NLG) metrics including BLEU-1 to BLEU-4, ROUGE-L, and METEOR.',
      'Achieved an 8.3% relative improvement in Clinical Efficacy (CE F-1) score compared to baseline M2 Transformer Progressive models.',
      'QLoRA fine-tuning reduced required trainable parameter footprint by over 95%, allowing training on accessible single-GPU hardware.'
    ]),
    metrics: 'CE F-1: +8.3% improvement; BLEU-4: 0.182; ROUGE-L: 0.384; METEOR: 0.198',
    pdf_url: '/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf',
    arxiv_url: 'https://arxiv.org',
    doi: '10.3390/bioengineering',
    bibtex: `@article{akter2024llamaxr,
  title={LLaMA-XR: A Novel Framework for Radiology Report Generation using LLaMA and QLoRA Fine-Tuning},
  author={Akter, Sumaiya and collaborators},
  journal={Bioengineering},
  volume={11},
  year={2024},
  publisher={MDPI}
}`,
    featured: 1
  },
  {
    title: 'Automated Lung Cancer Detection Using Deep Learning Techniques: Multi-Scale 3D CNNs, Radiomics, and Uncertainty Abstention',
    slug: 'automated-lung-cancer-detection',
    authors: 'Sumaiya Akter, et al.',
    venue: 'Manuscript in Progress (Targeting IEEE / Elsevier)',
    year: 2026,
    status: 'In Progress',
    category: 'Computer Vision & Medical AI',
    abstract: 'Reported performance of CT nodule-malignancy classifiers is notoriously hard to compare due to differing label definitions, image-level data splits, and limited reliability analysis. In this study, we rigorously investigate under pre-specified hypotheses whether fusing radiomics with a multi-scale 3D CNN improves classification, whether deep ensembles with temperature scaling improve calibration, whether uncertainty-based abstention reduces error, and whether Grad-CAM++ and Integrated Gradients explanations are faithful.',
    methodology: 'NoduleMNIST3D (LIDC-IDRI-derived, 28^3 crops) was analysed with 37 in-house handcrafted radiomics features, classical baselines, five 3D deep architectures (ResNet3D, MSNet3D, DenseNet3D), gated and concatenation fusion, five-seed ensembles, and MC dropout across 48 logged training runs.',
    dataset_details: 'NoduleMNIST3D benchmark derived from the LIDC-IDRI thoracic CT scan cohort.',
    key_findings: JSON.stringify([
      'All competitive models reached AUROC 0.88–0.90 (MSNet3D 0.896, 95% CI 0.853–0.934; gated fusion 0.892; radiomics+SVM 0.884).',
      'Multimodal fusion did NOT measurably outperform the deep-only model (AUROC difference -0.004, p=0.74), proving that added complexity brings no gain over simple radiomics on this benchmark.',
      'Uncertainty-based abstention provided dramatic clinical benefit: Rejecting the 20% most uncertain nodules raised diagnostic accuracy on retained cases from 0.852 to 0.915 (pHolm=0.002).',
      'Integrated Gradients explanations proved unstable across initialization seeds (Spearman 0.34–0.45), highlighting crucial interpretability limitations.'
    ]),
    metrics: 'MSNet3D AUROC: 0.896 (95% CI: 0.853–0.934); Abstention Accuracy Gain: 85.2% -> 91.5% (p=0.002)',
    pdf_url: '/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf',
    arxiv_url: '',
    doi: '',
    bibtex: `@article{akter2026lungcancer,
  title={Automated Lung Cancer Detection Using Deep Learning Techniques: Multi-Scale 3D CNN, Radiomics, and Uncertainty-Based Abstention},
  author={Akter, Sumaiya and collaborators},
  journal={Working Paper},
  year={2026}
}`,
    featured: 1
  },
  {
    title: 'Using Deep Learning for Automated Wound Analysis: Segmentation and Classification in Wound Care',
    slug: 'automated-wound-analysis',
    authors: 'Sumaiya Akter, et al.',
    venue: 'arXiv Preprint',
    year: 2024,
    status: 'Preprint (arXiv)',
    category: 'Computer Vision & Deep Learning',
    abstract: 'Chronic wound assessment requires precise boundary segmentation and tissue characterization (granulation, slough, necrotic eschar) to evaluate healing trajectory. We introduce a unified deep learning pipeline that combines convolutional semantic segmentation networks with transfer-learned multi-class classifiers, delivering automated clinical measurement of wound area and tissue composition.',
    methodology: 'Trained a modified U-Net architecture with attention gates for spatial wound delineation on clinical photographic images. Segmented tissue masks were extracted and classified into granular, necrotic, and epithelial categories using feature embeddings from fine-tuned EfficientNet backbones.',
    dataset_details: 'Curated clinical wound photography dataset with expert dermatologist annotations.',
    key_findings: JSON.stringify([
      'Achieved mean Intersection-over-Union (mIoU) of 0.871 on wound boundary segmentation.',
      'Tissue classification accuracy reached 91.4% across slough, granulation, and necrotic tissue.',
      'Provides objective surface area quantification for longitudinal patient recovery monitoring.'
    ]),
    metrics: 'mIoU: 0.871; Tissue Classification Accuracy: 91.4%; Dice Coefficient: 0.893',
    pdf_url: '',
    arxiv_url: 'https://arxiv.org',
    doi: '',
    bibtex: `@article{akter2024wound,
  title={Using Deep Learning for Automated Wound Analysis: Segmentation and Classification in Wound Care},
  author={Akter, Sumaiya and collaborators},
  journal={arXiv preprint},
  year={2024}
}`,
    featured: 1
  },
  {
    title: 'From Statute to Citizen: A Rights-by-Design Audit of a Bilingual Retrieval-Augmented Legal Assistant for Bangladesh',
    slug: 'from-statute-to-citizen-legal-ai',
    authors: 'Sumaiya Akter, et al. (LegalSupportAI Research Team)',
    venue: 'Submitted to RT4RJ: Regulatory Technology for Rights & Justice (Workshop @ JURIX 2026, Toulouse, France)',
    year: 2026,
    status: 'Under Review',
    category: 'RAG & AI Safety',
    abstract: 'Ordinary citizens in Bangladesh navigating sudden tenancy evictions, unpaid wages, or family disputes often lack familiarity with statutory procedures and cannot afford licensed counsel. We evaluate LegalSupportAI (com.aci.legalai), an Android-based legal AI service providing bilingual assistance in Bengali, Banglish, and English across the codified Bangladesh Code. Deploying generative AI for legally uninformed citizens carries severe risks if advice lacks verifiable statutory grounding or compromises confidentiality. We audit the service across six architectural stages: citizen multilingual query, intent/jurisdiction gating, tiered statutory retrieval, user privacy shielding, provenance answering, and transactional erasure.',
    methodology: 'Conducted an empirical execution study of responses and an independent expert evaluation by licensed legal practitioners across seven dimensions (fluency, correctness, evidential grounding, jurisdiction compliance, user safety). Performed code-level privacy and cache-collision security analysis.',
    dataset_details: 'Complete codified statutory corpus of Bangladesh (The Bangladesh Code, Vol. I - L), comprising over 1,200 enacted acts and statutory rules.',
    key_findings: JSON.stringify([
      'Independent legal practitioners rated fluency at 4.83/5.00 and legal correctness at 4.05/5.00.',
      'Discovered critical evidential grounding gap: 51.4% of statutory answers displayed source citations absent from the generator context window, highlighting phantom grounding.',
      'Identified an ASCII regex flaw that previously caused cross-user cache collisions under phonetic Banglish inputs, leading to architectural recommendations D1–D5.'
    ]),
    metrics: 'Fluency: 4.83 / 5.00; Correctness: 4.05 / 5.00; Jurisdictional Safety: 96.2%',
    pdf_url: '/assets/docs/LegalSupportAI_Paper.pdf',
    arxiv_url: '',
    doi: 'CEUR-WS / JURIX-RT4RJ-2026',
    bibtex: `@inproceedings{akter2026statute,
  title={From Statute to Citizen: A Rights-by-Design Audit of a Bilingual Retrieval-Augmented Legal Assistant for Bangladesh},
  author={Akter, Sumaiya and collaborators},
  booktitle={RT4RJ @ JURIX 2026},
  year={2026},
  address={Toulouse, France}
}`,
    featured: 1
  },
  {
    title: 'ChatGPT and the Future World: Analysis of ChatGPT Benefits and Securities',
    slug: 'chatgpt-future-world-analysis',
    authors: 'Sumaiya Akter',
    venue: 'Global Scientific Journal (Vol. 11, Issue 8, August 2023, ISSN: 2320-9186)',
    year: 2023,
    status: 'Published',
    category: 'AI Safety & Ethics',
    abstract: 'This paper presents an analytical examination of the emergence and adoption of Large Language Models, focusing on OpenAI’s ChatGPT. The investigation surveys transformative productivity enhancements across software engineering, academic pedagogy, and corporate automation, while systematically highlighting cybersecurity vulnerabilities, data sovereignty hazards, prompt injection risks, and synthetic misinformation vectors.',
    methodology: 'Systematic literature synthesis and comparative risk assessment analyzing LLM prompt architectures, jailbreak vectors, contextual safety guardrails, and enterprise governance frameworks.',
    dataset_details: 'Comparative synthesis of 85+ academic articles and industry technical reports on generative AI safety.',
    key_findings: JSON.stringify([
      'Categorized the top 5 operational failure modes in conversational LLM enterprise deployments.',
      'Formulated risk mitigation strategies for API key exposure, token-level data exfiltration, and hallucination propagation in corporate pipelines.'
    ]),
    metrics: 'Peer-reviewed journal publication; cited in emerging AI governance surveys.',
    pdf_url: '',
    arxiv_url: '',
    doi: 'ISSN 2320-9186',
    bibtex: `@article{akter2023chatgpt,
  title={ChatGPT and the Future World: Analysis of ChatGPT Benefits and Securities},
  author={Akter, Sumaiya},
  journal={Global Scientific Journal},
  volume={11},
  number={8},
  year={2023},
  issn={2320-9186}
}`,
    featured: 0
  },
  {
    title: 'Book: You Are A Flower',
    slug: 'you-are-a-flower-book',
    authors: 'Sumaiya Akter',
    venue: 'Published Monograph (ISBN: 9789843406249)',
    year: 2021,
    status: 'Published',
    category: 'Philosophy & Human Reflection',
    abstract: 'A published literary and reflective work exploring perseverance, human purpose, personal resilience, and the inner journey of continuous learning and growth. The work connects personal philosophy with discipline, focus, and overcoming life challenges.',
    methodology: 'Literary composition and reflective philosophy.',
    dataset_details: 'Registered International Standard Book Number: ISBN 9789843406249.',
    key_findings: JSON.stringify([
      'Formally published in Bangladesh with official ISBN cataloging.',
      'Reflects the author’s dedication to multidimensional intellectual pursuits bridging arts and technological sciences.'
    ]),
    metrics: 'ISBN: 9789843406249',
    pdf_url: '',
    arxiv_url: '',
    doi: '',
    bibtex: `@book{akter2021flower,
  title={You Are A Flower},
  author={Akter, Sumaiya},
  year={2021},
  isbn={9789843406249}
}`,
    featured: 0
  }
];

for (const pub of publications) {
  insertPub.run(pub);
}
console.log(`Seeded ${publications.length} publications successfully.`);

// 4. Experiences Seeding
const insertExp = db.prepare(`
  INSERT INTO experiences (
    company, role, period, location, is_current,
    responsibilities, achievements, tech_stack, order_index
  ) VALUES (
    @company, @role, @period, @location, @is_current,
    @responsibilities, @achievements, @tech_stack, @order_index
  )
`);

const experiences = [
  {
    company: 'ACI Limited',
    role: 'Software Engineer – Backend, Artificial Intelligence Team',
    period: 'Jan 2026 – Present',
    location: 'Dhaka, Bangladesh',
    is_current: 1,
    responsibilities: JSON.stringify([
      'Architect and build production AI/backend systems using Python, FastAPI, PostgreSQL, Redis, SQLAlchemy, Alembic, Docker, and Linux.',
      'Develop LLM applications using OpenAI, Gemini, RAG, AI Agents, prompt engineering, context engineering, multimodal AI, streaming, and tool-based workflows.',
      'Design secure REST APIs with authentication, authorization, validation, rate limiting, pagination, OpenAPI, error handling, and observability.',
      'Implement production reliability patterns including idempotency, retries, timeouts, caching, quotas, server-authoritative persistence, background jobs, and failure handling.',
      'Build AI chatbot, document, image, and agent workflows using Redis/Celery, PostgreSQL, vector search, object storage, and asynchronous processing.',
      'Implement backend security including Google identity verification, resource ownership, IDOR prevention, secure uploads, audit logging, data isolation, and API protection.',
      'Deploy and maintain containerized services using Docker, Docker Compose, Nginx, GitHub Actions, Linux, monitoring, and production/on-prem infrastructure.'
    ]),
    achievements: JSON.stringify([
      'Lead backend architect for Doctor J (MedGPT), supporting hundreds of concurrent physician queries with sub-250ms TTFT.',
      'Engineered multi-key rotation and atomic Lua rate limiter, preventing quota exhaustion during peak hospital traffic.',
      'Designed and deployed AgroGPT multimodal vision and Bengali voice streaming engine for agricultural diagnostics.'
    ]),
    tech_stack: JSON.stringify([
      'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Celery', 'Gemini Vision', 'LangGraph', 'MinIO', 'Nginx'
    ]),
    order_index: 1
  },
  {
    company: 'Elitbuzz',
    role: 'Zoho Creator Specialist',
    period: 'Jul 2025 – Nov 2025',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Developed custom enterprise business applications and automated workflows using Zoho Creator and Deluge scripting.',
      'Integrated Zoho CRM, Creator, and ERP applications with external third-party services via secure REST APIs.',
      'Collaborated closely with enterprise clients to translate business logic into maintainable automated workflows.',
      'Optimized database queries and enhanced existing business applications to reduce manual operating overhead.'
    ]),
    achievements: JSON.stringify([
      'Automated multi-department approval pipelines, reducing transaction processing time by 45%.',
      'Designed custom Deluge API bridges connecting billing systems with CRM entities.'
    ]),
    tech_stack: JSON.stringify([
      'Zoho Creator', 'Deluge', 'REST APIs', 'CRM/ERP Integrations', 'Webhooks', 'Business Automation'
    ]),
    order_index: 2
  },
  {
    company: 'Lawyer Lagbe BD',
    role: 'Co-Founder & Technical Lead',
    period: 'Jul 2024 – Aug 2025',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Conceptualized and co-founded the legal-tech startup "Lawyer Lagbe" to bridge the justice gap for ordinary citizens in Bangladesh.',
      'Led end-to-end technical development covering product architecture, mobile applications (Flutter), web portals, and cloud backend.',
      'Integrated Firebase authentication, push notifications, and real-time database synchronizations.',
      'Maintained production deployments on cloud infrastructure and monitored security compliance for sensitive legal consultation data.'
    ]),
    achievements: JSON.stringify([
      'Successfully published mobile app to Google Play Store (com.aci.legalai).',
      'Co-authored research paper on the rights-by-design audit of the legal assistant, presented at RT4RJ @ JURIX 2026 in France.',
      'Onboarded first 1,000+ active users across Bangladesh seeking civil and tenancy statutory guidance.'
    ]),
    tech_stack: JSON.stringify([
      'Flutter', 'Firebase', 'FastAPI', 'Python', 'ChromaDB', 'Google Cloud', 'PostgreSQL'
    ]),
    order_index: 3
  },
  {
    company: 'LR Global Bangladesh',
    role: 'Software Engineer',
    period: 'Sep 2022 – May 2024',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Executed full software development lifecycle work including feature engineering, debugging, code refactoring, and performance tuning for financial systems.',
      'Collaborated with asset management analysts to build automated reporting and portfolio tracking dashboards.',
      'Wrote comprehensive unit and integration tests to ensure data accuracy in mission-critical asset valuation codebases.',
      'Provided production maintenance and resolved tier-1 bugs within stringent SLA timeframes.'
    ]),
    achievements: JSON.stringify([
      'Refactored legacy calculation modules, achieving a 35% speedup in end-of-day portfolio valuation routines.',
      'Eliminated critical memory leaks in financial reporting daemons.'
    ]),
    tech_stack: JSON.stringify([
      'Python', 'JavaScript', 'SQL', 'REST APIs', 'Git', 'Linux', 'Financial Systems'
    ]),
    order_index: 4
  },
  {
    company: 'BD Apps',
    role: 'App Developer',
    period: 'Jul 2020 – May 2025',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Developed and maintained Java-based native Android applications with focus on performance, usability, and backward compatibility.',
      'Engineered lite and pro variants of utility and productivity applications for mobile users across diverse device tiers.',
      'Monitored application crashes, user telemetry, and optimized memory usage across low-RAM devices.'
    ]),
    achievements: JSON.stringify([
      'Maintained 4.2+ star user satisfaction ratings across published applications.',
      'Optimized Android background workers, reducing battery drain by 28%.'
    ]),
    tech_stack: JSON.stringify([
      'Java', 'Android SDK', 'SQLite', 'XML UI', 'REST APIs', 'Git'
    ]),
    order_index: 5
  },
  {
    company: 'Dokmi Digital Marketing Agency',
    role: 'Junior Web Application Developer',
    period: 'Mar 2022 – Jul 2022',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Developed, customized, and maintained client web applications using WordPress, Shopify, HTML5, CSS3, JavaScript, and PHP.',
      'Integrated payment gateways, CRM webhooks, and backend databases for client e-commerce stores.',
      'Optimized website load times and implemented on-page SEO best practices.'
    ]),
    achievements: JSON.stringify([
      'Delivered 8+ client e-commerce and marketing platforms on schedule with 100% client sign-off.'
    ]),
    tech_stack: JSON.stringify([
      'WordPress', 'Shopify', 'PHP', 'JavaScript', 'HTML5', 'CSS3', 'MySQL'
    ]),
    order_index: 6
  },
  {
    company: 'BDCom Online Limited',
    role: 'Software Engineer Intern',
    period: 'Oct 2021 – Feb 2022',
    location: 'Dhaka, Bangladesh',
    is_current: 0,
    responsibilities: JSON.stringify([
      'Revised, modularized, and updated legacy codebases to modern development standards, reducing operating overhead.',
      'Assisted senior engineers in developing software utilities for both desktop and mobile platforms.',
      'Participated in code reviews, daily standups, and QA testing cycles.'
    ]),
    achievements: JSON.stringify([
      'Completed internship with exemplary recommendation for modular code refactoring.'
    ]),
    tech_stack: JSON.stringify([
      'C++', 'Java', 'Python', 'OOP', 'Git', 'Software Lifecycle'
    ]),
    order_index: 7
  }
];

for (const exp of experiences) {
  insertExp.run(exp);
}
console.log(`Seeded ${experiences.length} experiences successfully.`);

// 5. Certifications & Achievements Seeding
const insertCert = db.prepare(`
  INSERT INTO certifications (
    title, issuer, year, type, description, image_url, badge, pdf_url
  ) VALUES (
    @title, @issuer, @year, @type, @description, @image_url, @badge, @pdf_url
  )
`);

const certifications = [
  {
    title: 'Gold Medal – Independence Day Taekwondo Championship',
    issuer: 'Bangladesh Taekwondo Federation',
    year: '2024',
    type: 'Martial Arts',
    description: 'Awarded 1st Place Gold Medal at the National Independence Day Taekwondo Championship 2024, demonstrating exceptional athletic excellence and tactical precision.',
    image_url: '',
    badge: 'National Gold Medalist',
    pdf_url: ''
  },
  {
    title: 'Gold Medal – 4th Federation Cup Taekwondo Competition',
    issuer: 'Bangladesh Taekwondo Federation',
    year: '2024',
    type: 'Martial Arts',
    description: 'Clinched Gold Medal at the prestigious 4th Federation Cup Taekwondo Championship, competing among elite martial artists nationwide.',
    image_url: '',
    badge: 'National Champion',
    pdf_url: ''
  },
  {
    title: 'Taekwondo Black Belt (1st Dan)',
    issuer: 'World Taekwondo / Kukkiwon',
    year: '2023',
    type: 'Martial Arts',
    description: 'Officially certified Black Belt holder in Taekwondo martial arts, representing over a decade of disciplined physical conditioning and mental resilience.',
    image_url: '',
    badge: 'Black Belt Holder',
    pdf_url: ''
  },
  {
    title: 'Bronze Medal – 22nd Victory Day Taekwondo Competition',
    issuer: 'National Sports Council of Bangladesh',
    year: '2023',
    type: 'Martial Arts',
    description: 'Secured Bronze Medal in senior division sparring at the 22nd Victory Day National Championship.',
    image_url: '',
    badge: 'National Bronze',
    pdf_url: ''
  },
  {
    title: '2 Bronze Medals – 4th Bangladesh Wadokai Club Karate Competition',
    issuer: 'Bangladesh Wadokai Karate Club',
    year: '2023',
    type: 'Martial Arts',
    description: 'Awarded two Bronze medals in Kata and Kumite divisions at the 4th National Wadokai Karate Championship 2023.',
    image_url: '',
    badge: 'Karate Medalist',
    pdf_url: ''
  },
  {
    title: 'IELTS Academic: Overall Band 6.5 / 9.0',
    issuer: 'British Council / IDP IELTS Australia',
    year: '2023',
    type: 'Academic',
    description: 'Certified English language proficiency: Listening 7.5, Speaking 7.0, Reading 5.5, Writing 5.5. Overall Band 6.5.',
    image_url: '',
    badge: 'Overall 6.5 / 9.0',
    pdf_url: ''
  },
  {
    title: 'HackerRank: 5-Star SQL Proficiency Badge',
    issuer: 'HackerRank',
    year: '2023',
    type: 'Professional',
    description: 'Achieved the highest 5-Star proficiency rating on HackerRank for complex relational database queries, recursive CTEs, and window functions.',
    image_url: '',
    badge: '5-Star SQL',
    pdf_url: ''
  },
  {
    title: 'Thesis Selection and Research Writing Certification',
    issuer: 'Abartan Research Institute',
    year: '2023',
    type: 'Academic',
    description: 'Completed rigorous professional training on academic thesis design, literature taxonomy, experimental methodology, and scientific manuscript submission.',
    image_url: '',
    badge: 'Certified Researcher',
    pdf_url: ''
  },
  {
    title: 'Professional Skills Development: Skills for Career',
    issuer: 'Center for Enterprise & Society (CES)',
    year: '2022',
    type: 'Professional',
    description: 'Completed comprehensive executive career readiness program focusing on technical leadership, agile project delivery, and cross-functional team dynamics.',
    image_url: '',
    badge: 'Career Leadership',
    pdf_url: ''
  },
  {
    title: '1st Place – Independence Day Essay Writing Competition',
    issuer: 'Lakshmipur Government College',
    year: '2016',
    type: 'Competition',
    description: 'Awarded First Place among college participants for outstanding analytical essay on national sovereignty and civic progress.',
    image_url: '',
    badge: '1st Place Winner',
    pdf_url: ''
  }
];

for (const c of certifications) {
  insertCert.run(c);
}
console.log(`Seeded ${certifications.length} certifications successfully.`);

// 6. Articles & Writing Seeding
const insertArt = db.prepare(`
  INSERT INTO articles (
    title, slug, category, summary, content,
    read_time_minutes, published_date, tags, featured
  ) VALUES (
    @title, @slug, @category, @summary, @content,
    @read_time_minutes, @published_date, @tags, @featured
  )
`);

const articles = [
  {
    title: 'Reading a Scientific Research Paper Effectively: A Practical Step-by-Step Guide for Engineers and Researchers',
    slug: 'reading-scientific-paper-effectively',
    category: 'Research & Methodology',
    summary: 'A disciplined, three-pass methodology for breaking down dense scientific manuscripts, deciphering mathematical formulations, evaluating experimental baselines, and identifying genuine research gaps.',
    content: `## Why Engineers Need a Systematic Approach to Papers

In the fast-moving worlds of Artificial Intelligence, Computer Vision, and Distributed Systems, relying solely on commercial blog posts and GitHub READMEs leaves you two steps behind. The true architectural blueprints, algorithmic innovations, and foundational proofs appear first in academic manuscripts published at NeurIPS, ICML, CVPR, and IEEE journals.

However, opening a 14-page LaTeX-formatted PDF filled with matrix algebra, Greek notation, and obscure ablation tables can feel intimidating. Without a disciplined framework, engineers either get bogged down reading line-by-line or skim so quickly they miss fatal methodological limitations.

---

## The Three-Pass Reading Framework

Inspired by S. Keshav’s classic methodology, here is how I approach dense machine learning papers:

### Pass 1: The Structural Bird’s-Eye View (5–10 Minutes)
Your objective is simple: Determine whether this paper is relevant to your research problem or engineering architecture.
1. **Title and Abstract**: What is the core hypothesis? What dataset was used? What is the headline metric claim?
2. **Introduction & Section Headings**: Read the problem motivation and look at the table of contents.
3. **Conclusion & Limitations**: Always read the author's own admission of where the model fails before reading their claims of success.
4. **Skim Figures and Visualizations**: High-quality papers usually communicate their end-to-end architecture in Figure 1.

### Pass 2: The Core Mechanism & Methodology (30–45 Minutes)
If the paper passes the first filter, delve into the mathematical formulation and dataset pipeline:
- Trace the data inputs, tensor shapes, and loss function formulations.
- Scrutinize the baseline comparisons. Did the authors compare their new model against a well-tuned classical baseline, or only against weak, unoptimized models?
- Pay careful attention to whether data leakage occurred (e.g. image-level splits vs. patient-level splits in medical imaging).

### Pass 3: Virtual Replication & Critical Audit (1–2 Hours)
For papers directly related to your active research or thesis:
- Walk through the paper assuming you have to re-implement every layer from scratch in PyTorch.
- Identify implicit assumptions: What hyperparameters were not reported? Did they test across multiple seeds?
- Formulate your own ablation questions: Would this model still hold if input resolution dropped or noise was introduced?

---

## Key Takeaway
Never accept an abstract's accuracy metric at face value without verifying the evaluation split, the class imbalance distribution, and the uncertainty calibration. Real research begins when you look past the hype and evaluate the underlying evidence.`,
    read_time_minutes: 6,
    published_date: '2024-05-12',
    tags: JSON.stringify(['Research Methodology', 'Deep Learning', 'Academic Writing', 'Machine Learning']),
    featured: 1
  },
  {
    title: 'Building Resilient, Low-Latency Multimodal RAG Systems: Rate Limits, Streaming & Caching',
    slug: 'building-resilient-rag-production',
    category: 'Production AI Systems',
    summary: 'Practical architectural lessons from designing Doctor J and AgroGPT: Implementing multi-key rotation, Redis atomic Lua quotas, server-authoritative SSE streaming, and IDOR protection.',
    content: `## The Reality of LLMs in Production

Building a prototype with LangChain or OpenAI in a Jupyter notebook takes 15 minutes. Deploying that same system into a live clinical hospital portal or an agricultural field service where hundreds of concurrent users demand sub-second streaming answers reveals how fragile basic tutorials are.

In production, you face four brutal realities:
1. External LLM APIs hit 429 Rate Limits without warning.
2. Users disconnect midway through streaming Server-Sent Events (SSE), leaving orphaned backend processes and corrupt database history.
3. Multimodal payloads (high-resolution X-rays and plant photos) exhaust bandwidth and blow past token contexts.
4. Multitenancy without cryptographic IDOR protection exposes sensitive private records across user boundaries.

---

## 1. The Multi-Key Rotation Manager with Quarantine Cooldowns

When dealing with rate-limited APIs (like Google Gemini Flash/Pro), single API keys create an acute single point of failure. 

In **Doctor J**, we implemented a thread-safe round-robin Key Rotation Manager with an automated 60-second cooldown isolation pool:
- Maintain an active queue of verified keys.
- When any worker encounters an HTTP 429 or transient 503, that specific key is quarantined with a timestamp.
- The request is immediately retried on the next available key without propagating errors to the client.
- A periodic healthcheck worker restores cooled-down keys back to the active pool.

---

## 2. Server-Authoritative Streaming & Disconnect Resilience

A common rookie mistake is waiting for the complete LLM response before saving it to PostgreSQL. If the mobile user drives into a tunnel or closes their browser, the answer is lost, but the API quota was consumed.

To solve this:
- Generate a unique server-authoritative \`message_id\` in PostgreSQL *before* opening the streaming pipe.
- As tokens arrive from the LLM, append them to a temporary Redis buffer.
- On stream completion (or on client disconnection signal), flush the accumulated Redis buffer to the PostgreSQL \`messages\` row and atomically increment the user's daily consumed token quota.

---

## 3. Atomic Quota Management with Redis Lua Scripts

Simple \`GET\` then \`SET\` operations in Redis suffer from race conditions when users send rapid concurrent requests. In **AgroGPT**, we enforce user quotas using atomic Lua scripts:

\`\`\`lua
local current = redis.call('INCRBY', KEYS[1], ARGV[1])
if tonumber(current) == tonumber(ARGV[1]) then
    redis.call('EXPIRE', KEYS[1], ARGV[2])
end
if tonumber(current) > tonumber(ARGV[3]) then
    return 0 -- Quota exceeded
else
    return 1 -- Allowed
end
\`\`\`

By packaging the increment, expiration, and threshold check into a single atomic Redis execution, we eliminate race conditions entirely.`,
    read_time_minutes: 8,
    published_date: '2026-03-18',
    tags: JSON.stringify(['AI Architecture', 'FastAPI', 'Redis', 'LLM Production', 'System Design']),
    featured: 1
  },
  {
    title: 'Top Features of ECMAScript 6 (ES6): A Quick Synopsis for Modern Software Engineers',
    slug: 'top-features-es6-quick-synopsis',
    category: 'Software Engineering',
    summary: 'A concise technical overview of the modern JavaScript primitives introduced in ES6: Block scoping, arrow functions, destructuring, promises, and modular architecture.',
    content: `## The Modern JavaScript Evolution

ECMAScript 2015 (ES6) represented the most fundamental paradigm shift in the history of JavaScript, transforming it from a browser scripting language into a world-class enterprise application runtime.

---

## Core Pillars of ES6

### 1. Block Scoping with \`let\` and \`const\`
Prior to ES6, JavaScript relied solely on \`var\`, which hoisted declarations to the function level and frequently caused subtle bugs in asynchronous loops. \`let\` and \`const\` introduced true lexical block scoping, enforcing temporal dead zones and immutability invariants.

### 2. Arrow Functions and Lexical \`this\`
Arrow functions (\`() => {}\`) provide not only concise syntax but crucially bind \`this\` lexically from the surrounding scope, eliminating the fragile \`var self = this\` workarounds of legacy JavaScript.

### 3. Destructuring Assignment & Spread Operators
Destructuring allows elegant unpacking of arrays and object keys:
\`\`\`javascript
const { status, payload: { user, tokens } } = response;
const mergedConfig = { ...defaultConfig, ...userOverrides };
\`\`\`

### 4. Native Promises & Asynchronous Pipelines
ES6 replaced chaotic callback pyramids with native \`Promise\` objects, paving the way for modern \`async/await\` syntax that powers high-throughput Node.js microservices.

### 5. ES Modules (ESM)
Standardized \`import\` and \`export\` syntax replaced fragmented CommonJS and AMD patterns, enabling static tree-shaking and modern frontend bundlers like Webpack, Vite, and Next.js.`,
    read_time_minutes: 5,
    published_date: '2023-01-20',
    tags: JSON.stringify(['JavaScript', 'ES6', 'Web Development', 'Frontend']),
    featured: 0
  },
  {
    title: 'Applying Redux Architecture and State API in Production Web Applications',
    slug: 'applying-redux-api-web-applications',
    category: 'Frontend Engineering',
    summary: 'An architectural breakdown of predictable unidirectional state flow: Actions, pure reducers, immutable state trees, and middleware in complex web applications.',
    content: `## Unidirectional State Flow

In large-scale client applications like financial stock dashboards (e.g. Zsenia) or medical patient record portals, managing mutable state across nested component trees quickly devolves into an unmaintainable web of two-way bindings.

Redux resolves this complexity through three foundational principles:
1. **Single Source of Truth**: The global state of your application is stored in an immutable object tree within a single store.
2. **State is Read-Only**: The only way to change state is to emit an action—an intent object describing what happened.
3. **Changes are Made with Pure Reducer Functions**: Reducers accept previous state and an action, returning a brand-new state object without side effects.

---

## Scaling Redux with Redux Toolkit (RTK)

Modern Redux leverages Redux Toolkit to dramatically simplify boilerplate:
- \`createSlice\` auto-generates action creators and action types.
- Integrates Immer under the hood, allowing developers to write intuitive mutating syntax that immutably updates underlying states.
- \`createAsyncThunk\` provides standardized pending, fulfilled, and rejected lifecycle handlers for REST API queries.`,
    read_time_minutes: 6,
    published_date: '2023-04-14',
    tags: JSON.stringify(['Redux', 'React.js', 'State Management', 'Frontend Architecture']),
    featured: 0
  }
];

for (const art of articles) {
  insertArt.run(art);
}
console.log(`Seeded ${articles.length} articles successfully.`);

// 7. Videos Seeding
const insertVid = db.prepare(`
  INSERT INTO videos (
    title, slug, category, description, video_url,
    thumbnail_url, duration, topics, related_project_slug, featured
  ) VALUES (
    @title, @slug, @category, @description, @video_url,
    @thumbnail_url, @duration, @topics, @related_project_slug, @featured
  )
`);

const videos = [
  {
    title: 'Rxpert: AI Literature Review Module Architecture & Technical Discussion',
    slug: 'rxpert-literature-review-walkthrough',
    category: 'Pharmaceutical AI',
    description: 'A deep-dive technical presentation and module demonstration of Rxpert’s literature review engine: Ingesting scientific papers, extracting active ingredients, and synthesizing pharmacological summaries.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder / embeddable
    thumbnail_url: '/assets/images/rxpert-fig2_litreview.webp',
    duration: '18:45',
    topics: JSON.stringify(['Literature Review', 'Pharmaceutical AI', 'Vector RAG', 'QTPP']),
    related_project_slug: 'rxpert-pharmaceutical',
    featured: 1
  },
  {
    title: 'Rxpert: Quality Target Product Profile (QTPP) & Formulation Synthesis Demo',
    slug: 'rxpert-qtpp-formulation-demo',
    category: 'Pharmaceutical AI',
    description: 'Detailed operational walkthrough showcasing how the QTPP and formulation modules automatically match excipients, forecast dissolution profiles, and compile compliance documentation.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/assets/images/rxpert-fig3_qtpp.webp',
    duration: '14:20',
    topics: JSON.stringify(['QTPP Synthesis', 'API Selection', 'Formulation', '21 CFR Part 11']),
    related_project_slug: 'rxpert-pharmaceutical',
    featured: 1
  },
  {
    title: 'Doctor J: Multimodal Medical Vision & Streaming AI Assistant Overview',
    slug: 'doctor-j-system-architecture-overview',
    category: 'Medical AI',
    description: 'Architectural overview of Doctor J (stage.doctorj.health): Ingesting chest X-rays, MRI scans, and lab reports with zero-loss SSE streaming, Redis atomic rate limits, and patient privacy shielding.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/assets/images/doctorj-hero.webp',
    duration: '22:10',
    topics: JSON.stringify(['Healthcare AI', 'Medical Vision', 'FastAPI', 'System Architecture']),
    related_project_slug: 'doctor-j',
    featured: 1
  },
  {
    title: 'AgroGPT: Real-Time Crop Disease Vision & Localized Bengali Voice Intelligence',
    slug: 'agrogpt-crop-diagnostic-demo',
    category: 'Agritech AI',
    description: 'Live field demo of AgroGPT detecting leaf blights and pest attacks from camera photos, paired with low-latency bidirectional voice conversations in native Bengali.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/assets/images/agrogpt-hero.webp',
    duration: '12:35',
    topics: JSON.stringify(['Agritech', 'Crop Disease Vision', 'Voice Streaming', 'Gemini Flash']),
    related_project_slug: 'agrogpt',
    featured: 1
  }
];

for (const vid of videos) {
  insertVid.run(vid);
}
console.log(`Seeded ${videos.length} videos successfully.`);

// 8. Media Assets Seeding
const insertMedia = db.prepare(`
  INSERT INTO media_assets (
    filename, original_name, url, mime_type, size_bytes, folder, alt_text
  ) VALUES (
    @filename, @original_name, @url, @mime_type, @size_bytes, @folder, @alt_text
  )
`);

const media = [
  {
    filename: 'sumaiya-profile.png',
    original_name: 'sumaiya Mayra.png',
    url: '/assets/images/sumaiya-profile.webp',
    mime_type: 'image/png',
    size_bytes: 460000,
    folder: 'profile',
    alt_text: 'Sumaiya Akter - Official Professional Profile Headshot'
  },
  {
    filename: 'sumaiya-portrait.jpg',
    original_name: 'original.jpg',
    url: '/assets/images/sumaiya-portrait.webp',
    mime_type: 'image/jpeg',
    size_bytes: 917000,
    folder: 'profile',
    alt_text: 'Sumaiya Akter - Studio Professional Portrait'
  },
  {
    filename: 'doctorj-hero.png',
    original_name: 'homepage-background.png',
    url: '/assets/images/doctorj-hero.webp',
    mime_type: 'image/png',
    size_bytes: 2200000,
    folder: 'projects',
    alt_text: 'Doctor J (MedGPT) Clinical Healthcare Platform UI'
  },
  {
    filename: 'agrogpt-hero.png',
    original_name: 'home-page.png',
    url: '/assets/images/agrogpt-hero.webp',
    mime_type: 'image/png',
    size_bytes: 1800000,
    folder: 'projects',
    alt_text: 'AgroGPT Agricultural Intelligence Platform Homepage'
  },
  {
    filename: 'snap-and-get.png',
    original_name: 'Snap & GET.png',
    url: '/assets/images/snap-and-get.webp',
    mime_type: 'image/png',
    size_bytes: 3300000,
    folder: 'projects',
    alt_text: 'Snap & Get AI Visual Product Search Mobile App'
  },
  {
    filename: 'Sumaiya_Akter_CV.pdf',
    original_name: 'Sumaiya_Akter-resume--.pdf',
    url: '/assets/docs/Sumaiya_Akter_CV.pdf',
    mime_type: 'application/pdf',
    size_bytes: 180000,
    folder: 'documents',
    alt_text: 'Official CV of Sumaiya Akter'
  },
  {
    filename: 'Automated_Lung_Cancer_Detection_Paper.pdf',
    original_name: 'main.pdf',
    url: '/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf',
    mime_type: 'application/pdf',
    size_bytes: 353000,
    folder: 'documents',
    alt_text: 'Automated Lung Cancer Detection Research Paper'
  },
  {
    filename: 'LegalSupportAI_Paper.pdf',
    original_name: 'paper.pdf',
    url: '/assets/docs/LegalSupportAI_Paper.pdf',
    mime_type: 'application/pdf',
    size_bytes: 420000,
    folder: 'documents',
    alt_text: 'LegalSupportAI Rights-by-Design Audit Paper (RT4RJ JURIX 2026)'
  }
];

for (const m of media) {
  insertMedia.run(m);
}
console.log(`Seeded ${media.length} media assets successfully.`);

console.log('--- Database Seeding Completed Successfully! ---');

