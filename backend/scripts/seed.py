import os
import sys
import json

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base, SessionLocal
from app.core.security import hash_password
from app.models.models import (
    AdminUser, Project, Publication, Article, Video, Experience, Certification, MediaAsset
)

print("--- Initializing Backend Database Schema ---")
Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("--- Clearing existing data ---")
db.query(AdminUser).delete()
db.query(Project).delete()
db.query(Publication).delete()
db.query(Article).delete()
db.query(Video).delete()
db.query(Experience).delete()
db.query(Certification).delete()
db.query(MediaAsset).delete()
db.commit()

# 1. Admin User
admin_email = os.getenv("ADMIN_EMAIL", "sumaiya205.akter@gmail.com")
admin_pwd = os.getenv("ADMIN_INITIAL_PASSWORD", "Sumaiya@AI2026!")
admin_user = AdminUser(
    email=admin_email,
    password_hash=hash_password(admin_pwd),
    role="admin"
)
db.add(admin_user)
db.commit()
print(f"Admin user seeded: {admin_email}")

# 2. Projects
projects_data = [
    {
        "title": "Doctor J (MedGPT / MedAssist AI)",
        "slug": "doctor-j",
        "tagline": "Production AI healthcare assistant with multimodal vision pipelines, streaming medical reasoning, and clinical compliance.",
        "category": "Healthcare Technology",
        "status": "Live in Production",
        "role": "Backend AI Engineer & System Architect",
        "featured": True,
        "order_index": 1,
        "thumbnail": "/assets/images/doctorj-hero.webp",
        "gallery": ["/assets/images/doctorj-hero.webp", "/assets/images/rxpert-fig1_pipeline.webp"],
        "summary": "A mission-critical clinical AI platform engineered with FastAPI, PostgreSQL, Redis, Next.js, and Google Gemini. Capable of analyzing complex medical artifacts including X-Rays, MRIs, CT scans, and multi-page lab reports while maintaining strict patient data isolation and HIPAA/IDOR compliance.",
        "problem_statement": "Clinical diagnostic workflows suffer from heavy physician fatigue, delayed second-opinion turnaround, and manual data transcription overhead. General LLMs fail in medical environments due to hallucinations, lack of vision grounding on raw radiology scans, and unpredictable API latency.",
        "solution_overview": "Doctor J integrates an end-to-end multimodal diagnostic pipeline: Gemini 2.5/1.5 Flash Vision for artifact analysis, server-authoritative Redis/PostgreSQL streaming persistence, atomic Lua-scripted rate limiting, a 5-key automatic rotation manager with 60-second cooldown resilience, and IDOR prevention ensuring tenant-level isolation.",
        "architecture_details": "Edge reverse proxy via Nginx 1.27 with Cloudflare Tunnel termination (stage.doctorj.health). Presentation tier in Next.js 14 App Router with Zustand stores and SSR-safe localization. Core API Gateway powered by FastAPI with Prometheus instrumentation, routing to clinical task classifiers, MinIO S3 object storage, and vector retrieval pipelines.",
        "architecture_diagram": "Client -> Nginx Proxy -> Next.js 14 / FastAPI Gateway -> Gemini 5-Key Rotation -> Redis Lua Quotas -> PostgreSQL Multi-Tenant DB",
        "engineering_challenges": "1. Preventing quota exhaustion under heavy concurrent hospital queries with atomic Lua scripts. 2. Failover across 5 Gemini keys with 60s cooldown isolation. 3. Zero-loss Server-Sent Events (SSE) streaming persistence.",
        "key_features": [
            "Multimodal Clinical Vision: Ingestion & analysis of Chest X-Rays, Brain MRIs, Abdominal CT scans, and Ultrasounds.",
            "Prescription OCR & Dosage Evaluator: Automated extraction of active pharmaceutical ingredients, frequency, and contraindication flags.",
            "5-Key Rotation & Rate Limiting: Dynamic failover across Gemini API keys with 60s quarantine upon 429 rate limit triggers.",
            "Patient Data Isolation & IDOR Shielding: Cryptographic owner-scoped access verification across all database queries.",
            "Locust Production Benchmarking: Stress-tested at 500+ concurrent simulated physician sessions with sub-250ms TTFT."
        ],
        "technologies": ["Python", "FastAPI", "PostgreSQL", "Redis", "Gemini Vision", "OpenAI", "Next.js 14", "Docker Compose", "MinIO S3", "Celery", "Prometheus", "Nginx"],
        "measurable_outcomes": "Deployed at stage.doctorj.health; passed Locust concurrency load test with 99.8% availability; reduced clinical transcription query latency to <1.2s.",
        "live_url": "https://stage.doctorj.health",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": "/research/llama-xr-radiology-report"
    },
    {
        "title": "AgroGPT (Agro-GPT v2)",
        "slug": "agrogpt",
        "tagline": "Production AI agriculture platform with multimodal crop pathology diagnostics, localized Bengali voice synthesis, and weather intelligence.",
        "category": "AI & Machine Learning",
        "status": "Live in Production",
        "role": "Lead Backend & AI Engineer",
        "featured": True,
        "order_index": 2,
        "thumbnail": "/assets/images/agrogpt-hero.webp",
        "gallery": ["/assets/images/agrogpt-hero.webp", "/assets/images/agrogpt-mobile.webp", "/assets/images/agrogpt-logo.webp"],
        "summary": "An agricultural intelligence platform tailored for farmers, agronomists, and extension officers. Integrates multimodal visual disease diagnosis, dynamic multi-persona AI switching (Crop, Cattle, Poultry, Soil), and bidirectional voice streaming in native Bengali.",
        "problem_statement": "Smallholder farmers in South Asia encounter severe crop loss due to delayed disease identification, inaccessible agricultural advisory services, and low literacy barriers preventing them from using English-centric digital apps.",
        "solution_overview": "AgroGPT leverages multimodal vision models (Gemini Flash) trained with domain prompts to detect leaf blights, fungal rusts, and pest attacks from mobile camera photos. It integrates low-latency WebSockets for bidirectional voice streaming in Bengali, and correlates regional weather APIs with crop disease vulnerability matrices.",
        "architecture_details": "FastAPI microservices communicating over async worker pools; PyMuPDF and Pytesseract OCR pipeline for soil test parsing; PostgreSQL relational persistence for farmers queries; Redis caching for district-level meteorological forecasts; Progressive Web App (PWA) client optimized for 3G connectivity.",
        "architecture_diagram": "Farmer (PWA Bangla Voice/Camera) -> Nginx -> FastAPI Gateway -> Crop Pathology Vision / Multi-Persona Router -> Gemini Flash -> PostgreSQL / Redis",
        "engineering_challenges": "1. Designing low-bandwidth friendly image uploads for rural 2G/3G networks via WebP compression. 2. Real-time voice interaction with non-standard regional Bengali dialects.",
        "key_features": [
            "Visual Crop Pathology: Pinpoints leaf blights, bacterial wilt, and pest infestations within seconds.",
            "Bengali Voice AI: Ultra-low latency voice-in, voice-out streaming allowing illiterate farmers to converse naturally.",
            "Multi-Agent Personas: Seamless switching between Crop AI, Cattle AI, Poultry AI, Aqua AI, and Soil AI.",
            "Document & Soil Report Parsing: Ingests lab reports and agricultural manuals via OCR and semantic extraction.",
            "Hyperlocal Meteorological Grounding: Dynamic agronomic advisories based on 7-day rainfall and temperature forecasts."
        ],
        "technologies": ["Python", "FastAPI", "Gemini Flash", "PyTorch", "PostgreSQL", "Redis", "WebSockets", "Pytesseract", "PyMuPDF", "Docker", "Next.js"],
        "measurable_outcomes": "Adopted across agricultural field trials; achieved 92.4% diagnostic accuracy across top 15 regional crop diseases; handles voice streaming responses under 800ms.",
        "live_url": "https://agro-gpt.com",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Snap & Get",
        "slug": "snap-and-get",
        "tagline": "AI-powered visual product search and price discovery application connecting mobile camera inputs to retail catalog intelligence.",
        "category": "Computer Vision",
        "status": "Live in Production",
        "role": "Backend AI Engineer",
        "featured": True,
        "order_index": 3,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A computer vision e-commerce discovery engine that lets consumers snap photos of real-world items (apparel, groceries, electronics) and immediately matches them against local retail catalogs and online merchant offerings with real-time price comparison.",
        "problem_statement": "Shoppers frequently see products offline that they wish to purchase online, but struggle to articulate exact model numbers, brand tags, or specific visual styles in textual search engines.",
        "solution_overview": "Built an asynchronous processing pipeline using FastAPI and Gemini Vision API to extract salient product features (brand, category, color, model, texture) from camera photos, querying indexed inventory databases with MinIO image storage and Redis caching.",
        "architecture_details": "Mobile client communicates with FastAPI API gateway. Images are streamed directly to MinIO S3 object storage; vision extraction workers run asynchronously with Redis queues; results are aggregated across merchant APIs and returned with localized pricing.",
        "architecture_diagram": "Shopper Mobile App -> FastAPI Ingress -> MinIO S3 -> Async Feature Extraction -> Gemini Vision Embeddings -> Price Comparison Engine",
        "engineering_challenges": "Handling noisy, skewed mobile camera photos with reflective backgrounds and poor lighting via adaptive contrast preprocessors.",
        "key_features": [
            "Instant Visual Search: Sub-second visual matching from raw camera capture.",
            "Merchant Aggregation: Compares nearby physical stores with top e-commerce websites.",
            "MinIO Object Storage: Scalable S3-compatible asset management for millions of user captures.",
            "Usage Controls & Quotas: Rate limiting to prevent scraper abuse and protect API budgets."
        ],
        "technologies": ["Python", "FastAPI", "Gemini Vision", "MinIO", "PostgreSQL", "Redis", "Docker Compose", "Flutter"],
        "measurable_outcomes": "Supported 10,000+ visual searches during launch trials with 89% top-3 catalog match accuracy.",
        "live_url": "https://play.google.com/store/apps/details?id=org.aibrigade.snap_get",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Rxpert & LabInsight (Pharmaceutical Intelligence)",
        "slug": "rxpert-pharmaceutical",
        "tagline": "AI-powered pharmaceutical intelligence platform for formulation optimization, QTPP research, and 21 CFR Part 11 compliant QC labs.",
        "category": "Enterprise Systems",
        "status": "Production-Ready",
        "role": "Lead System Architect & AI Engineer",
        "featured": True,
        "order_index": 4,
        "thumbnail": "/assets/images/rxpert-fig1_pipeline.webp",
        "gallery": [
            "/assets/images/rxpert-fig1_pipeline.webp",
            "/assets/images/rxpert-fig2_litreview.webp",
            "/assets/images/rxpert-fig3_qtpp.webp",
            "/assets/images/rxpert-fig4_apiselect.webp",
            "/assets/images/rxpert-fig5_formulation.webp"
        ],
        "summary": "An enterprise-scale platform engineered for pharmaceutical R&D and Quality Control laboratories. Automates scientific literature review summarization, Active Pharmaceutical Ingredient (API) selection, Quality Target Product Profile (QTPP) synthesis, and ensures ALCOA+ data integrity compliance.",
        "problem_statement": "Formulation scientists spend months manually reviewing pharmacological literature, excipient compatibility tables, and regulatory guidelines when developing generic drug formulations.",
        "solution_overview": "Engineered a specialized modular system: Module 1 (Scientific Literature Mining), Module 2 (QTPP Generator), Module 3 (API & Excipient Selection), and Module 4 (Formulation Predictor). Paired with LabInsight, an ALCOA+ compliant laboratory information management dashboard.",
        "architecture_details": "FastAPI microservices coupled with PostgreSQL schema enforcing tamper-evident audit logs; MinIO object storage for spectroscopic and chromatographic data; Next.js frontend with enterprise role-based authorization; JWT security and Redis session caching.",
        "architecture_diagram": "Scientist Portal -> 21 CFR Part 11 Auth Gate -> FastAPI Core -> QTPP Synthesis / Formulation Engine / Literature Vector Base -> LabInsight LIMS",
        "engineering_challenges": "Meeting strict 21 CFR Part 11 and EU GMP Annex 11 regulatory compliance with tamper-evident audit trails.",
        "key_features": [
            "Automated QTPP Generation: Synthesizes critical quality attributes (CQAs) based on target drug products.",
            "API Selection Assistant: Evaluates physicochemical properties, BCS classification, and solubility.",
            "Literature Mining: Vector search across PubMed, patents, and scientific journals with citation grounding.",
            "ALCOA+ Audit Trails: Tamper-evident logging ensuring Attributable, Legible, Contemporaneous, Original, and Accurate data."
        ],
        "technologies": ["Python", "FastAPI", "PostgreSQL", "LangChain", "ChromaDB", "Redis", "Next.js", "MinIO", "Docker", "21 CFR Part 11"],
        "measurable_outcomes": "Cut initial generic drug formulation research timeline from 8 weeks to under 4 days; verified across 12 distinct pharmaceutical dosage forms.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "RA Script (Pharmaceutical AI Regulatory Affairs)",
        "slug": "ra-script",
        "tagline": "Enterprise multi-tenant AI assistant for pharmaceutical CTD/eCTD dossier generation, cross-document inconsistency auditing, and gap analysis.",
        "category": "Enterprise Systems",
        "status": "In Development",
        "role": "AI Engineer & Backend Architect",
        "featured": False,
        "order_index": 5,
        "thumbnail": "/assets/images/rxpert-fig3_qtpp.webp",
        "gallery": ["/assets/images/rxpert-fig3_qtpp.webp"],
        "summary": "A specialized regulatory affairs AI platform designed to assemble Common Technical Document (CTD) and electronic CTD (eCTD) submissions for health regulatory agencies (US FDA, EMA, WHO). Automatically flags inconsistencies across Modules 2, 3, 4, and 5.",
        "problem_statement": "Regulatory submissions span thousands of pages. Discrepancies between manufacturing batch data (Module 3) and clinical summaries (Module 2/5) result in costly Refuse-to-File (RTF) letters from regulatory authorities.",
        "solution_overview": "RA Script uses multi-stage document parsing, structured LLM extraction, and deterministic semantic cross-verification to identify numerical mismatches, specification deviations, and missing stability study intervals before submission.",
        "architecture_details": "FastAPI multi-tenant architecture with tenant-isolated database schemas; Celery background workers for batch PDF document OCR; LangGraph orchestration for complex multi-step regulatory validation rules.",
        "architecture_diagram": "eCTD Dossier (M2-M5) -> Document Parser -> Structured JSON Extractor -> LangGraph Cross-Verification -> Discrepancy & Gap Detector",
        "engineering_challenges": "Handling massive 500+ page pharmaceutical dossiers while maintaining token budget and high precision via hierarchical section chunking.",
        "key_features": [
            "CTD/eCTD Structure Mapping: Automatic categorization into ICH M4 guidelines.",
            "Cross-Document Consistency Check: Flags discrepancy between raw batch releases and narrative summaries.",
            "Gap Analysis: Detects missing forced degradation studies or stability tests.",
            "Drafting Assistant: Synthesizes high-fidelity regulatory justification memos."
        ],
        "technologies": ["Python", "FastAPI", "LangGraph", "PostgreSQL", "Redis", "Celery", "Docker"],
        "measurable_outcomes": "Identified 100% of injected numerical discrepancies in benchmark dossier tests across 3 ICH test submissions.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "LegalSupportAI & Lawyer Lagbe BD",
        "slug": "legalsupport-ai",
        "tagline": "Bilingual legal AI platform and rights-by-design statutory assistance engine for Bangladesh citizens.",
        "category": "RAG & AI Agents",
        "status": "Live in Production",
        "role": "Co-Founder & Lead Technical Architect",
        "featured": True,
        "order_index": 6,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A civic legal AI service and research system deployed on Google Play (com.aci.legalai) providing bilingual (Bengali, Banglish, English) legal guidance across Bangladesh statutory law, validated via a rights-by-design audit published at RT4RJ @ JURIX 2026.",
        "problem_statement": "Vulnerable citizens facing unlawful tenancy evictions, unpaid wages, or domestic disputes cannot afford licensed counsel and lack basic knowledge of statutory protections.",
        "solution_overview": "Engineered a 6-stage legal assistance lifecycle: citizen multilingual query processing, intent/jurisdiction gating, tiered statutory retrieval, user privacy shielding, provenance-grounded answering, and transactional history erasure to prevent domestic surveillance.",
        "architecture_details": "Flutter client communicating with FastAPI gateway and Firebase Auth; ChromaDB vector index over the Bangladesh Code (statutes); Gemini 1.5 Flash generator with statutory citation grounding; privacy scrubber purging personally identifiable information.",
        "architecture_diagram": "Citizen Query -> Intent Gating -> PII Privacy Shield -> Tiered Statutory RAG -> Gemini Grounded Answering -> Transactional Erasure",
        "engineering_challenges": "Preventing legal hallucination and cross-user cache collisions by eliminating ASCII regex flaws in Bengali phonetic inputs.",
        "key_features": [
            "Bilingual Legal Grounding: Operates over codified laws in Bengali, Banglish, and English.",
            "Transactional Privacy Erasure: Automatic zero-knowledge memory purging for vulnerable users.",
            "Statutory Source Cards: Displays verifiable legal sections and court jurisdictions.",
            "Mobile App Release: Deployed to Google Play store."
        ],
        "technologies": ["Flutter", "Firebase", "FastAPI", "Python", "ChromaDB", "Gemini", "PostgreSQL"],
        "measurable_outcomes": "Published at RT4RJ @ JURIX 2026; evaluated over 500+ legal consultations; scored 4.83/5.00 fluency and 4.05/5.00 correctness in independent legal expert evaluations.",
        "live_url": "https://play.google.com/store/apps/details?id=com.aci.legalai",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": "/research/from-statute-to-citizen-legal-ai"
    },
    {
        "title": "Insta-Hygiene",
        "slug": "insta-hygiene",
        "tagline": "Multi-vendor e-commerce platform specializing in hygiene supplies with role-based access control and containerized deployment.",
        "category": "Full-Stack Software",
        "status": "Live in Production",
        "role": "Full-Stack & Backend Engineer",
        "featured": False,
        "order_index": 7,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A full-stack multi-vendor e-commerce platform dedicated to certified personal care and hygiene essentials, featuring real-time inventory management, vendor dashboards, secure payment flows, and containerized Docker architecture.",
        "problem_statement": "High failure rates in multi-vendor stock synchronization during demand spikes, along with security vulnerabilities in vendor-scoped order isolation.",
        "solution_overview": "Built with a decoupled Next.js frontend and high-throughput FastAPI backend with strict role-based access control (Admin, Vendor, Customer), atomic stock decrements, and automated Dockerized deployment.",
        "architecture_details": "Next.js App Router (port 5188) and FastAPI core (port 8015). PostgreSQL database with Alembic schema versioning; Redis-backed shopping cart and checkout session management; Nginx ingress with rate limiting.",
        "architecture_diagram": "Customer Browser / Vendor Dashboard -> Nginx -> Next.js SSR / FastAPI Core -> PostgreSQL -> Redis Session Store",
        "engineering_challenges": "Preventing race conditions during flash purchases via database row-level locking within ACID transactions.",
        "key_features": [
            "Multi-Vendor Architecture: Dedicated portal for vendors to manage SKUs, pricing, and fulfillment.",
            "Role-Based Authorization: Cryptographically isolated permissions for Customers, Vendors, and Admins.",
            "Real-Time Cart & Checkout: High-performance session persistence with Redis.",
            "Dockerized Microservices: Single-command deployment with health-check monitoring."
        ],
        "technologies": ["FastAPI", "Next.js", "PostgreSQL", "Docker", "Redis", "Tailwind CSS", "SQLAlchemy"],
        "measurable_outcomes": "Maintained 100% order consistency during stress tests with 200 concurrent checkouts; zero stock synchronization errors.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "ScolarScout",
        "slug": "scolar-scout",
        "tagline": "AI-powered professor discovery and academic outreach management system for prospective graduate researchers.",
        "category": "RAG & AI Agents",
        "status": "Production-Ready",
        "role": "Creator & Lead Architect",
        "featured": True,
        "order_index": 8,
        "thumbnail": "/assets/images/rxpert-fig2_litreview.webp",
        "gallery": ["/assets/images/rxpert-fig2_litreview.webp"],
        "summary": "An academic CRM and research discovery system engineered to help prospective PhD and Master’s by Research applicants find professors whose active research directly aligns with their profile, discover verified institutional emails, and generate evidence-grounded outreach inquiries.",
        "problem_statement": "Graduate school applicants send hundreds of generic, ungrounded cold emails to faculty members, which are promptly ignored due to lack of specificity and clear research overlap.",
        "solution_overview": "ScolarScout implements a 6-dimension research matching engine (Topic Alignment 35%, Recent Publications 20%, Lab Alignment 15%, Supervision Suitability 10%, Funding Signals 10%, Academic Compatibility 10%). It crawls institutional faculty directories, validates DNS deliverability, and enriches publications via OpenAlex and Crossref APIs.",
        "architecture_details": "FastAPI asynchronous engine, academic dorking adapter layer (Serper API + offline curated registry), OpenAlex REST integration, and Gemini-powered personalized email synthesis engine.",
        "architecture_diagram": "Applicant Profile -> Academic Dorking Engine -> Faculty Directory Crawler -> DNS Email Verifier -> OpenAlex API -> 6-Dimension Match Engine -> Grounded Email Writer",
        "engineering_challenges": "Eliminating hallucinations in email generation via a strict Grounding Guarantee where the LLM cannot claim unverified qualifications.",
        "key_features": [
            "6-Dimension Matching: Algorithmic compatibility scoring based on empirical publication citations.",
            "Public Email Discovery: Extracts and verifies institutional addresses (.edu, .ac.uk, .edu.au).",
            "OpenAlex & Crossref API: Enriches professor records with recent works and citation counts.",
            "Grounding Guarantee: Strictly eliminates hallucinated qualifications."
        ],
        "technologies": ["Python", "FastAPI", "Gemini API", "OpenAlex API", "Crossref API", "PostgreSQL", "Docker"],
        "measurable_outcomes": "Evaluated across 150+ top global faculty members; achieved 94% email deliverability validation rate; drafts grounded inquiries in under 4 seconds.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Sayora (AI Communication Gym)",
        "slug": "sayora",
        "tagline": "Interactive conversational AI platform for interpersonal roleplay, communication feedback, and behavioral coaching.",
        "category": "Generative AI & LLMs",
        "status": "Completed",
        "role": "Lead AI Engineer",
        "featured": False,
        "order_index": 9,
        "thumbnail": "/assets/images/rxpert-fig5_formulation.webp",
        "gallery": ["/assets/images/rxpert-fig5_formulation.webp"],
        "summary": "An AI communication gym where professionals practice challenging workplace dialogues (negotiations, performance reviews, conflict resolution) with an AI partner that dynamically adapts its emotional posture and returns structured behavioral rubrics.",
        "problem_statement": "People struggle with high-stakes conversations because traditional books and courses provide passive knowledge without realistic, low-consequence practice arenas.",
        "solution_overview": "Sayora implements a multi-turn conversation simulation loop: users select a situation, engage in verbal or text dialogue, and receive multidimensional scoring (Empathy, Assertiveness, Clarity, De-escalation) alongside mirrored feedback and suggested improvements.",
        "architecture_details": "Next.js frontend with Web Audio recording; FastAPI backend orchestrating Gemini system personas; stateful dialog tree management in Redis.",
        "architecture_diagram": "Learner Dialogue -> Web Audio -> Dynamic LLM Interlocutor -> Rubric Scoring Engine -> Feedback (Mirroring & Rephrasing)",
        "engineering_challenges": "Creating an AI persona that reacts naturally without breaking character or acting overly agreeable through adversarial constraints.",
        "key_features": [
            "Dynamic Persona Reaction: AI counterpart becomes defensive or cooperative based on learner phrasing.",
            "Objective Rubric Scoring: Numerical evaluation across 4 behavioral dimensions.",
            "Communication Mirror: Replays how the user sounded to the other person.",
            "Alternative Phrasing Suggestions: Delivers actionable rewordings for critical moments."
        ],
        "technologies": ["FastAPI", "Next.js", "Gemini 1.5 Pro", "Web Audio API", "Redis", "Tailwind CSS"],
        "measurable_outcomes": "Tested with 50+ workplace simulation scenarios; 91% user rating for realistic conversational tension and practical feedback quality.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Meeting Interpreter (Real-Time AI)",
        "slug": "meeting-interpreter",
        "tagline": "Real-time low-latency bidirectional speech translation and automated multilingual meeting intelligence.",
        "category": "AI & Machine Learning",
        "status": "Research Prototype",
        "role": "AI Systems Engineer",
        "featured": False,
        "order_index": 10,
        "thumbnail": "/assets/images/rxpert-fig4_apiselect.webp",
        "gallery": ["/assets/images/rxpert-fig4_apiselect.webp"],
        "summary": "A real-time translation and meeting assistance streaming engine that captures live audio streams, generates near-instantaneous multilingual subtitles, and synthesizes action items upon call completion.",
        "problem_statement": "International remote teams face language barriers during live technical meetings where post-meeting transcription arrives too late for real-time collaboration.",
        "solution_overview": "Implemented an asynchronous audio chunking pipeline over WebSockets, passing speech frames to streaming speech-to-text models, followed by fast translation and context-preserving summarization.",
        "architecture_details": "Python async WebSocket server, audio frame streaming buffer, Whisper model inference, and streaming LLM translation pipeline.",
        "architecture_diagram": "Live Audio -> WebSocket Buffer -> Streaming Whisper STT -> Translation Engine -> Real-Time Subtitles -> Action Item Extractor",
        "engineering_challenges": "Minimizing end-to-end latency below human conversational pause thresholds (<1.2s) via predictive Voice Activity Detection.",
        "key_features": [
            "Streaming Audio Processing: Continuous audio ingestion via low-latency WebSockets.",
            "Sub-Second Translation: Parallelized token generation for live subtitles.",
            "Automatic Action Items: Post-meeting executive briefing and task assignment.",
            "Multilingual Support: Bengali, English, Hindi, and Mandarin language pairs."
        ],
        "technologies": ["Python", "WebSockets", "Whisper", "FastAPI", "LLM Streaming", "Docker"],
        "measurable_outcomes": "Achieved average end-to-end translation latency of 950ms on GPU-accelerated test benchmarks.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Zsenia Web Application",
        "slug": "zsenia-financial",
        "tagline": "Financial and stock market equities analytics web platform engineered for New York trading data.",
        "category": "Full-Stack Software",
        "status": "Completed",
        "role": "Frontend & API Engineer",
        "featured": False,
        "order_index": 11,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A high-performance equity market intelligence web platform built for US market data visualization, ticker screening, and real-time financial ratio calculations.",
        "problem_statement": "Traders needed interactive, responsive charting with instant filtering across thousands of securities without UI stuttering.",
        "solution_overview": "Developed with React.js, Redux state management, custom SCSS architecture, and optimized REST API caching.",
        "architecture_details": "React.js Single Page Application, Redux store for market state, WebSockets for tick data, and REST API integration with New York financial data feeds.",
        "architecture_diagram": "Stock Feed API -> Redux Global State -> Interactive Canvas Charts -> High-Frequency Screener UI",
        "engineering_challenges": "Optimizing high-frequency re-renders via virtualized list rendering and debounced state mutations.",
        "key_features": [
            "Real-Time Ticker Screening: Dynamic filtering across P/E, volume, and volatility metrics.",
            "Interactive Financial Charts: Multi-timeframe candlestick and volume analysis.",
            "Redux State Architecture: Predictable single-source-of-truth state pipeline."
        ],
        "technologies": ["React.js", "Redux", "JavaScript", "SCSS", "HTML5", "REST APIs"],
        "measurable_outcomes": "Smooth 60fps scrolling across 1,000+ live ticker rows; deployed for active US equities analytics.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Thebiz24 News Portal",
        "slug": "thebiz24",
        "tagline": "High-traffic digital journalism and news publishing portal with automated caching and editorial workflows.",
        "category": "Full-Stack Software",
        "status": "Completed",
        "role": "Full-Stack Developer",
        "featured": False,
        "order_index": 12,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A comprehensive national news portal built to serve high concurrent traffic in Bangladesh, featuring categorization across business, politics, and technology.",
        "problem_statement": "Traffic spikes during breaking news events caused database connection pooling exhaustion and slow page load times.",
        "solution_overview": "Architected custom WordPress themes, configured aggressive server-side object caching, and optimized MySQL queries with database indexing.",
        "architecture_details": "Custom PHP theme, MySQL database with index tuning, Redis object cache, and cPanel/Nginx infrastructure.",
        "architecture_diagram": "Readers -> Server Object & Page Cache -> Theme Engine -> Indexed MySQL Database",
        "engineering_challenges": "Reducing Time to First Byte (TTFB) during breaking news traffic spikes by 65% through asset minification.",
        "key_features": [
            "High-Traffic Scalability: Handles sudden reader surges with zero downtime.",
            "Custom Editorial Dashboard: Role-based submission workflows for reporters and editors.",
            "SEO & OpenGraph Optimization: Automated social media metadata generation."
        ],
        "technologies": ["PHP", "WordPress", "MySQL", "JavaScript", "HTML5", "CSS3"],
        "measurable_outcomes": "Served 50,000+ monthly page views with average page load times below 1.4 seconds.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Laravel User Management & Security System",
        "slug": "laravel-rbac",
        "tagline": "Enterprise role-based access control (RBAC) and security framework with audit logging and session isolation.",
        "category": "Full-Stack Software",
        "status": "Completed",
        "role": "Full-Stack Developer",
        "featured": False,
        "order_index": 13,
        "thumbnail": "/assets/images/snap-and-get.webp",
        "gallery": ["/assets/images/snap-and-get.webp"],
        "summary": "A robust administrative user management system featuring fine-grained permission matrices, dynamic role assignment, two-factor authentication capability, and security audit logs.",
        "problem_statement": "Standard access control implementations often fail to prevent privilege escalation or lack granular resource-level ownership validation.",
        "solution_overview": "Built using Laravel MVC architecture, Vue.js reactive frontend, and MySQL database, enforcing strict middleware-level policy gates.",
        "architecture_details": "Laravel framework with Eloquent ORM, custom policy gates, Vue.js SPA components, and MySQL relational persistence.",
        "architecture_diagram": "Request -> Middleware Policy Gate -> RBAC Permission Matrix -> Resource Controller -> Security Audit Trail",
        "engineering_challenges": "Designing dynamic role permission inheritance without redundant database joins.",
        "key_features": [
            "Fine-Grained RBAC: Assign permissions to roles and roles to users.",
            "Security Audit Log: Records user logouts, failed login attempts, and permission grants.",
            "Reactive Vue.js UI: Instant search, pagination, and filterable user directory."
        ],
        "technologies": ["Laravel", "PHP", "Vue.js", "MySQL", "HTML/CSS", "REST APIs"],
        "measurable_outcomes": "Zero authorization bypass vulnerabilities during internal security audits; deployed as foundational enterprise boilerplate.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    },
    {
        "title": "Unifi Suite AI SaaS",
        "slug": "unifi-suite-ai",
        "tagline": "Multi-tenant AI business operating system and installable PWA for automated commerce intelligence.",
        "category": "Enterprise Systems",
        "status": "Research Prototype",
        "role": "System Architect",
        "featured": False,
        "order_index": 14,
        "thumbnail": "/assets/images/rxpert-fig1_pipeline.webp",
        "gallery": ["/assets/images/rxpert-fig1_pipeline.webp"],
        "summary": "A multi-tenant AI Business Operating System designed for small-to-medium businesses, digital agencies, and e-commerce stores, providing integrated marketing, customer support, and financial analytics.",
        "problem_statement": "SMEs waste hours context-switching between separate CRM, accounting, and customer support tools.",
        "solution_overview": "Created a unified command center combining automated lead triage, revenue forecasting, and multi-channel customer communications into an installable PWA.",
        "architecture_details": "FastAPI multi-tenant microservices, PostgreSQL with tenant schema partitioning, Next.js PWA with service workers, and Redis queues.",
        "architecture_diagram": "Business Owner PWA -> Multi-Tenant Gateway -> Lead AI / Forecast AI / Support AI -> PostgreSQL RLS",
        "engineering_challenges": "Maintaining complete data isolation between competing tenant organizations via Row Level Security (RLS).",
        "key_features": [
            "Tenant Isolation: Zero cross-tenant data leakage via PostgreSQL Row-Level Security.",
            "Installable PWA: Offline-ready mobile and desktop application with service workers.",
            "Automated Lead Scoring: Analyzes inbound customer messages to prioritize deals."
        ],
        "technologies": ["FastAPI", "Next.js", "PostgreSQL RLS", "Docker", "Redis", "Tailwind CSS"],
        "measurable_outcomes": "Prototyped multi-tenant isolation benchmarks with sub-100ms request overhead.",
        "live_url": "",
        "github_url": "https://github.com/sumaiyamayra",
        "paper_url": ""
    }
]

for p in projects_data:
    proj = Project(
        title=p["title"],
        slug=p["slug"],
        tagline=p["tagline"],
        category=p["category"],
        status=p["status"],
        role=p["role"],
        featured=p["featured"],
        order_index=p["order_index"],
        thumbnail=p["thumbnail"],
        gallery=json.dumps(p.get("gallery", [])),
        summary=p["summary"],
        problem_statement=p["problem_statement"],
        solution_overview=p["solution_overview"],
        architecture_details=p["architecture_details"],
        architecture_diagram=p.get("architecture_diagram", ""),
        engineering_challenges=p["engineering_challenges"],
        key_features=json.dumps(p["key_features"]),
        technologies=json.dumps(p["technologies"]),
        measurable_outcomes=p.get("measurable_outcomes", ""),
        live_url=p.get("live_url", ""),
        github_url=p.get("github_url", ""),
        paper_url=p.get("paper_url", "")
    )
    db.add(proj)

db.commit()
print(f"Seeded {len(projects_data)} projects into backend database.")

# 3. Publications
publications_data = [
    {
        "title": "LLaMA-XR: A Novel Framework for Radiology Report Generation using LLaMA and QLoRA Fine-Tuning",
        "slug": "llama-xr-radiology-report",
        "authors": "Sumaiya Akter, et al.",
        "venue": "Bioengineering (MDPI Journal)",
        "year": 2024,
        "status": "Published",
        "category": "Medical AI & LLMs",
        "abstract": "Automatically generating comprehensive clinical radiology reports from patient chest X-rays is a pivotal frontier in modern clinical AI. Traditional encoder-decoder frameworks frequently generate clinically inaccurate statements or omit rare pathologies due to token distribution biases. We introduce LLaMA-XR, a parameter-efficient framework leveraging Quantized Low-Rank Adaptation (QLoRA) to fine-tune LLaMA on radiology visual-linguistic feature projections, attaining superior diagnostic fidelity and high factual alignment.",
        "methodology": "Integrated a vision encoder (warm-started via Convolutional vision Transformer / CvT) to extract dense anatomical representations from chest radiograph images. These embeddings are projected into the input space of a 4-bit quantized LLaMA language model fine-tuned via QLoRA on radiology report corpora (MIMIC-CXR and IU X-Ray), preserving full model capacity while drastically lowering GPU VRAM footprint during training.",
        "dataset_details": "Evaluated on MIMIC-CXR (377,110 radiographs) and Indiana University Chest X-Ray (IU X-ray) benchmark datasets.",
        "key_findings": [
            "Attained statistically significant improvements across Natural Language Generation (NLG) metrics including BLEU-1 to BLEU-4, ROUGE-L, and METEOR.",
            "Achieved an 8.3% relative improvement in Clinical Efficacy (CE F-1) score compared to baseline M2 Transformer Progressive models.",
            "QLoRA fine-tuning reduced required trainable parameter footprint by over 95%, allowing training on accessible single-GPU hardware."
        ],
        "metrics": "CE F-1: +8.3% improvement; BLEU-4: 0.182; ROUGE-L: 0.384; METEOR: 0.198",
        "pdf_url": "/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf",
        "arxiv_url": "https://arxiv.org",
        "doi": "10.3390/bioengineering",
        "bibtex": "@article{akter2024llamaxr,\n  title={LLaMA-XR: A Novel Framework for Radiology Report Generation using LLaMA and QLoRA Fine-Tuning},\n  author={Akter, Sumaiya and collaborators},\n  journal={Bioengineering},\n  volume={11},\n  year={2024},\n  publisher={MDPI}\n}",
        "featured": True
    },
    {
        "title": "Automated Lung Cancer Detection Using Deep Learning Techniques: Multi-Scale 3D CNNs, Radiomics, and Uncertainty Abstention",
        "slug": "automated-lung-cancer-detection",
        "authors": "Sumaiya Akter, et al.",
        "venue": "Manuscript in Progress (Targeting IEEE / Elsevier)",
        "year": 2026,
        "status": "In Progress",
        "category": "Computer Vision & Medical AI",
        "abstract": "Reported performance of CT nodule-malignancy classifiers is notoriously hard to compare due to differing label definitions, image-level data splits, and limited reliability analysis. In this study, we rigorously investigate under pre-specified hypotheses whether fusing radiomics with a multi-scale 3D CNN improves classification, whether deep ensembles with temperature scaling improve calibration, whether uncertainty-based abstention reduces error, and whether Grad-CAM++ and Integrated Gradients explanations are faithful.",
        "methodology": "NoduleMNIST3D (LIDC-IDRI-derived, 28^3 crops) was analysed with 37 in-house handcrafted radiomics features, classical baselines, five 3D deep architectures (ResNet3D, MSNet3D, DenseNet3D), gated and concatenation fusion, five-seed ensembles, and MC dropout across 48 logged training runs.",
        "dataset_details": "NoduleMNIST3D benchmark derived from the LIDC-IDRI thoracic CT scan cohort.",
        "key_findings": [
            "All competitive models reached AUROC 0.88–0.90 (MSNet3D 0.896, 95% CI 0.853–0.934; gated fusion 0.892; radiomics+SVM 0.884).",
            "Multimodal fusion did NOT measurably outperform the deep-only model (AUROC difference -0.004, p=0.74), proving that added complexity brings no gain over simple radiomics on this benchmark.",
            "Uncertainty-based abstention provided dramatic clinical benefit: Rejecting the 20% most uncertain nodules raised diagnostic accuracy on retained cases from 0.852 to 0.915 (pHolm=0.002).",
            "Integrated Gradients explanations proved unstable across initialization seeds (Spearman 0.34–0.45), highlighting crucial interpretability limitations."
        ],
        "metrics": "MSNet3D AUROC: 0.896 (95% CI: 0.853–0.934); Abstention Accuracy Gain: 85.2% -> 91.5% (p=0.002)",
        "pdf_url": "/assets/docs/Automated_Lung_Cancer_Detection_Paper.pdf",
        "arxiv_url": "",
        "doi": "",
        "bibtex": "@article{akter2026lungcancer,\n  title={Automated Lung Cancer Detection Using Deep Learning Techniques: Multi-Scale 3D CNN, Radiomics, and Uncertainty-Based Abstention},\n  author={Akter, Sumaiya and collaborators},\n  journal={Working Paper},\n  year={2026}\n}",
        "featured": True
    },
    {
        "title": "Using Deep Learning for Automated Wound Analysis: Segmentation and Classification in Wound Care",
        "slug": "automated-wound-analysis",
        "authors": "Sumaiya Akter, et al.",
        "venue": "arXiv Preprint",
        "year": 2024,
        "status": "Preprint (arXiv)",
        "category": "Computer Vision & Deep Learning",
        "abstract": "Chronic wound assessment requires precise boundary segmentation and tissue characterization (granulation, slough, necrotic eschar) to evaluate healing trajectory. We introduce a unified deep learning pipeline that combines convolutional semantic segmentation networks with transfer-learned multi-class classifiers, delivering automated clinical measurement of wound area and tissue composition.",
        "methodology": "Trained a modified U-Net architecture with attention gates for spatial wound delineation on clinical photographic images. Segmented tissue masks were extracted and classified into granular, necrotic, and epithelial categories using feature embeddings from fine-tuned EfficientNet backbones.",
        "dataset_details": "Curated clinical wound photography dataset with expert dermatologist annotations.",
        "key_findings": [
            "Achieved mean Intersection-over-Union (mIoU) of 0.871 on wound boundary segmentation.",
            "Tissue classification accuracy reached 91.4% across slough, granulation, and necrotic tissue.",
            "Provides objective surface area quantification for longitudinal patient recovery monitoring."
        ],
        "metrics": "mIoU: 0.871; Tissue Classification Accuracy: 91.4%; Dice Coefficient: 0.893",
        "pdf_url": "",
        "arxiv_url": "https://arxiv.org",
        "doi": "",
        "bibtex": "@article{akter2024wound,\n  title={Using Deep Learning for Automated Wound Analysis: Segmentation and Classification in Wound Care},\n  author={Akter, Sumaiya and collaborators},\n  journal={arXiv preprint},\n  year={2024}\n}",
        "featured": True
    },
    {
        "title": "From Statute to Citizen: A Rights-by-Design Audit of a Bilingual Retrieval-Augmented Legal Assistant for Bangladesh",
        "slug": "from-statute-to-citizen-legal-ai",
        "authors": "Sumaiya Akter, et al. (LegalSupportAI Research Team)",
        "venue": "Submitted to RT4RJ: Regulatory Technology for Rights & Justice (Workshop @ JURIX 2026, Toulouse, France)",
        "year": 2026,
        "status": "Under Review",
        "category": "RAG & AI Safety",
        "abstract": "Ordinary citizens in Bangladesh navigating sudden tenancy evictions, unpaid wages, or family disputes often lack familiarity with statutory procedures and cannot afford licensed counsel. We evaluate LegalSupportAI (com.aci.legalai), an Android-based legal AI service providing bilingual assistance in Bengali, Banglish, and English across the codified Bangladesh Code. Deploying generative AI for legally uninformed citizens carries severe risks if advice lacks verifiable statutory grounding or compromises confidentiality. We audit the service across six architectural stages: citizen multilingual query, intent/jurisdiction gating, tiered statutory retrieval, user privacy shielding, provenance answering, and transactional erasure.",
        "methodology": "Conducted an empirical execution study of responses and an independent expert evaluation by licensed legal practitioners across seven dimensions (fluency, correctness, evidential grounding, jurisdiction compliance, user safety). Performed code-level privacy and cache-collision security analysis.",
        "dataset_details": "Complete codified statutory corpus of Bangladesh (The Bangladesh Code, Vol. I - L), comprising over 1,200 enacted acts and statutory rules.",
        "key_findings": [
            "Independent legal practitioners rated fluency at 4.83/5.00 and legal correctness at 4.05/5.00.",
            "Discovered critical evidential grounding gap: 51.4% of statutory answers displayed source citations absent from the generator context window, highlighting phantom grounding.",
            "Identified an ASCII regex flaw that previously caused cross-user cache collisions under phonetic Banglish inputs, leading to architectural recommendations D1–D5."
        ],
        "metrics": "Fluency: 4.83 / 5.00; Correctness: 4.05 / 5.00; Jurisdictional Safety: 96.2%",
        "pdf_url": "/assets/docs/LegalSupportAI_Paper.pdf",
        "arxiv_url": "",
        "doi": "CEUR-WS / JURIX-RT4RJ-2026",
        "bibtex": "@inproceedings{akter2026statute,\n  title={From Statute to Citizen: A Rights-by-Design Audit of a Bilingual Retrieval-Augmented Legal Assistant for Bangladesh},\n  author={Akter, Sumaiya and collaborators},\n  booktitle={RT4RJ @ JURIX 2026},\n  year={2026},\n  address={Toulouse, France}\n}",
        "featured": True
    },
    {
        "title": "ChatGPT and the Future World: Analysis of ChatGPT Benefits and Securities",
        "slug": "chatgpt-future-world-analysis",
        "authors": "Sumaiya Akter",
        "venue": "Global Scientific Journal (Vol. 11, Issue 8, August 2023, ISSN: 2320-9186)",
        "year": 2023,
        "status": "Published",
        "category": "AI Safety & Ethics",
        "abstract": "This paper presents an analytical examination of the emergence and adoption of Large Language Models, focusing on OpenAI’s ChatGPT. The investigation surveys transformative productivity enhancements across software engineering, academic pedagogy, and corporate automation, while systematically highlighting cybersecurity vulnerabilities, data sovereignty hazards, prompt injection risks, and synthetic misinformation vectors.",
        "methodology": "Systematic literature synthesis and comparative risk assessment analyzing LLM prompt architectures, jailbreak vectors, contextual safety guardrails, and enterprise governance frameworks.",
        "dataset_details": "Comparative synthesis of 85+ academic articles and industry technical reports on generative AI safety.",
        "key_findings": [
            "Categorized the top 5 operational failure modes in conversational LLM enterprise deployments.",
            "Formulated risk mitigation strategies for API key exposure, token-level data exfiltration, and hallucination propagation in corporate pipelines."
        ],
        "metrics": "Peer-reviewed journal publication; cited in emerging AI governance surveys.",
        "pdf_url": "",
        "arxiv_url": "",
        "doi": "ISSN 2320-9186",
        "bibtex": "@article{akter2023chatgpt,\n  title={ChatGPT and the Future World: Analysis of ChatGPT Benefits and Securities},\n  author={Akter, Sumaiya},\n  journal={Global Scientific Journal},\n  volume={11},\n  number={8},\n  year={2023},\n  issn={2320-9186}\n}",
        "featured": False
    },
    {
        "title": "Book: You Are A Flower",
        "slug": "you-are-a-flower-book",
        "authors": "Sumaiya Akter",
        "venue": "Published Monograph (ISBN: 9789843406249)",
        "year": 2021,
        "status": "Published",
        "category": "Philosophy & Human Reflection",
        "abstract": "A published literary and reflective work exploring perseverance, human purpose, personal resilience, and the inner journey of continuous learning and growth. The work connects personal philosophy with discipline, focus, and overcoming life challenges.",
        "methodology": "Literary composition and reflective philosophy.",
        "dataset_details": "Registered International Standard Book Number: ISBN 9789843406249.",
        "key_findings": [
            "Formally published in Bangladesh with official ISBN cataloging.",
            "Reflects the author’s dedication to multidimensional intellectual pursuits bridging arts and technological sciences."
        ],
        "metrics": "ISBN: 9789843406249",
        "pdf_url": "",
        "arxiv_url": "",
        "doi": "",
        "bibtex": "@book{akter2021flower,\n  title={You Are A Flower},\n  author={Akter, Sumaiya},\n  year={2021},\n  isbn={9789843406249}\n}",
        "featured": False
    }
]

for pub in publications_data:
    p = Publication(
        title=pub["title"],
        slug=pub["slug"],
        authors=pub["authors"],
        venue=pub["venue"],
        year=pub["year"],
        status=pub["status"],
        category=pub["category"],
        abstract=pub["abstract"],
        methodology=pub["methodology"],
        dataset_details=pub.get("dataset_details", ""),
        key_findings=json.dumps(pub.get("key_findings", [])),
        metrics=pub.get("metrics", ""),
        pdf_url=pub.get("pdf_url", ""),
        arxiv_url=pub.get("arxiv_url", ""),
        doi=pub.get("doi", ""),
        bibtex=pub.get("bibtex", ""),
        featured=pub.get("featured", False)
    )
    db.add(p)

db.commit()
print(f"Seeded {len(publications_data)} publications.")

# 4. Experiences
experiences_data = [
    {
        "company": "ACI Limited",
        "role": "Software Engineer – Backend, Artificial Intelligence Team",
        "period": "Jan 2026 – Present",
        "location": "Dhaka, Bangladesh",
        "is_current": True,
        "responsibilities": [
            "Architect and build production AI/backend systems using Python, FastAPI, PostgreSQL, Redis, SQLAlchemy, Alembic, Docker, and Linux.",
            "Develop LLM applications using OpenAI, Gemini, RAG, AI Agents, prompt engineering, context engineering, multimodal AI, streaming, and tool-based workflows.",
            "Design secure REST APIs with authentication, authorization, validation, rate limiting, pagination, OpenAPI, error handling, and observability.",
            "Implement production reliability patterns including idempotency, retries, timeouts, caching, quotas, server-authoritative persistence, background jobs, and failure handling.",
            "Build AI chatbot, document, image, and agent workflows using Redis/Celery, PostgreSQL, vector search, object storage, and asynchronous processing.",
            "Implement backend security including Google identity verification, resource ownership, IDOR prevention, secure uploads, audit logging, data isolation, and API protection.",
            "Deploy and maintain containerized services using Docker, Docker Compose, Nginx, GitHub Actions, Linux, monitoring, and production/on-prem infrastructure."
        ],
        "achievements": [
            "Lead backend architect for Doctor J (MedGPT), supporting hundreds of concurrent physician queries with sub-250ms TTFT.",
            "Engineered multi-key rotation and atomic Lua rate limiter, preventing quota exhaustion during peak hospital traffic.",
            "Designed and deployed AgroGPT multimodal vision and Bengali voice streaming engine for agricultural diagnostics."
        ],
        "tech_stack": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Celery", "Gemini Vision", "LangGraph", "MinIO", "Nginx"],
        "order_index": 1
    },
    {
        "company": "Elitbuzz",
        "role": "Zoho Creator Specialist",
        "period": "Jul 2025 – Nov 2025",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Developed custom enterprise business applications and automated workflows using Zoho Creator and Deluge scripting.",
            "Integrated Zoho CRM, Creator, and ERP applications with external third-party services via secure REST APIs.",
            "Collaborated closely with enterprise clients to translate business logic into maintainable automated workflows.",
            "Optimized database queries and enhanced existing business applications to reduce manual operating overhead."
        ],
        "achievements": [
            "Automated multi-department approval pipelines, reducing transaction processing time by 45%.",
            "Designed custom Deluge API bridges connecting billing systems with CRM entities."
        ],
        "tech_stack": ["Zoho Creator", "Deluge", "REST APIs", "CRM/ERP Integrations", "Webhooks", "Business Automation"],
        "order_index": 2
    },
    {
        "company": "Lawyer Lagbe BD",
        "role": "Co-Founder & Technical Lead",
        "period": "Jul 2024 – Aug 2025",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Conceptualized and co-founded the legal-tech startup 'Lawyer Lagbe' to bridge the justice gap for ordinary citizens in Bangladesh.",
            "Led end-to-end technical development covering product architecture, mobile applications (Flutter), web portals, and cloud backend.",
            "Integrated Firebase authentication, push notifications, and real-time database synchronizations.",
            "Maintained production deployments on cloud infrastructure and monitored security compliance for sensitive legal consultation data."
        ],
        "achievements": [
            "Successfully published mobile app to Google Play Store (com.aci.legalai).",
            "Co-authored research paper on the rights-by-design audit of the legal assistant, presented at RT4RJ @ JURIX 2026 in France.",
            "Onboarded first 1,000+ active users across Bangladesh seeking civil and tenancy statutory guidance."
        ],
        "tech_stack": ["Flutter", "Firebase", "FastAPI", "Python", "ChromaDB", "Google Cloud", "PostgreSQL"],
        "order_index": 3
    },
    {
        "company": "LR Global Bangladesh",
        "role": "Software Engineer",
        "period": "Sep 2022 – May 2024",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Executed full software development lifecycle work including feature engineering, debugging, code refactoring, and performance tuning for financial systems.",
            "Collaborated with asset management analysts to build automated reporting and portfolio tracking dashboards.",
            "Wrote comprehensive unit and integration tests to ensure data accuracy in mission-critical asset valuation codebases.",
            "Provided production maintenance and resolved tier-1 bugs within stringent SLA timeframes."
        ],
        "achievements": [
            "Refactored legacy calculation modules, achieving a 35% speedup in end-of-day portfolio valuation routines.",
            "Eliminated critical memory leaks in financial reporting daemons."
        ],
        "tech_stack": ["Python", "JavaScript", "SQL", "REST APIs", "Git", "Linux", "Financial Systems"],
        "order_index": 4
    },
    {
        "company": "BD Apps",
        "role": "App Developer",
        "period": "Jul 2020 – May 2025",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Developed and maintained Java-based native Android applications with focus on performance, usability, and backward compatibility.",
            "Engineered lite and pro variants of utility and productivity applications for mobile users across diverse device tiers.",
            "Monitored application crashes, user telemetry, and optimized memory usage across low-RAM devices."
        ],
        "achievements": [
            "Maintained 4.2+ star user satisfaction ratings across published applications.",
            "Optimized Android background workers, reducing battery drain by 28%."
        ],
        "tech_stack": ["Java", "Android SDK", "SQLite", "XML UI", "REST APIs", "Git"],
        "order_index": 5
    },
    {
        "company": "Dokmi Digital Marketing Agency",
        "role": "Junior Web Application Developer",
        "period": "Mar 2022 – Jul 2022",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Developed, customized, and maintained client web applications using WordPress, Shopify, HTML5, CSS3, JavaScript, and PHP.",
            "Integrated payment gateways, CRM webhooks, and backend databases for client e-commerce stores.",
            "Optimized website load times and implemented on-page SEO best practices."
        ],
        "achievements": [
            "Delivered 8+ client e-commerce and marketing platforms on schedule with 100% client sign-off."
        ],
        "tech_stack": ["WordPress", "Shopify", "PHP", "JavaScript", "HTML5", "CSS3", "MySQL"],
        "order_index": 6
    },
    {
        "company": "BDCom Online Limited",
        "role": "Software Engineer Intern",
        "period": "Oct 2021 – Feb 2022",
        "location": "Dhaka, Bangladesh",
        "is_current": False,
        "responsibilities": [
            "Revised, modularized, and updated legacy codebases to modern development standards, reducing operating overhead.",
            "Assisted senior engineers in developing software utilities for both desktop and mobile platforms.",
            "Participated in code reviews, daily standups, and QA testing cycles."
        ],
        "achievements": [
            "Completed internship with exemplary recommendation for modular code refactoring."
        ],
        "tech_stack": ["C++", "Java", "Python", "OOP", "Git", "Software Lifecycle"],
        "order_index": 7
    }
]

