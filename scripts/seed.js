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
  {
    title: 'Doctor J (MedGPT / MedAssist AI)',
    slug: 'doctor-j',
    tagline: 'Production AI healthcare assistant with multimodal vision pipelines, streaming medical reasoning, and clinical compliance.',
    category: 'Healthcare Technology',
    status: 'Live in Production',
    role: 'Backend AI Engineer & System Architect',
    featured: 1,
    order_index: 1,
    thumbnail: '/assets/images/doctorj-hero.png',
    gallery: JSON.stringify([
      '/assets/images/doctorj-hero.png',
      '/assets/images/rxpert-fig1_pipeline.png',
    ]),
    summary: 'A mission-critical clinical AI platform engineered with FastAPI, PostgreSQL, Redis, Next.js, and Google Gemini. Capable of analyzing complex medical artifacts including X-Rays, MRIs, CT scans, and multi-page lab reports while maintaining strict patient data isolation and HIPAA/IDOR compliance.',
    problem_statement: 'Clinical diagnostic workflows suffer from heavy physician fatigue, delayed second-opinion turnaround, and manual data transcription overhead. General LLMs fail in medical environments due to hallucinations, lack of vision grounding on raw radiology scans, and unpredictable API latency.',
    solution_overview: 'Doctor J integrates an end-to-end multimodal diagnostic pipeline: Gemini 2.5/1.5 Flash Vision for artifact analysis, server-authoritative Redis/PostgreSQL streaming persistence, atomic Lua-scripted rate limiting, a 5-key automatic rotation manager with 60-second cooldown resilience, and IDOR prevention ensuring tenant-level isolation.',
    architecture_details: 'Edge reverse proxy via Nginx 1.27 with Cloudflare Tunnel termination (stage.doctorj.health). Presentation tier in Next.js 14 App Router with Zustand stores and SSR-safe localization. Core API Gateway powered by FastAPI with Prometheus instrumentation, routing to clinical task classifiers, MinIO S3 object storage, and vector retrieval pipelines.',
    architecture_diagram: `flowchart TD
  Client["Web / PWA / Mobile"] --> Nginx["Nginx Edge Proxy (stage.doctorj.health)"]
  Nginx --> NextClient["Next.js 14 App Router"]
  Nginx --> FastApi["FastAPI Gateway (Port 18000)"]
  FastApi --> Auth["JWT & Google Auth (IDOR Check)"]
  FastApi --> TaskClass["Intelligent Task Classifier"]
  TaskClass --> Vision["Multimodal Vision (X-Ray/MRI/CT)"]
  TaskClass --> DocOcr["Prescription OCR & Dosage Evaluator"]
  TaskClass --> RAG["Clinical RAG Engine (ChromaDB / Vector)"]
  Vision --> KeyRot["Gemini 5-Key Rotation Manager"]
  DocOcr --> KeyRot
  FastApi --> Redis["Redis (Lua Atomic Quotas & Celery)"]
  FastApi --> Postgres[("PostgreSQL Multi-Tenant DB")]
  FastApi --> MinIO[("MinIO S3 Object Storage")]`,
    engineering_challenges: '1. Preventing quota exhaustion under heavy concurrent hospital queries: Designed an atomic Lua script in Redis enforcing daily token and request ceilings. 2. Failure resilience during LLM API hiccups: Implemented round-robin Gemini multi-key rotation with automatic 60s cooldown isolation. 3. Zero-loss streaming: Implemented server-authoritative message persistence guaranteeing that disconnects during SSE streams do not orphan partial clinical records.',
    key_features: JSON.stringify([
      'Multimodal Clinical Vision: Ingestion & analysis of Chest X-Rays, Brain MRIs, Abdominal CT scans, and Ultrasounds.',
      'Prescription OCR & Dosage Evaluator: Automated extraction of active pharmaceutical ingredients, frequency, and contraindication flags.',
      '5-Key Rotation & Rate Limiting: Dynamic failover across Gemini API keys with 60s quarantine upon 429 rate limit triggers.',
      'Patient Data Isolation & IDOR Shielding: Cryptographic owner-scoped access verification across all database queries.',
      'Locust Production Benchmarking: Stress-tested at 500+ concurrent simulated physician sessions with sub-250ms TTFT.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Gemini Vision', 'OpenAI',
      'Next.js 14', 'Docker Compose', 'MinIO S3', 'Celery', 'Prometheus', 'Nginx'
    ]),
    measurable_outcomes: 'Deployed at stage.doctorj.health; passed Locust concurrency load test with 99.8% availability; reduced clinical transcription query latency to <1.2s.',
    live_url: 'https://stage.doctorj.health',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: '/research/llama-xr-radiology-report'
  },
  {
    title: 'AgroGPT (Agro-GPT v2)',
    slug: 'agrogpt',
    tagline: 'Production AI agriculture platform with multimodal crop pathology diagnostics, localized Bengali voice synthesis, and weather intelligence.',
    category: 'AI & Machine Learning',
    status: 'Live in Production',
    role: 'Lead Backend & AI Engineer',
    featured: 1,
    order_index: 2,
    thumbnail: '/assets/images/agrogpt-hero.png',
    gallery: JSON.stringify([
      '/assets/images/agrogpt-hero.png',
      '/assets/images/agrogpt-mobile.png',
      '/assets/images/agrogpt-logo.jpg',
    ]),
    summary: 'An agricultural intelligence platform tailored for farmers, agronomists, and extension officers. Integrates multimodal visual disease diagnosis, dynamic multi-persona AI switching (Crop, Cattle, Poultry, Soil), and bidirectional voice streaming in native Bengali.',
    problem_statement: 'Smallholder farmers in South Asia encounter severe crop loss due to delayed disease identification, inaccessible agricultural advisory services, and low literacy barriers preventing them from using English-centric digital apps.',
    solution_overview: 'AgroGPT leverages multimodal vision models (Gemini Flash) trained with domain prompts to detect leaf blights, fungal rusts, and pest attacks from mobile camera photos. It integrates low-latency WebSockets for bidirectional voice streaming in Bengali, and correlates regional weather APIs with crop disease vulnerability matrices.',
    architecture_details: 'FastAPI microservices communicating over async worker pools; PyMuPDF and Pytesseract OCR pipeline for soil test parsing; PostgreSQL relational persistence for farmers queries; Redis caching for district-level meteorological forecasts; Progressive Web App (PWA) client optimized for 3G connectivity.',
    architecture_diagram: `flowchart TD
  Farmer["Farmer / Field Officer"] --> PWA["Mobile PWA (Bangla Voice / Camera)"]
  PWA --> Ingress["Nginx Edge"]
  Ingress --> Gateway["FastAPI Core Engine"]
  Gateway --> VoiceEngine["Bengali Voice & TTS Engine"]
  Gateway --> CropVision["Crop Disease Vision Pipeline"]
  Gateway --> PersonaRouter["Multi-Persona Router (Crop/Cattle/Soil)"]
  CropVision --> Gemini["Gemini Multimodal Vision API"]
  Gateway --> Weather["District Weather & Market Price Cache"]
  Gateway --> DB[("PostgreSQL + Redis")]`,
    engineering_challenges: '1. Designing low-bandwidth friendly image uploads for rural 2G/3G networks: Created a client-side WebP compression pipeline reducing payload size by 82% before upload. 2. Real-time voice interaction with non-standard regional dialects: Optimized acoustic phoneme mapping and prompt context engineering for localized Bengali agricultural vocabulary.',
    key_features: JSON.stringify([
      'Visual Crop Pathology: Pinpoints leaf blights, bacterial wilt, and pest infestations within seconds.',
      'Bengali Voice AI: Ultra-low latency voice-in, voice-out streaming allowing illiterate farmers to converse naturally.',
      'Multi-Agent Personas: Seamless switching between Crop AI, Cattle AI, Poultry AI, Aqua AI, and Soil AI.',
      'Document & Soil Report Parsing: Ingests lab reports and agricultural manuals via OCR and semantic extraction.',
      'Hyperlocal Meteorological Grounding: Dynamic agronomic advisories based on 7-day rainfall and temperature forecasts.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'Gemini Flash', 'PyTorch', 'PostgreSQL', 'Redis',
      'WebSockets', 'Pytesseract', 'PyMuPDF', 'Docker', 'Next.js'
    ]),
    measurable_outcomes: 'Adopted across agricultural field trials; achieved 92.4% diagnostic accuracy across top 15 regional crop diseases; handles voice streaming responses under 800ms.',
    live_url: 'https://agro-gpt.com',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Snap & Get',
    slug: 'snap-and-get',
    tagline: 'AI-powered visual product search and price discovery application connecting mobile camera inputs to retail catalog intelligence.',
    category: 'Computer Vision',
    status: 'Live in Production',
    role: 'Backend AI Engineer',
    featured: 1,
    order_index: 3,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A computer vision e-commerce discovery engine that lets consumers snap photos of real-world items (apparel, groceries, electronics) and immediately matches them against local retail catalogs and online merchant offerings with real-time price comparison.',
    problem_statement: 'Shoppers frequently see products offline that they wish to purchase online, but struggle to articulate exact model numbers, brand tags, or specific visual styles in textual search engines.',
    solution_overview: 'Built an asynchronous processing pipeline using FastAPI and Gemini Vision API to extract salient product features (brand, category, color, model, texture) from camera photos, querying indexed inventory databases with MinIO image storage and Redis caching.',
    architecture_details: 'Mobile client communicates with FastAPI API gateway. Images are streamed directly to MinIO S3 object storage; vision extraction workers run asynchronously with Redis queues; results are aggregated across merchant APIs and returned with localized pricing.',
    architecture_diagram: `flowchart LR
  User["Shopper Mobile App"] --> Upload["FastAPI Image Ingress"]
  Upload --> MinIO["MinIO S3 Storage"]
  Upload --> Worker["Async Feature Extraction"]
  Worker --> Vision["Gemini Vision Embeddings"]
  Worker --> Search["Product Catalog & Merchant API"]
  Search --> Aggregator["Price Comparison Engine"]
  Aggregator --> Cache["Redis Fast Lookup"]
  Cache --> User`,
    engineering_challenges: 'Handling noisy, skewed mobile camera photos with reflective backgrounds and poor lighting. Implemented an automatic adaptive contrast and aspect-ratio normalization preprocessor before passing image tensors to the vision model.',
    key_features: JSON.stringify([
      'Instant Visual Search: Sub-second visual matching from raw camera capture.',
      'Merchant Aggregation: Compares nearby physical stores with top e-commerce websites.',
      'MinIO Object Storage: Scalable S3-compatible asset management for millions of user captures.',
      'Usage Controls & Quotas: Rate limiting to prevent scraper abuse and protect API budgets.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'Gemini Vision', 'MinIO', 'PostgreSQL', 'Redis', 'Docker Compose', 'Flutter'
    ]),
    measurable_outcomes: 'Supported 10,000+ visual searches during launch trials with 89% top-3 catalog match accuracy.',
    live_url: 'https://snapget.app',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Rxpert & LabInsight (Pharmaceutical Intelligence)',
    slug: 'rxpert-pharmaceutical',
    tagline: 'AI-powered pharmaceutical intelligence platform for formulation optimization, QTPP research, and 21 CFR Part 11 compliant QC labs.',
    category: 'Enterprise Systems',
    status: 'Production-Ready',
    role: 'Lead System Architect & AI Engineer',
    featured: 1,
    order_index: 4,
    thumbnail: '/assets/images/rxpert-fig1_pipeline.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig1_pipeline.png',
      '/assets/images/rxpert-fig2_litreview.png',
      '/assets/images/rxpert-fig3_qtpp.png',
      '/assets/images/rxpert-fig4_apiselect.png',
      '/assets/images/rxpert-fig5_formulation.png'
    ]),
    summary: 'An enterprise-scale platform engineered for pharmaceutical R&D and Quality Control laboratories. Automates scientific literature review summarization, Active Pharmaceutical Ingredient (API) selection, Quality Target Product Profile (QTPP) synthesis, and ensures ALCOA+ data integrity compliance.',
    problem_statement: 'Formulation scientists spend months manually reviewing pharmacological literature, excipient compatibility tables, and regulatory guidelines when developing generic drug formulations.',
    solution_overview: 'Engineered a specialized modular system: Module 1 (Scientific Literature Mining), Module 2 (QTPP Generator), Module 3 (API & Excipient Selection), and Module 4 (Formulation Predictor). Paired with LabInsight, an ALCOA+ compliant laboratory information management dashboard.',
    architecture_details: 'FastAPI microservices coupled with PostgreSQL schema enforcing tamper-evident audit logs; MinIO object storage for spectroscopic and chromatographic data; Next.js frontend with enterprise role-based authorization; JWT security and Redis session caching.',
    architecture_diagram: `flowchart TD
  Scientist["R&D Chemist / Formulator"] --> WebUI["Next.js Enterprise Portal"]
  WebUI --> Auth["21 CFR Part 11 Auth & Audit Trail"]
  Auth --> Core["FastAPI Microservices Core"]
  Core --> Mod1["Module 1: Literature Review Engine"]
  Core --> Mod2["Module 2: QTPP Formulation Engine"]
  Core --> Mod3["Module 3: API & Excipient Selector"]
  Core --> Mod4["Module 4: Stability & Dissolution Predictor"]
  Core --> LIMS["LabInsight LIMS & QC Data Logger"]
  Mod1 --> Chroma["Vector Knowledge Base"]
  Core --> DB[("PostgreSQL Audit Trail")]`,
    engineering_challenges: 'Meeting strict 21 CFR Part 11 and EU GMP Annex 11 regulatory compliance: Every edit, calculation, or generated dossier section requires cryptographic audit trails with user identity, timestamp, and modification rationale.',
    key_features: JSON.stringify([
      'Automated QTPP Generation: Synthesizes critical quality attributes (CQAs) based on target drug products.',
      'API Selection Assistant: Evaluates physicochemical properties, BCS classification, and solubility.',
      'Literature Mining: Vector search across PubMed, patents, and scientific journals with citation grounding.',
      'ALCOA+ Audit Trails: Tamper-evident logging ensuring Attributable, Legible, Contemporaneous, Original, and Accurate data.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'PostgreSQL', 'LangChain', 'ChromaDB', 'Redis',
      'Next.js', 'MinIO', 'Docker', '21 CFR Part 11'
    ]),
    measurable_outcomes: 'Cut initial generic drug formulation research timeline from 8 weeks to under 4 days; verified across 12 distinct pharmaceutical dosage forms.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'RA Script (Pharmaceutical AI Regulatory Affairs)',
    slug: 'ra-script',
    tagline: 'Enterprise multi-tenant AI assistant for pharmaceutical CTD/eCTD dossier generation, cross-document inconsistency auditing, and gap analysis.',
    category: 'Enterprise Systems',
    status: 'In Development',
    role: 'AI Engineer & Backend Architect',
    featured: 0,
    order_index: 5,
    thumbnail: '/assets/images/rxpert-fig3_qtpp.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig3_qtpp.png'
    ]),
    summary: 'A specialized regulatory affairs AI platform designed to assemble Common Technical Document (CTD) and electronic CTD (eCTD) submissions for health regulatory agencies (US FDA, EMA, WHO). Automatically flags inconsistencies across Modules 2, 3, 4, and 5.',
    problem_statement: 'Regulatory submissions span thousands of pages. Discrepancies between manufacturing batch data (Module 3) and clinical summaries (Module 2/5) result in costly Refuse-to-File (RTF) letters from regulatory authorities.',
    solution_overview: 'RA Script uses multi-stage document parsing, structured LLM extraction, and deterministic semantic cross-verification to identify numerical mismatches, specification deviations, and missing stability study intervals before submission.',
    architecture_details: 'FastAPI multi-tenant architecture with tenant-isolated database schemas; Celery background workers for batch PDF document OCR; LangGraph orchestration for complex multi-step regulatory validation rules.',
    architecture_diagram: `flowchart LR
  Dossier["eCTD Dossier (M2/M3/M4/M5)"] --> Parser["Document Parser & OCR Engine"]
  Parser --> Struct["Structured JSON Entity Extractor"]
  Struct --> Graph["LangGraph Cross-Verification Engine"]
  Graph --> Inconsistency["Discrepancy & Gap Detector"]
  Inconsistency --> Report["Regulatory Compliance Report"]`,
    engineering_challenges: 'Handling massive 500+ page pharmaceutical dossiers while maintaining token budget and high precision: Implemented hierarchical section chunking with deterministic cross-referencing tables.',
    key_features: JSON.stringify([
      'CTD/eCTD Structure Mapping: Automatic categorization into ICH M4 guidelines.',
      'Cross-Document Consistency Check: Flags discrepancy between raw batch releases and narrative summaries.',
      'Gap Analysis: Detects missing forced degradation studies or stability tests.',
      'Drafting Assistant: Synthesizes high-fidelity regulatory justification memos.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'LangGraph', 'PostgreSQL', 'Redis', 'Celery', 'Docker'
    ]),
    measurable_outcomes: 'Identified 100% of injected numerical discrepancies in benchmark dossier tests across 3 ICH test submissions.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'LegalSupportAI & Lawyer Lagbe BD',
    slug: 'legalsupport-ai',
    tagline: 'Bilingual legal AI platform and rights-by-design statutory assistance engine for Bangladesh citizens.',
    category: 'RAG & AI Agents',
    status: 'Live in Production',
    role: 'Co-Founder & Lead Technical Architect',
    featured: 1,
    order_index: 6,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A civic legal AI service and research system deployed on Google Play (com.aci.legalai) providing bilingual (Bengali, Banglish, English) legal guidance across Bangladesh statutory law, validated via a rights-by-design audit published at RT4RJ @ JURIX 2026.',
    problem_statement: 'Vulnerable citizens facing unlawful tenancy evictions, unpaid wages, or domestic disputes cannot afford licensed counsel and lack basic knowledge of statutory protections.',
    solution_overview: 'Engineered a 6-stage legal assistance lifecycle: citizen multilingual query processing, intent/jurisdiction gating, tiered statutory retrieval, user privacy shielding, provenance-grounded answering, and transactional history erasure to prevent domestic surveillance.',
    architecture_details: 'Flutter client communicating with FastAPI gateway and Firebase Auth; ChromaDB vector index over the Bangladesh Code (statutes); Gemini 1.5 Flash generator with statutory citation grounding; privacy scrubber purging personally identifiable information.',
    architecture_diagram: `flowchart TD
  Citizen["Citizen Query (Bengali/Banglish/English)"] --> Gate["Stage 1: Intent & Jurisdiction Gating"]
  Gate --> Shield["Stage 2: Privacy Shielding (PII Scrubber)"]
  Shield --> TieredRAG["Stage 3: Tiered Statutory Retrieval (BD Code)"]
  TieredRAG --> Gen["Stage 4: Grounded Legal Answering (Gemini)"]
  Gen --> Audit["Stage 5: Evidential Provenance Verification"]
  Audit --> Purge["Stage 6: Transactional Erasure (Zero-Retention)"]`,
    engineering_challenges: 'Preventing legal hallucination and cross-user cache collisions: Discovered and rectified an ASCII regex flaw during our empirical audit that previously leaked contextual state in Bengali phonetic queries.',
    key_features: JSON.stringify([
      'Bilingual Legal Grounding: Operates over codified laws in Bengali, Banglish, and English.',
      'Transactional Privacy Erasure: Automatic zero-knowledge memory purging for vulnerable users.',
      'Statutory Source Cards: Displays verifiable legal sections and court jurisdictions.',
      'Mobile App Release: Deployed to Google Play store.'
    ]),
    technologies: JSON.stringify([
      'Flutter', 'Firebase', 'FastAPI', 'Python', 'ChromaDB', 'Gemini', 'PostgreSQL'
    ]),
    measurable_outcomes: 'Published at RT4RJ @ JURIX 2026; evaluated over 500+ legal consultations; scored 4.83/5.00 fluency and 4.05/5.00 correctness in independent legal expert evaluations.',
    live_url: 'https://play.google.com/store/apps/details?id=com.aci.legalai',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: '/research/from-statute-to-citizen-legal-ai'
  },
  {
    title: 'Insta-Hygiene',
    slug: 'insta-hygiene',
    tagline: 'Multi-vendor e-commerce platform specializing in hygiene supplies with role-based access control and containerized deployment.',
    category: 'Full-Stack Software',
    status: 'Live in Production',
    role: 'Full-Stack & Backend Engineer',
    featured: 0,
    order_index: 7,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A full-stack multi-vendor e-commerce platform dedicated to certified personal care and hygiene essentials, featuring real-time inventory management, vendor dashboards, secure payment flows, and containerized Docker architecture.',
    problem_statement: 'High failure rates in multi-vendor stock synchronization during demand spikes, along with security vulnerabilities in vendor-scoped order isolation.',
    solution_overview: 'Built with a decoupled Next.js frontend and high-throughput FastAPI backend with strict role-based access control (Admin, Vendor, Customer), atomic stock decrements, and automated Dockerized deployment.',
    architecture_details: 'Next.js App Router (port 5188) and FastAPI core (port 8015). PostgreSQL database with Alembic schema versioning; Redis-backed shopping cart and checkout session management; Nginx ingress with rate limiting.',
    architecture_diagram: `flowchart LR
  Customer["Customer Browser"] --> Nginx["Nginx Reverse Proxy"]
  Vendor["Vendor Dashboard"] --> Nginx
  Nginx --> NextFE["Next.js SSR Frontend"]
  Nginx --> FastBE["FastAPI Core Service"]
  FastBE --> Postgres[("PostgreSQL")]
  FastBE --> Redis[("Redis Session Store")]`,
    engineering_challenges: 'Preventing race conditions during flash purchases: Utilized database row-level locking (`SELECT ... FOR UPDATE`) within ACID transactions to guarantee zero overselling.',
    key_features: JSON.stringify([
      'Multi-Vendor Architecture: Dedicated portal for vendors to manage SKUs, pricing, and fulfillment.',
      'Role-Based Authorization: Cryptographically isolated permissions for Customers, Vendors, and Admins.',
      'Real-Time Cart & Checkout: High-performance session persistence with Redis.',
      'Dockerized Microservices: Single-command deployment with health-check monitoring.'
    ]),
    technologies: JSON.stringify([
      'FastAPI', 'Next.js', 'PostgreSQL', 'Docker', 'Redis', 'Tailwind CSS', 'SQLAlchemy'
    ]),
    measurable_outcomes: 'Maintained 100% order consistency during stress tests with 200 concurrent checkouts; zero stock synchronization errors.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'ScolarScout',
    slug: 'scolar-scout',
    tagline: 'AI-powered professor discovery and academic outreach management system for prospective graduate researchers.',
    category: 'RAG & AI Agents',
    status: 'Production-Ready',
    role: 'Creator & Lead Architect',
    featured: 1,
    order_index: 8,
    thumbnail: '/assets/images/rxpert-fig2_litreview.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig2_litreview.png'
    ]),
    summary: 'An academic CRM and research discovery system engineered to help prospective PhD and Master’s by Research applicants find professors whose active research directly aligns with their profile, discover verified institutional emails, and generate evidence-grounded outreach inquiries.',
    problem_statement: 'Graduate school applicants send hundreds of generic, ungrounded cold emails to faculty members, which are promptly ignored due to lack of specificity and clear research overlap.',
    solution_overview: 'ScolarScout implements a 6-dimension research matching engine (Topic Alignment 35%, Recent Publications 20%, Lab Alignment 15%, Supervision Suitability 10%, Funding Signals 10%, Academic Compatibility 10%). It crawls institutional faculty directories, validates DNS deliverability, and enriches publications via OpenAlex and Crossref APIs.',
    architecture_details: 'FastAPI asynchronous engine, academic dorking adapter layer (Serper API + offline curated registry), OpenAlex REST integration, and Gemini-powered personalized email synthesis engine.',
    architecture_diagram: `flowchart TD
  Profile["Applicant Credentials & Papers"] --> Dorker["Academic Search & Dorking Engine"]
  Dorker --> FacultyFinder["Faculty Crawler & Parser"]
  FacultyFinder --> EmailVerifier["Institutional Email & DNS Validator"]
  EmailVerifier --> OpenAlex["OpenAlex / Crossref Publication Enrichment"]
  OpenAlex --> MatchEngine["6-Dimension Matching Engine (0-100 Score)"]
  MatchEngine --> Synthesis["Gemini Evidence-Grounded Email Writer"]`,
    engineering_challenges: 'Eliminating hallucinations in email generation: Implemented a strict Grounding Guarantee where the LLM is prohibited from claiming applicant skills or citing papers not cryptographically verified in the user profile.',
    key_features: JSON.stringify([
      '6-Dimension Matching: Algorithmic compatibility scoring based on empirical publication citations.',
      'Public Email Discovery: Extracts and verifies institutional addresses (.edu, .ac.uk, .edu.au).',
      'OpenAlex & Crossref API: Enriches professor records with recent works and citation counts.',
      'Grounding Guarantee: Strictly eliminates hallucinated qualifications.'
    ]),
    technologies: JSON.stringify([
      'Python', 'FastAPI', 'Gemini API', 'OpenAlex API', 'Crossref API', 'PostgreSQL', 'Docker'
    ]),
    measurable_outcomes: 'Evaluated across 150+ top global faculty members; achieved 94% email deliverability validation rate; drafts grounded inquiries in under 4 seconds.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Sayora (AI Communication Gym)',
    slug: 'sayora',
    tagline: 'Interactive conversational AI platform for interpersonal roleplay, communication feedback, and behavioral coaching.',
    category: 'Generative AI & LLMs',
    status: 'Completed',
    role: 'Lead AI Engineer',
    featured: 0,
    order_index: 9,
    thumbnail: '/assets/images/rxpert-fig5_formulation.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig5_formulation.png'
    ]),
    summary: 'An AI communication gym where professionals practice challenging workplace dialogues (negotiations, performance reviews, conflict resolution) with an AI partner that dynamically adapts its emotional posture and returns structured behavioral rubrics.',
    problem_statement: 'People struggle with high-stakes conversations because traditional books and courses provide passive knowledge without realistic, low-consequence practice arenas.',
    solution_overview: 'Sayora implements a multi-turn conversation simulation loop: users select a situation, engage in verbal or text dialogue, and receive multidimensional scoring (Empathy, Assertiveness, Clarity, De-escalation) alongside mirrored feedback and suggested improvements.',
    architecture_details: 'Next.js frontend with Web Audio recording; FastAPI backend orchestrating Gemini system personas; stateful dialog tree management in Redis.',
    architecture_diagram: `flowchart LR
  User["Learner Dialogue"] --> Audio["Speech / Text Processing"]
  Audio --> Persona["Dynamic LLM Interlocutor"]
  Persona --> Evaluator["Rubric Scoring Engine"]
  Evaluator --> Feedback["Scores + Mirroring + Alternative Phrasings"]`,
    engineering_challenges: 'Creating an AI persona that reacts naturally without breaking character or acting overly agreeable: Engineered adversarial persona constraints and hidden emotional temperature vectors.',
    key_features: JSON.stringify([
      'Dynamic Persona Reaction: AI counterpart becomes defensive or cooperative based on learner phrasing.',
      'Objective Rubric Scoring: Numerical evaluation across 4 behavioral dimensions.',
      'Communication Mirror: Replays how the user sounded to the other person.',
      'Alternative Phrasing Suggestions: Delivers actionable rewordings for critical moments.'
    ]),
    technologies: JSON.stringify([
      'FastAPI', 'Next.js', 'Gemini 1.5 Pro', 'Web Audio API', 'Redis', 'Tailwind CSS'
    ]),
    measurable_outcomes: 'Tested with 50+ workplace simulation scenarios; 91% user rating for realistic conversational tension and practical feedback quality.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Meeting Interpreter (Real-Time AI)',
    slug: 'meeting-interpreter',
    tagline: 'Real-time low-latency bidirectional speech translation and automated multilingual meeting intelligence.',
    category: 'AI & Machine Learning',
    status: 'Research Prototype',
    role: 'AI Systems Engineer',
    featured: 0,
    order_index: 10,
    thumbnail: '/assets/images/rxpert-fig4_apiselect.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig4_apiselect.png'
    ]),
    summary: 'A real-time translation and meeting assistance streaming engine that captures live audio streams, generates near-instantaneous multilingual subtitles, and synthesizes action items upon call completion.',
    problem_statement: 'International remote teams face language barriers during live technical meetings where post-meeting transcription arrives too late for real-time collaboration.',
    solution_overview: 'Implemented an asynchronous audio chunking pipeline over WebSockets, passing speech frames to streaming speech-to-text models, followed by fast translation and context-preserving summarization.',
    architecture_details: 'Python async WebSocket server, audio frame streaming buffer, Whisper model inference, and streaming LLM translation pipeline.',
    architecture_diagram: `flowchart LR
  Mic["Live Audio Stream"] --> WS["WebSocket Buffer"]
  WS --> Whisper["Streaming STT (Whisper)"]
  Whisper --> Trans["Translation Engine"]
  Trans --> Broadcast["Real-Time Subtitle Stream"]
  Broadcast --> Summarizer["Action Item Extractor"]`,
    engineering_challenges: 'Minimizing end-to-end latency below human conversational pause thresholds (<1.2s): Implemented predictive VAD (Voice Activity Detection) and sliding context windows.',
    key_features: JSON.stringify([
      'Streaming Audio Processing: Continuous audio ingestion via low-latency WebSockets.',
      'Sub-Second Translation: Parallelized token generation for live subtitles.',
      'Automatic Action Items: Post-meeting executive briefing and task assignment.',
      'Multilingual Support: Bengali, English, Hindi, and Mandarin language pairs.'
    ]),
    technologies: JSON.stringify([
      'Python', 'WebSockets', 'Whisper', 'FastAPI', 'LLM Streaming', 'Docker'
    ]),
    measurable_outcomes: 'Achieved average end-to-end translation latency of 950ms on GPU-accelerated test benchmarks.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Zsenia Web Application',
    slug: 'zsenia-financial',
    tagline: 'Financial and stock market equities analytics web platform engineered for New York trading data.',
    category: 'Full-Stack Software',
    status: 'Completed',
    role: 'Frontend & API Engineer',
    featured: 0,
    order_index: 11,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A high-performance equity market intelligence web platform built for US market data visualization, ticker screening, and real-time financial ratio calculations.',
    problem_statement: 'Traders needed interactive, responsive charting with instant filtering across thousands of securities without UI stuttering.',
    solution_overview: 'Developed with React.js, Redux state management, custom SCSS architecture, and optimized REST API caching.',
    architecture_details: 'React.js Single Page Application, Redux store for market state, WebSockets for tick data, and REST API integration with New York financial data feeds.',
    architecture_diagram: `flowchart LR
  MarketFeed["Stock Feed API"] --> Redux["Redux Global State Store"]
  Redux --> Charts["Interactive Canvas Charts"]
  Charts --> Screener["High-Frequency Screener UI"]`,
    engineering_challenges: 'Optimizing high-frequency re-renders: Implemented virtualized list rendering and debounced state mutations.',
    key_features: JSON.stringify([
      'Real-Time Ticker Screening: Dynamic filtering across P/E, volume, and volatility metrics.',
      'Interactive Financial Charts: Multi-timeframe candlestick and volume analysis.',
      'Redux State Architecture: Predictable single-source-of-truth state pipeline.'
    ]),
    technologies: JSON.stringify([
      'React.js', 'Redux', 'JavaScript', 'SCSS', 'HTML5', 'REST APIs'
    ]),
    measurable_outcomes: 'Smooth 60fps scrolling across 1,000+ live ticker rows; deployed for active US equities analytics.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Thebiz24 News Portal',
    slug: 'thebiz24',
    tagline: 'High-traffic digital journalism and news publishing portal with automated caching and editorial workflows.',
    category: 'Full-Stack Software',
    status: 'Completed',
    role: 'Full-Stack Developer',
    featured: 0,
    order_index: 12,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A comprehensive national news portal built to serve high concurrent traffic in Bangladesh, featuring categorization across business, politics, and technology.',
    problem_statement: 'Traffic spikes during breaking news events caused database connection pooling exhaustion and slow page load times.',
    solution_overview: 'Architected custom WordPress themes, configured aggressive server-side object caching, and optimized MySQL queries with database indexing.',
    architecture_details: 'Custom PHP theme, MySQL database with index tuning, Redis object cache, and cPanel/Nginx infrastructure.',
    architecture_diagram: `flowchart LR
  Readers["Mobile & Desktop Traffic"] --> Cache["Server Object & Page Cache"]
  Cache --> Theme["Optimized Theme Engine"]
  Theme --> DB[("Indexed MySQL Database")]`,
    engineering_challenges: 'Reducing Time to First Byte (TTFB) during breaking news traffic spikes: Reduced page weight by 65% through asset minification and image WebP conversions.',
    key_features: JSON.stringify([
      'High-Traffic Scalability: Handles sudden reader surges with zero downtime.',
      'Custom Editorial Dashboard: Role-based submission workflows for reporters and editors.',
      'SEO & OpenGraph Optimization: Automated social media metadata generation.'
    ]),
    technologies: JSON.stringify([
      'PHP', 'WordPress', 'MySQL', 'JavaScript', 'HTML5', 'CSS3'
    ]),
    measurable_outcomes: 'Served 50,000+ monthly page views with average page load times below 1.4 seconds.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Laravel User Management & Security System',
    slug: 'laravel-rbac',
    tagline: 'Enterprise role-based access control (RBAC) and security framework with audit logging and session isolation.',
    category: 'Full-Stack Software',
    status: 'Completed',
    role: 'Full-Stack Developer',
    featured: 0,
    order_index: 13,
    thumbnail: '/assets/images/snap-and-get.png',
    gallery: JSON.stringify([
      '/assets/images/snap-and-get.png'
    ]),
    summary: 'A robust administrative user management system featuring fine-grained permission matrices, dynamic role assignment, two-factor authentication capability, and security audit logs.',
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
      'Fine-Grained RBAC: Assign permissions to roles and roles to users.',
      'Security Audit Log: Records user logouts, failed login attempts, and permission grants.',
      'Reactive Vue.js UI: Instant search, pagination, and filterable user directory.'
    ]),
    technologies: JSON.stringify([
      'Laravel', 'PHP', 'Vue.js', 'MySQL', 'HTML/CSS', 'REST APIs'
    ]),
    measurable_outcomes: 'Zero authorization bypass vulnerabilities during internal security audits; deployed as foundational enterprise boilerplate.',
    live_url: '',
    github_url: 'https://github.com/sumaiyamayra',
    paper_url: ''
  },
  {
    title: 'Unifi Suite AI SaaS',
    slug: 'unifi-suite-ai',
    tagline: 'Multi-tenant AI business operating system and installable PWA for automated commerce intelligence.',
    category: 'Enterprise Systems',
    status: 'Research Prototype',
    role: 'System Architect',
    featured: 0,
    order_index: 14,
    thumbnail: '/assets/images/rxpert-fig1_pipeline.png',
    gallery: JSON.stringify([
      '/assets/images/rxpert-fig1_pipeline.png'
    ]),
    summary: 'A multi-tenant AI Business Operating System designed for small-to-medium businesses, digital agencies, and e-commerce stores, providing integrated marketing, customer support, and financial analytics.',
    problem_statement: 'SMEs waste hours context-switching between separate CRM, accounting, and customer support tools.',
    solution_overview: 'Created a unified command center combining automated lead triage, revenue forecasting, and multi-channel customer communications into an installable PWA.',
    architecture_details: 'FastAPI multi-tenant microservices, PostgreSQL with tenant schema partitioning, Next.js PWA with service workers, and Redis queues.',
    architecture_diagram: `flowchart LR
  SME["Business Owner (PWA)"] --> Gateway["Multi-Tenant Ingress"]
  Gateway --> LeadAI["Lead Triage Agent"]
  Gateway --> ForecastAI["Revenue Forecasting"]
  Gateway --> SupportAI["Customer Support Agent"]
  LeadAI --> DB[("PostgreSQL Multi-Tenant")]`,
    engineering_challenges: 'Maintaining complete data isolation between competing tenant organizations: Implemented PostgreSQL Row Level Security (RLS) driven by validated JWT tenant claims.',
    key_features: JSON.stringify([
      'Tenant Isolation: Zero cross-tenant data leakage via PostgreSQL Row-Level Security.',
      'Installable PWA: Offline-ready mobile and desktop application with service workers.',
      'Automated Lead Scoring: Analyzes inbound customer messages to prioritize deals.'
    ]),
    technologies: JSON.stringify([
      'FastAPI', 'Next.js', 'PostgreSQL RLS', 'Docker', 'Redis', 'Tailwind CSS'
    ]),
    measurable_outcomes: 'Prototyped multi-tenant isolation benchmarks with sub-100ms request overhead.',
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
    venue: 'RT4RJ: Regulatory Technology for Rights & Justice, Workshop at JURIX 2026 (Toulouse, France)',
    year: 2026,
    status: 'Accepted',
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
    image_url: '/assets/images/certificate-page-1.png',
    badge: 'National Gold Medalist',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'Gold Medal – 4th Federation Cup Taekwondo Competition',
    issuer: 'Bangladesh Taekwondo Federation',
    year: '2024',
    type: 'Martial Arts',
    description: 'Clinched Gold Medal at the prestigious 4th Federation Cup Taekwondo Championship, competing among elite martial artists nationwide.',
    image_url: '/assets/images/certificate-page-1.png',
    badge: 'National Champion',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'Taekwondo Black Belt (1st Dan)',
    issuer: 'World Taekwondo / Kukkiwon',
    year: '2023',
    type: 'Martial Arts',
    description: 'Officially certified Black Belt holder in Taekwondo martial arts, representing over a decade of disciplined physical conditioning and mental resilience.',
    image_url: '/assets/images/certificate-page-1.png',
    badge: 'Black Belt Holder',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'Bronze Medal – 22nd Victory Day Taekwondo Competition',
    issuer: 'National Sports Council of Bangladesh',
    year: '2023',
    type: 'Martial Arts',
    description: 'Secured Bronze Medal in senior division sparring at the 22nd Victory Day National Championship.',
    image_url: '/assets/images/certificate-page-1.png',
    badge: 'National Bronze',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: '2 Bronze Medals – 4th Bangladesh Wadokai Club Karate Competition',
    issuer: 'Bangladesh Wadokai Karate Club',
    year: '2023',
    type: 'Martial Arts',
    description: 'Awarded two Bronze medals in Kata and Kumite divisions at the 4th National Wadokai Karate Championship 2023.',
    image_url: '/assets/images/certificate-page-1.png',
    badge: 'Karate Medalist',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'IELTS Academic: Overall Band 6.5 / 9.0',
    issuer: 'British Council / IDP IELTS Australia',
    year: '2023',
    type: 'Academic',
    description: 'Certified English language proficiency: Listening 7.5, Speaking 7.0, Reading 5.5, Writing 5.5. Overall Band 6.5.',
    image_url: '/assets/images/certificate-page-2.png',
    badge: 'Overall 6.5 / 9.0',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'HackerRank: 5-Star SQL Proficiency Badge',
    issuer: 'HackerRank',
    year: '2023',
    type: 'Professional',
    description: 'Achieved the highest 5-Star proficiency rating on HackerRank for complex relational database queries, recursive CTEs, and window functions.',
    image_url: '/assets/images/certificate-page-3.png',
    badge: '5-Star SQL',
    pdf_url: ''
  },
  {
    title: 'Bachelor of Science in Computer Science & Engineering Degree & Transcript',
    issuer: 'University of Liberal Arts Bangladesh (ULAB)',
    year: '2021',
    type: 'Academic',
    description: 'Conferred BSc in CSE degree with CGPA 3.11 / 4.00, completing comprehensive coursework in Algorithms, Operating Systems, Database Management, and Artificial Intelligence.',
    image_url: '/assets/images/certificate-page-4.png',
    badge: 'BSc in CSE (ULAB)',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'Thesis Selection and Research Writing Certification',
    issuer: 'Abartan Research Institute',
    year: '2023',
    type: 'Academic',
    description: 'Completed rigorous professional training on academic thesis design, literature taxonomy, experimental methodology, and scientific manuscript submission.',
    image_url: '/assets/images/certificate-page-2.png',
    badge: 'Certified Researcher',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: 'Professional Skills Development: Skills for Career',
    issuer: 'Center for Enterprise & Society (CES)',
    year: '2022',
    type: 'Professional',
    description: 'Completed comprehensive executive career readiness program focusing on technical leadership, agile project delivery, and cross-functional team dynamics.',
    image_url: '/assets/images/certificate-page-3.png',
    badge: 'Career Leadership',
    pdf_url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf'
  },
  {
    title: '1st Place – Independence Day Essay Writing Competition',
    issuer: 'Lakshmipur Government College',
    year: '2016',
    type: 'Competition',
    description: 'Awarded First Place among college participants for outstanding analytical essay on national sovereignty and civic progress.',
    image_url: '/assets/images/certificate-page-3.png',
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
    thumbnail_url: '/assets/images/rxpert-fig2_litreview.png',
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
    thumbnail_url: '/assets/images/rxpert-fig3_qtpp.png',
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
    thumbnail_url: '/assets/images/doctorj-hero.png',
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
    thumbnail_url: '/assets/images/agrogpt-hero.png',
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
    url: '/assets/images/sumaiya-profile.png',
    mime_type: 'image/png',
    size_bytes: 460000,
    folder: 'profile',
    alt_text: 'Sumaiya Akter - Official Professional Profile Headshot'
  },
  {
    filename: 'sumaiya-portrait.jpg',
    original_name: 'original.jpg',
    url: '/assets/images/sumaiya-portrait.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 917000,
    folder: 'profile',
    alt_text: 'Sumaiya Akter - Studio Professional Portrait'
  },
  {
    filename: 'doctorj-hero.png',
    original_name: 'homepage-background.png',
    url: '/assets/images/doctorj-hero.png',
    mime_type: 'image/png',
    size_bytes: 2200000,
    folder: 'projects',
    alt_text: 'Doctor J (MedGPT) Clinical Healthcare Platform UI'
  },
  {
    filename: 'agrogpt-hero.png',
    original_name: 'home-page.png',
    url: '/assets/images/agrogpt-hero.png',
    mime_type: 'image/png',
    size_bytes: 1800000,
    folder: 'projects',
    alt_text: 'AgroGPT Agricultural Intelligence Platform Homepage'
  },
  {
    filename: 'snap-and-get.png',
    original_name: 'Snap & GET.png',
    url: '/assets/images/snap-and-get.png',
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
  },
  {
    filename: 'Academic_Transcripts_and_Certificates.pdf',
    original_name: 'sumaiya-akter- certificate-transcrift.pdf',
    url: '/assets/docs/Academic_Transcripts_and_Certificates.pdf',
    mime_type: 'application/pdf',
    size_bytes: 3200000,
    folder: 'documents',
    alt_text: 'Academic Degree & Scanned Certifications'
  }
];

for (const m of media) {
  insertMedia.run(m);
}
console.log(`Seeded ${media.length} media assets successfully.`);

console.log('--- Database Seeding Completed Successfully! ---');