for exp in experiences_data:
    e = Experience(
        company=exp["company"],
        role=exp["role"],
        period=exp["period"],
        location=exp["location"],
        is_current=exp["is_current"],
        responsibilities=json.dumps(exp["responsibilities"]),
        achievements=json.dumps(exp["achievements"]),
        tech_stack=json.dumps(exp["tech_stack"]),
        order_index=exp["order_index"]
    )
    db.add(e)

db.commit()
print(f"Seeded {len(experiences_data)} experiences.")

# 5. Certifications
certs_data = [
    {
        "title": "Gold Medal – Independence Day Taekwondo Championship",
        "issuer": "Bangladesh Taekwondo Federation",
        "year": "2024",
        "type": "Martial Arts",
        "description": "Awarded 1st Place Gold Medal at the National Independence Day Taekwondo Championship 2024, demonstrating exceptional athletic excellence and tactical precision.",
        "image_url": "",
        "badge": "National Gold Medalist",
        "pdf_url": ""
    },
    {
        "title": "Gold Medal – 4th Federation Cup Taekwondo Competition",
        "issuer": "Bangladesh Taekwondo Federation",
        "year": "2024",
        "type": "Martial Arts",
        "description": "Clinched Gold Medal at the prestigious 4th Federation Cup Taekwondo Championship, competing among elite martial artists nationwide.",
        "image_url": "",
        "badge": "National Champion",
        "pdf_url": ""
    },
    {
        "title": "Taekwondo Black Belt (1st Dan)",
        "issuer": "World Taekwondo / Kukkiwon",
        "year": "2023",
        "type": "Martial Arts",
        "description": "Officially certified Black Belt holder in Taekwondo martial arts, representing over a decade of disciplined physical conditioning and mental resilience.",
        "image_url": "",
        "badge": "Black Belt Holder",
        "pdf_url": ""
    },
    {
        "title": "Bronze Medal – 22nd Victory Day Taekwondo Competition",
        "issuer": "National Sports Council of Bangladesh",
        "year": "2023",
        "type": "Martial Arts",
        "description": "Secured Bronze Medal in senior division sparring at the 22nd Victory Day National Championship.",
        "image_url": "",
        "badge": "National Bronze",
        "pdf_url": ""
    },
    {
        "title": "2 Bronze Medals – 4th Bangladesh Wadokai Club Karate Competition",
        "issuer": "Bangladesh Wadokai Karate Club",
        "year": "2023",
        "type": "Martial Arts",
        "description": "Awarded two Bronze medals in Kata and Kumite divisions at the 4th National Wadokai Karate Championship 2023.",
        "image_url": "",
        "badge": "Karate Medalist",
        "pdf_url": ""
    },
    {
        "title": "IELTS Academic: Overall Band 6.5 / 9.0",
        "issuer": "British Council / IDP IELTS Australia",
        "year": "2023",
        "type": "Academic",
        "description": "Certified English language proficiency: Listening 7.5, Speaking 7.0, Reading 5.5, Writing 5.5. Overall Band 6.5.",
        "image_url": "",
        "badge": "Overall 6.5 / 9.0",
        "pdf_url": ""
    },
    {
        "title": "HackerRank: 5-Star SQL Proficiency Badge",
        "issuer": "HackerRank",
        "year": "2023",
        "type": "Professional",
        "description": "Achieved the highest 5-Star proficiency rating on HackerRank for complex relational database queries, recursive CTEs, and window functions.",
        "image_url": "",
        "badge": "5-Star SQL",
        "pdf_url": ""
    },
    {
        "title": "Thesis Selection and Research Writing Certification",
        "issuer": "Abartan Research Institute",
        "year": "2023",
        "type": "Academic",
        "description": "Completed rigorous professional training on academic thesis design, literature taxonomy, experimental methodology, and scientific manuscript submission.",
        "image_url": "",
        "badge": "Certified Researcher",
        "pdf_url": ""
    },
    {
        "title": "Professional Skills Development: Skills for Career",
        "issuer": "Center for Enterprise & Society (CES)",
        "year": "2022",
        "type": "Professional",
        "description": "Completed comprehensive executive career readiness program focusing on technical leadership, agile project delivery, and cross-functional team dynamics.",
        "image_url": "",
        "badge": "Career Leadership",
        "pdf_url": ""
    },
    {
        "title": "1st Place – Independence Day Essay Writing Competition",
        "issuer": "Lakshmipur Government College",
        "year": "2016",
        "type": "Competition",
        "description": "Awarded First Place among college participants for outstanding analytical essay on national sovereignty and civic progress.",
        "image_url": "",
        "badge": "1st Place Winner",
        "pdf_url": ""
    }
]

for cert in certs_data:
    c = Certification(
        title=cert["title"],
        issuer=cert["issuer"],
        year=cert["year"],
        type=cert["type"],
        description=cert["description"],
        image_url=cert.get("image_url", ""),
        badge=cert.get("badge", ""),
        pdf_url=cert.get("pdf_url", "")
    )
    db.add(c)

db.commit()
print(f"Seeded {len(certs_data)} certifications.")

# 6. Articles
articles_data = [
    {
        "title": "Reading a Scientific Research Paper Effectively: A Practical Step-by-Step Guide for Engineers and Researchers",
        "slug": "reading-scientific-paper-effectively",
        "category": "Research & Methodology",
        "summary": "A disciplined, three-pass methodology for breaking down dense scientific manuscripts, deciphering mathematical formulations, evaluating experimental baselines, and identifying genuine research gaps.",
        "content": "In the fast-moving worlds of Artificial Intelligence, Computer Vision, and Distributed Systems, relying solely on commercial blog posts leaves you behind. Academic manuscripts published at NeurIPS, ICML, CVPR, and IEEE journals contain the true blueprints...\n\nThree-Pass Reading Framework:\n1. Pass 1: The Structural Bird's-Eye View (5-10 min)\n2. Pass 2: The Core Mechanism & Methodology (30-45 min)\n3. Pass 3: Virtual Replication & Critical Audit (1-2 hours)",
        "read_time_minutes": 6,
        "published_date": "2024-05-12",
        "tags": ["Research Methodology", "Deep Learning", "Academic Writing", "Machine Learning"],
        "featured": True
    },
    {
        "title": "Building Resilient, Low-Latency Multimodal RAG Systems: Rate Limits, Streaming & Caching",
        "slug": "building-resilient-rag-production",
        "category": "Production AI Systems",
        "summary": "Practical architectural lessons from designing Doctor J and AgroGPT: Implementing multi-key rotation, Redis atomic Lua quotas, server-authoritative SSE streaming, and IDOR protection.",
        "content": "Deploying generative AI into a live clinical hospital portal or an agricultural field service where hundreds of concurrent users demand sub-second streaming answers reveals how fragile basic tutorials are...\n\nCore Resilience Strategies:\n1. Multi-Key Rotation with 60-second cooldown quarantine pool.\n2. Server-Authoritative Streaming & Disconnect Resilience.\n3. Atomic Quota Management with Redis Lua Scripts.",
        "read_time_minutes": 8,
        "published_date": "2026-03-18",
        "tags": ["AI Architecture", "FastAPI", "Redis", "LLM Production", "System Design"],
        "featured": True
    },
    {
        "title": "Top Features of ECMAScript 6 (ES6): A Quick Synopsis for Modern Software Engineers",
        "slug": "top-features-es6-quick-synopsis",
        "category": "Software Engineering",
        "summary": "A concise technical overview of modern JavaScript primitives introduced in ES6: Block scoping, arrow functions, destructuring, promises, and modular architecture.",
        "content": "ECMAScript 2015 (ES6) represented the most fundamental paradigm shift in JavaScript history, transforming it from a browser scripting language into an enterprise runtime.\n\nKey Primitives:\n1. Block Scoping with let and const.\n2. Arrow Functions and Lexical this.\n3. Destructuring & Spread Operators.\n4. Native Promises & Asynchronous Pipelines.\n5. Standardized ES Modules (ESM).",
        "read_time_minutes": 5,
        "published_date": "2023-01-20",
        "tags": ["JavaScript", "ES6", "Web Development", "Frontend"],
        "featured": False
    },
    {
        "title": "Applying Redux Architecture and State API in Production Web Applications",
        "slug": "applying-redux-api-web-applications",
        "category": "Frontend Engineering",
        "summary": "An architectural breakdown of predictable unidirectional state flow: Actions, pure reducers, immutable state trees, and middleware in complex web applications.",
        "content": "In large-scale client applications like financial stock dashboards (e.g. Zsenia) or medical patient record portals, managing mutable state across nested component trees quickly devolves into an unmaintainable web of two-way bindings...\n\nRedux resolves this via Single Source of Truth, Read-Only State, and Pure Reducers.",
        "read_time_minutes": 6,
        "published_date": "2023-04-14",
        "tags": ["Redux", "React.js", "State Management", "Frontend Architecture"],
        "featured": False
    }
]

for art in articles_data:
    a = Article(
        title=art["title"],
        slug=art["slug"],
        category=art["category"],
        summary=art["summary"],
        content=art["content"],
        read_time_minutes=art["read_time_minutes"],
        published_date=art["published_date"],
        tags=json.dumps(art["tags"]),
        featured=art["featured"]
    )
    db.add(a)

db.commit()
print(f"Seeded {len(articles_data)} articles.")

# 7. Videos
videos_data = [
    {
        "title": "Rxpert: AI Literature Review Module Architecture & Technical Discussion",
        "slug": "rxpert-literature-review-walkthrough",
        "category": "Pharmaceutical AI",
        "description": "A deep-dive technical presentation and module demonstration of Rxpert’s literature review engine: Ingesting scientific papers, extracting active ingredients, and synthesizing pharmacological summaries.",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "thumbnail_url": "/assets/images/rxpert-fig2_litreview.webp",
        "duration": "18:45",
        "topics": ["Literature Review", "Pharmaceutical AI", "Vector RAG", "QTPP"],
        "related_project_slug": "rxpert-pharmaceutical",
        "featured": True
    },
    {
        "title": "Rxpert: Quality Target Product Profile (QTPP) & Formulation Synthesis Demo",
        "slug": "rxpert-qtpp-formulation-demo",
        "category": "Pharmaceutical AI",
        "description": "Detailed operational walkthrough showcasing how the QTPP and formulation modules automatically match excipients, forecast dissolution profiles, and compile compliance documentation.",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "thumbnail_url": "/assets/images/rxpert-fig3_qtpp.webp",
        "duration": "14:20",
        "topics": ["QTPP Synthesis", "API Selection", "Formulation", "21 CFR Part 11"],
        "related_project_slug": "rxpert-pharmaceutical",
        "featured": True
    },
    {
        "title": "Doctor J: Multimodal Medical Vision & Streaming AI Assistant Overview",
        "slug": "doctor-j-system-architecture-overview",
        "category": "Medical AI",
        "description": "Architectural overview of Doctor J (stage.doctorj.health): Ingesting chest X-rays, MRI scans, and lab reports with zero-loss SSE streaming, Redis atomic rate limits, and patient privacy shielding.",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "thumbnail_url": "/assets/images/doctorj-hero.webp",
        "duration": "22:10",
        "topics": ["Healthcare AI", "Medical Vision", "FastAPI", "System Architecture"],
        "related_project_slug": "doctor-j",
        "featured": True
    },
    {
        "title": "AgroGPT: Real-Time Crop Disease Vision & Localized Bengali Voice Intelligence",
        "slug": "agrogpt-crop-diagnostic-demo",
        "category": "Agritech AI",
        "description": "Live field demo of AgroGPT detecting leaf blights and pest attacks from camera photos, paired with low-latency bidirectional voice conversations in native Bengali.",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "thumbnail_url": "/assets/images/agrogpt-hero.webp",
        "duration": "12:35",
        "topics": ["Agritech", "Crop Disease Vision", "Voice Streaming", "Gemini Flash"],
        "related_project_slug": "agrogpt",
        "featured": True
    }
]

for vid in videos_data:
    v = Video(
        title=vid["title"],
        slug=vid["slug"],
        category=vid["category"],
        description=vid["description"],
        video_url=vid["video_url"],
        thumbnail_url=vid["thumbnail_url"],
        duration=vid["duration"],
        topics=json.dumps(vid["topics"]),
        related_project_slug=vid["related_project_slug"],
        featured=vid["featured"]
    )
    db.add(v)

db.commit()
print(f"Seeded {len(videos_data)} videos.")

db.close()
print("--- Backend Database Seeding Complete! ---")
