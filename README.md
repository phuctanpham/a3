# Serverless driven machine learning project
## I/ Introduction to Valumind Project
**User Flow Summary:**
* Login to appraiser page (bank) or valumind page (borrower)
* Submit property images and information to the application
* Wait for AI-powered valuation trained from data sources like Chợ Tốt, real estate portals, etc.

**Below are the pages being used:**
```
admin: appraiser.pages.dev  
app: valumind.pages.dev  
api: api.vpbank.workers.dev  
auth: auth.vpbank.workers.dev  
```
`codebase`: https://github.com/phuctanpham/valumind  
## II/ Technical Documentation
```
📋 Table of Contents

1. Architecture Overview
2. Directory Structure
3. Microservices Module Details
4. Monorepo-driven DevSecOps Architecture
5. Shared Layers-driven MLops Architecture
6. Environment Setup
7. Overall Architecture Diagram
```

### 1. Architecture Overview
The AI Asset Valuation system is an intelligent asset valuation platform using Machine Learning and OCR, built with Microservices architecture featuring Monorepo CI/CD and Multi-Layer Lambda Architecture.  
**Key Components:**
* Frontend Layer: Admin (SPA) + App (Mobile PWA)
* Gateway Layer: API (API Gateway) + Auth (IAM)
* Business Logic Layer: Warp (AI Gateway)
* AI/ML Services Layer: OCR + Train + Predict
* Data Layer: Cron (Crawling)
* Infrastructure Layer: Shared (Lambda Layers) + .github (CI/CD)

### 2. Directory Structure
```
./
├── admin/                 # Web Admin SPA
├── app/                   # Mobile PWA
├── api/                   # API Gateway
├── auth/                  # IAM Service
├── warp/                  # Secured AI Gateway
├── ocr/                   # OCR Service
├── cron/                  # Data Crawling
├── train/                 # ML Training
├── predict/               # Valuation Service
├── shared/                # Lambda Layers
├── .github/               # CI/CD Workflows
│   ├── actions/           # Reusable Actions
│   ├── utils/             # Verification Scripts
│   └── workflows/         # GitHub Actions
├── testCICD.sh           # Local CI/CD Testing
└── README.md
```

### 3. Chi tiết các module
#### 3.1. Admin - Web Application for Bank
**Purpose:** Secure web portal for bank employees to review loan applications  
**Tech Stack:** React 19 + Next.js 16 + Tailwind CSS  
**Structure:**  
```
admin/
├── app/                   # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main entry
├── components/           # React Components
│   ├── auth/            # Authentication
│   ├── dashboard/       # Dashboard modules
│   └── ui/              # UI primitives
├── public/              # Static assets
├── next.config.mjs      # Next.js config
└── package.json
```
**Key Features:**
* Email + Google OAuth authentication
* Real estate valuation dashboard
* Property image upload and analysis
* View detailed valuation reports
* Loan application management

**Default Port**: 3000  
**Deployment**: Cloudflare Pages (Next Build)  
**Production**: AWS Amplify (Static Export)

#### 3.2. App - Mobile PWA Application for Borrowers
**Purpose:** Mobile application for borrowers to value assets before requesting loans  
**Tech Stack:** React 19 + Vite + PWA + Google Maps  
**Structure:**  
```
app/
├── src/
│   ├── components/       # React Components
│   │   ├── BotTab.tsx   # Chat with AI
│   │   ├── DetailTab.tsx # Property details
│   │   ├── ValuationTab.tsx # Valuation
│   │   └── ...
│   ├── App.tsx          # Main App
│   ├── main.tsx         # Entry point
│   └── sw.ts            # Service Worker
├── public/
│   ├── manifest.json    # PWA Manifest
│   └── mock.json        # Mock data
├── vite.config.ts       # Vite + PWA config
└── package.json
```
**Key Features:**
* PWA with offline support
* Property list management
* View valuations on map
* Chat with advisory bot
* Activity history

**Default Port**: 5173  
**Deployment**: Cloudflare Pages (Vite Build)  
**Production**: AWS Amplify (Vite Build) 

#### 3.3. API - API Gateway
**Purpose:** Single API gateway for Admin and App to communicate with backend  
**Tech Stack:** Node.js + Hono.js (Express-like framework)  
**Structure:**  
```
api/
├── src/
│   └── main.ts          # API Routes
├── wrangler.toml        # Cloudflare config
└── package.json
```
**Key Features:**
* Rate limit management
* Token validity checking
* Temporarily store and defer requests with expired tokens, notify auth
* Queue valid token requests and notify warp
* Timeout management for queued requests

**Default Port**: 8787  
**Deployment**: Cloudflare Worker  
**Production**: AWS Lambda Function  

#### 3.4. Auth - Identity & Access Manager
**Purpose**: Authentication and authorization for all transactions between API and client devices  
**Tech Stack**: Node.js + Hono.js + JWT + Bcrypt  
**Structure**:
```
auth/
├── src/
│   └── main.ts          # Auth Routes
└── wrangler.toml
```

**Key Features:**
* User registration, login, and account recovery
* Issue accessToken and refreshToken
* Manage login devices

**Default Port**: `8788`  
**Deployment**: Cloudflare Workers    
**Production**: AWS Lambda Function

#### 3.5. Warp - AI Gateway
**Purpose**: Enhance security by auditing all data flowing to and from AI workers  
**Tech Stack**: Python 3.11 + FastAPI + SQLAlchemy + JWT  
**Structure**:   
```
warp/
├── src/
│   ├── main.py                     # FastAPI App
│   ├── models.py                   # SQLAlchemy Models
│   ├── schemas.py                  # Pydantic Schemas
│   ├── auth.py                     # JWT Auth
│   ├── auth_routes.py              # Auth Endpoints
│   ├── email_service.py            # Email Service
│   ├── image_analysis_service.py   # AI Image Analysis
│   ├── parsers.py                  # Text Parsers
│   └── valuation.py                # Valuation Logic
├── requirements.txt
└── lambda_handler.py
```
**Key Features:**
* Audit data flowing to/from AI workers
* Exchange data between API gateway and AI workers 
* Read and write data to databases

**Default Port**: `8000`  
**Deployment**: Cloudflare Worker AI  
**Production**: AWS Lambda Function + AWS Lambda Layer  

#### 3.6. OCR - Optical Character Recognition Service
**Purpose**: Recognize and extract information from property certificates  
**Tech Stack**: Python 3.11 + OpenCV + Pillow + OpenAI GPT-4V  
**Structure**:  
```
ocr/
├── src/
│   ├── main.py          # FastAPI App
│   └── lambda_handler.py
└── requirements.txt
```
**Key Features**:
- Text recognition from certificate images
- Multi-pass OCR strategy
- Image preprocessing
- Structured data extraction

**Default Port**: `8001`  
**Deployment**: Cloudflare Workers AI  
**Production**: AWS Lambda Function  

#### 3.7. Cron - Data Crawling Service
**Purpose**: Collect and clean data from real estate websites (Chợ Tốt, Batdongsan, ...)  
**Tech Stack**: Python 3.11 + FastAPI + SQLAlchemy + BeautifulSoup/Scrapy  
**Structure**:  
```
cron/
├── src/
│   ├── main.py          # Task Scheduler
│   └── lambda_handler.py
└── requirements.txt
```
**Key Features:**
* Scheduled task management
* Data crawling from multiple sources
* Data cleaning and normalization
* Save to database via warp

**Default Port**: `8002`  
**Deployment**: Cloudflare Worker 
**Production**: AWS Lambda Function  

#### 3.8. Train - ML Training Service
**Purpose**: Train Machine Learning models from crawled data  
**Tech Stack**: Python 3.11 + LightGBM + Scikit-learn + Pandas  
**Structure**:  
```
train/
├── src/
│   ├── main.py          # Training Pipeline
│   └── lambda_handler.py
└── requirements.txt
```

**Key Features**:
- Data preprocessing
- Feature engineering
- Model training with LightGBM
- Model evaluation
- Save model artifacts to S3

**Default Port**: `8003`  
**Deployment**: Cloudflare Worker AI + Cloudflare R2  
**Production**: AWS Lambda Function + AWS S3  

#### 3.9. Predict - Valuation Service
**Purpose**: Asset valuation API using trained models  
**Tech Stack**: Python 3.11 + LightGBM + SHAP + FastAPI  
**Structure**:  
```
predict/
├── src/
│   ├── main.py          # Prediction API
│   ├── schemas.py       # Pydantic Models
│   └── lambda_handler.py
└── requirements.txt
```

**Key Features:**
* Load model from S3
* Real-time prediction
* SHAP explainability (prediction explanation)
* Feature validation

**Default Port**: `8004`  
**Deployment**: Cloudflare Worker AI + Cloudflare R2  
**Production**: AWS Lambda Function + Model from S3  

#### 3.10. Shared - Packages for Shared Layers driven MLops Architecture  
**Purpose**: Share dependencies between Lambda functions to reduce deployment size  
**Tech Stack**: Python packages precompiled for `manylinux2014_x86_64`  
**Structure**:  
```
shared/
├── shared_requirement_layer.txt      # FastAPI, Pydantic
├── ml_requirement_layer_1.txt        # Pandas, Numpy
├── ml_requirement_layer_2.txt        # LightGBM, Scikit-learn
├── ml_requirement_layer_3.txt        # Matplotlib, Geopy
├── ml_requirement_layer_4.txt        # Tabulate, Cloudpickle
├── ml_requirement_layer_5.txt        # SHAP
├── ocr_requirement_layer_1.txt       # Pillow, Numpy
├── ocr_requirement_layer_2.txt       # OpenCV
└── ocr_requirement_layer_3.txt       # OpenAI
```

**Layers mapping**:
* **predict** and **train**: `shared` + `ml1` + `ml2` + `ml3` + `ml4` + `ml5`
* **ocr**, **warp**, **cron**: `shared` + `ocr1` + `ocr2` + `ocr3`

**Benefits**:
* Reduce deployment package size (from 500MB → 50MB)
* Faster deployment
* Share common dependencies
* Avoid long cold starts

#### 3.11. .github - CI/CD of Monorepos driven Devsecops Architecture
**Purpose**: Automated DevSecOps pipeline without exposing secrets between repos  
**Tech Stack**: GitHub Actions + Reusable Workflows  
**Structure**:  
```
.github/
├── actions/                          # Reusable Actions
│   ├── build-lambda-package/         # Build Lambda ZIP
│   ├── setup-node/                   # Setup Node.js
│   └── setup-python/                 # Setup Python
├── utils/                            # Verification Scripts
│   ├── aws-lambda.sh                 # Verify AWS Lambda
│   ├── cloudflare.sh                 # Verify Cloudflare
│   └── build-layer.sh                # Build Lambda Layer
└── workflows/                        # GitHub Actions Workflows
    ├── main.yml                      # Main CI/CD
    ├── deploy-layers.yml             # Deploy Layers
    ├── aws-lambda.yml                # Deploy Lambda (single)
    ├── aws-lambda-with-layer.yml     # Deploy Lambda (with layers)
    ├── cloudflare-pages.yml          # Deploy CF Pages
    └── cloudflare-workers.yml        # Deploy CF Workers
```
**Deployment**: GitHub Action + AWS CLI + Cloudflare CLI  

### 4. Monorepo-driven DevSecOps Architecture
#### 4.1. Main Workflow 
**Workflow:** `main.yml`  
**Trigger:** Push/PR to main branch  
**Flow:**
```
1. Detect Changes (dorny/paths-filter)
   ↓
2. Deploy Changed Services (parallel)
   ├── admin → cloudflare-pages.yml
   ├── app → cloudflare-pages.yml
   ├── api → cloudflare-workers.yml
   ├── auth → cloudflare-workers.yml
   ├── warp → aws-lambda-with-layer.yml
   ├── ocr → aws-lambda-with-layer.yml
   ├── cron → aws-lambda-with-layer.yml
   ├── train → aws-lambda-with-layer.yml
   ├── predict → aws-lambda-with-layer.yml
   └── shared → deploy-layers.yml
```
Example: If only admin/ is modified, only deploy admin, don't deploy other services.  

#### 4.2. Lambda Deployment with Layers
**Workflow:** `aws-lambda-with-layer.yml`  
**Trigger:** directories change in branch `main`    
**Steps:**  
```
1. Checkout code
2. Setup Python 3.11
3. Configure AWS credentials
4. Get latest layer ARNs (shared, ml1-5, ocr1-3)
5. Build app package
   - Install dependencies
   - Copy source code
   - Clean __pycache__, tests, ...
6. Download model (if needed) from S3
7. Create deployment ZIP
8. Check size
9. Upload to S3
10. Determine layers based on function name
11. Update Lambda function code
12. Update Lambda configuration (layers, timeout, memory, env vars)
```
Layer logic:  
```
if function == "predict" or "train":
  layers = shared + ml1 + ml2 + ml3 + ml4 + ml5
elif function == "warp" or "cron" or "ocr":
  layers = shared + ocr1 + ocr2 + ocr3
```

#### 4.3. Cloudflare Deployment
**Workflow:** `cloudflare-pages.yml`  
**Trigger:** frontend directories change in branch `test`    
**Steps:**  
```
1. Checkout code
2. Setup Node.js with npm cache
3. Install dependencies (npm ci)
4. Build
5. Detect build output (out/dist/build)
6. Deploy to Cloudflare Pages
```
#### 4.4. Secrets Management
Required Secrets:  
```
# AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_BUCKET_NAME
AWS_ACCOUNT_ID

# Lambda Functions
AWS_LAMBDA_PREDICT_FUNCTION_NAME
AWS_LAMBDA_TRAIN_FUNCTION_NAME
AWS_LAMBDA_WARP_FUNCTION_NAME
AWS_LAMBDA_CRON_FUNCTION_NAME
AWS_LAMBDA_OCR_FUNCTION_NAME

# Cloudflare
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID

# Database
DATABASE_URL

# APIs
OPENAI_API_KEY

# Email
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM_EMAIL
SMTP_FROM_NAME

# URLs
ADMIN_URL
WARP_URL
```
## 5. Shared Layers-driven MLops Architecture

### 5.1. Why Do We Need Layers?

**Problem**: Lambda deployment package size limit 250MB (direct), 50MB (compressed)

**Solution**: Split dependencies into Layers (max 5 layers/function, 250MB/layer)

### 5.2. Layer Strategy

**Shared Layer** (for everyone):
```
fastapi==0.104.1
mangum==0.17.0
pydantic==2.5.0
python-dotenv==1.0.0
```

**ML Layers** (for train/predict):
```
Layer 1: pandas, numpy
Layer 2: lightgbm, scikit-learn
Layer 3: matplotlib, geopy, joblib
Layer 4: tabulate, cloudpickle, packaging, slicer
Layer 5: shap
```

**OCR Layers** (for ocr/warp/cron):
```
Layer 1: Pillow, numpy
Layer 2: opencv-python-headless
Layer 3: openai
```
### 6. Environment Setup
#### 6.1. Environment Variables
Create `.env` file at root:  
```
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCOUNT_ID=your_aws_account_id

# Lambda Functions
AWS_LAMBDA_PREDICT_FUNCTION_NAME=predict
AWS_LAMBDA_TRAIN_FUNCTION_NAME=train
AWS_LAMBDA_WARP_FUNCTION_NAME=warp
AWS_LAMBDA_CRON_FUNCTION_NAME=cron
AWS_LAMBDA_OCR_FUNCTION_NAME=ocr
AWS_LAMBDA_SHARED_FUNCTION_LAYER)NAME=shared
AWS_LAMBDA_OCR1_FUNCTION_LAYER)NAME=ocr1
AWS_LAMBDA_OCR2_FUNCTION_LAYER)NAME=ocr2
AWS_LAMBDA_ORC3_FUNCTION_LAYER)NAME=ocr3
AWS_LAMBDA_ML1_FUNCTION_LAYER)NAME=ml1
AWS_LAMBDA_ML2_FUNCTION_LAYER)NAME=ml2
AWS_LAMBDA_ML3_FUNCTION_LAYER)NAME=ml3
AWS_LAMBDA_ML4_FUNCTION_LAYER)NAME=ml4
AWS_LAMBDA_ML5_FUNCTION_LAYER)NAME=ml5

# Cloudflare
CLOUDFLARE_API_TOKEN=your_cf_token
CLOUDFLARE_ACCOUNT_ID=your_cf_account_id

# Database (NeonDB PostgreSQL)
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require

# OpenAI
OPENAI_API_KEY=sk-xxx

# Email (Gmail App Password)
SMTP_HOST=your_email_smtp_host
SMTP_PORT=your_email_smtp_port 
SMTP_USERNAME=your_email@domain
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=your_app_name

# URLs
ADMIN_URL=http://localhost:3000
WARP_URL=http://localhost:8000

# Security
WARP_KEY=your-secret-jwt-key-change-in-production
```
#### 6.2. Setup Script
For setup instructions, refer to the `setup.sh` script in the root directory. It provides interactive options to set up services including prerequisite checks and individual service configuration.

#### 6.3. Start Script
Use the `start.sh` script to launch services. The script provides interactive options to start all services, frontend only, backend only, or essential services combination (admin + app + warp + predict).

**Available Options:**
* Option 1: Start all services (admin, app, api, auth, warp, ocr, cron, train, predict)
* Option 2: Frontend only (admin + app)
* Option 3: Backend only (warp, ocr, cron, train, predict)
* Option 4: Essential (admin + app + warp + predict)

**Service Access URLs:**
* Admin: http://localhost:3000
* App: http://localhost:5173
* Warp: http://localhost:8000/docs
* Predict: http://localhost:8004/docs

**Stopping Services:** Press Ctrl+C to stop all running services

### 7. Overall Architecture Diagram

#### 7.1. System Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │   Admin (Web)    │              │   App (Mobile)   │         │
│  │  React + Next.js │              │  React + Vite    │         │
│  │  Port: 3000      │              │  Port: 5173      │         │
│  │  CF Pages        │              │  CF Pages + PWA  │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                 │                   │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            └────────────┬────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │   API Gateway    │◄────────────►│   Auth (IAM)     │         │
│  │   Hono.js        │              │   Hono.js + JWT  │         │
│  │   Port: 8787     │              │   Port: 8788     │         │
│  │   CF Workers     │              │   CF Workers     │         │
│  └────────┬─────────┘              └──────────────────┘         │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                          │
├─────────────────────────────────────────────────────────────────┤AI
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                  Warp (AI Gateway)                     │     │
│  │              Python + FastAPI                          │     │
│  │              Port: 8000                                │     │
│  │              AWS Lambda + Function URL                 │     │
│  │                                                        │     │
│  │  Features:                                             │     │
│  │  • Email Auth + Verification                           │     │
│  │  • S3 Upload                                           │     │
│  │  • AI Image Analysis (GPT-4V)                          │     │
│  │  • Multi-pass OCR                                      │     │
│  │  • Report Management                                   │     │
│  └────────┬───────────────────────────────────────────────┘     │
│           │                                                     │
└───────────┼─────────────────────────────────────────────────────┘
            │
            ├──────────────┬──────────────┬──────────────┐
            ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI/ML SERVICES LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │   OCR    │    │   Cron   │    │  Train   │    │ Predict  │   │
│  │ OpenCV + │    │  Scrapy  │    │ LightGBM │    │ LightGBM │   │
│  │  GPT-4V  │    │ FastAPI  │    │ FastAPI  │    │ + SHAP   │   │
│  │          │    │          │    │          │    │ FastAPI  │   │
│  │ Port:    │    │ Port:    │    │ Port:    │    │ Port:    │   │
│  │  8001    │    │  8002    │    │  8003    │    │  8004    │   │
│  │          │    │          │    │          │    │          │   │
│  │ Lambda   │    │ Lambda + │    │ Lambda   │    │ Lambda   │   │
│  │ +OCR     │    │EventBridge│   │ +ML      │    │ +ML      │   │
│  │ Layers   │    │          │    │ Layers   │    │ Layers   │   │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘   │
│       │               │               │               │         │
└───────┼───────────────┼───────────────┼───────────────┼─────────┘
        │               │               │               │
        └───────────────┴───────────────┴───────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   NeonDB     │    │   AWS S3     │    │  External    │       │
│  │  PostgreSQL  │    │  (Storage)   │    │  Data        │       │
│  │              │    │              │    │  Sources     │       │
│  │  • Users     │    │  • Images    │    │              │       │
│  │  • Reports   │    │  • Models    │    │ • Chợ Tốt    │       │
│  │  • Images    │    │  • Layers    │    │ • BĐS.vn     │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
#### 7.2. Lambda Layer Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                   AWS LAMBDA FUNCTIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Predict  │  │  Train   │  │   Warp   │  │   OCR    │         │
│  │ (50MB)   │  │ (50MB)   │  │ (30MB)   │  │ (30MB)   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │             │             │               │
│       └──────┬──────┴──────┬──────┴──────┬──────┘               │
│              │             │             │                      │
└──────────────┼─────────────┼─────────────┼──────────────────────┘
               │             │             │
               ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAMBDA LAYERS (Shared)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Layer: shared (25MB)                                │       │
│  │  • FastAPI, Pydantic, Mangum, python-dotenv          │       │
│  │  Used by: ALL functions                              │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  ML Layers (for Predict + Train)                     │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  Layer 1 (80MB): pandas, numpy                       │       │
│  │  Layer 2 (100MB): lightgbm, scikit-learn             │       │
│  │  Layer 3 (60MB): matplotlib, geopy, joblib           │       │
│  │  Layer 4 (40MB): tabulate, cloudpickle, packaging    │       │
│  │  Layer 5 (70MB): shap                                │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  OCR Layers (for Warp + OCR + Cron)                  │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │  Layer 1 (50MB): Pillow, numpy                       │       │
│  │  Layer 2 (150MB): opencv-python-headless             │       │
│  │  Layer 3 (20MB): openai                              │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Benefits**:
* Deployment size: 500MB → 50MB (~90% reduction)
* Cold start: ~8s → ~2s (~75% faster)
* Reusable: 1 layer for multiple functions
* Independent update: Only update layer when dependencies change

#### 7.3. CI/CD Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                               │
│                    git push origin main                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS                             │
│                    (Monorepo CI/CD)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Detect Changes (dorny/paths-filter)                    │
│  ┌─────────────────────────────────────────────────┐            │
│  │  Changed: admin/, app/, warp/, predict/         │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  Step 2: Deploy Changed Services (Parallel)                     │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Deploy Admin │  │ Deploy App   │  │ Deploy Warp  │           │
│  │ CF Pages     │  │ CF Pages     │  │ AWS Lambda   │           │
│  │              │  │              │  │ with Layers  │           │
│  │ 1. Build     │  │ 1. Build     │  │              │           │
│  │ 2. Deploy    │  │ 2. Deploy    │  │ 1. Get Layers│           │
│  │              │  │              │  │ 2. Build     │           │
│  │ ✓ Success    │  │ ✓ Success    │  │ 3. Upload S3 │           │
│  └──────────────┘  └──────────────┘  │ 4. Update    │           │
│                                      │              │           │
│                                      │ ✓ Success    │           │
│                                      └──────────────┘           │
│                                                                 │
│  ┌──────────────┐                                               │
│  │Deploy Predict│                                               │
│  │ AWS Lambda   │                                               │
│  │              │                                               │
│  │ 1. Get Layers│                                               │
│  │ 2. Download  │                                               │
│  │    Model     │                                               │
│  │ 3. Build     │                                               │
│  │ 4. Upload S3 │                                               │
│  │ 5. Update    │                                               │
│  │              │                                               │
│  │ ✓ Success    │                                               │
│  └──────────────┘                                               │
│                                                                 │
│  Step 3: Notification (Optional)                                │
│  ┌─────────────────────────────────────────────────┐            │
│  │  Deployment Summary:                            │            │
│  │  • admin: ✓ Deployed                            │            │
│  │  • app: ✓ Deployed                              │            │
│  │  • warp: ✓ Deployed                             │            │
│  │  • predict: ✓ Deployed                          │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 7.4. Data Flow - Upload & Analysis
```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (PWA)                              │
│               Upload Images + Request Analysis                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Admin (SPA)                                │
│          POST /api/analysis/upload-and-analyze                  │
│          Authorization: Bearer {token}                          │
│          Files: [image1.jpg, image2.jpg, ...]                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│    Ocr Service + Warp Service + Auth Service + API Service      │
│                                                                 │
│  1. Authenticate User (JWT)                                     │
│  2. For each image:                                             │
│     ├─ Compress if > 20MB                                       │
│     ├─ Preprocess (contrast, sharpen, denoise)                  │
│     ├─ Convert to base64                                        │
│     └─ Upload original to S3                                    │
│                                                                 │
│  3. Call OpenAI GPT-4V (PASS 1)                                 │
│     ├─ Comprehensive extraction                                 │
│     └─ Focus on critical fields                                 │
│                                                                 │
│  4. Validate critical fields                                    │
│     └─ If missing → PASS 2 (targeted retry)                     │
│                                                                 │
│  5. Return analysis result                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Admin (SPA)                              │
│                                                                 │
│  • Display extracted data                                       │
│  • Allow user to review/edit                                    │
│  • Submit to create report                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Predict Service + Warp Service + Auth Service + API Service    │
│                   POST /api/reports                             │
│                                                                 │
│  • Save report to NeonDB                                        │
│  • Link images from S3                                          │
│  • Store AI analysis raw                                        │
└─────────────────────────────────────────────────────────────────┘
```

#### 7.5. Data Flow - Valuation
```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (PWA)                              │
│                 Request Property Valuation                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                            API                                  │
│                   POST /predict                                 │
│                   Body: Property Features                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Predict Service + Warp Service                     │
│                                                                 │
│  1. Load LightGBM Model from Memory                             │
│     (Pre-loaded at cold start from S3)                          │
│                                                                 │
│  2. Validate Input Features                                     │
│     ├─ size, living_size, width, length                         │
│     ├─ rooms, toilets, floors                                   │
│     ├─ longitude, latitude                                      │
│     └─ category, region, area                                   │
│                                                                 │
│  3. Transform Features                                          │
│     ├─ Convert categorical to category dtype                    │
│     └─ Create pandas DataFrame                                  │
│                                                                 │
│  4. Predict Price                                               │
│     └─ model.predict(features)                                  │
│                                                                 │
│  5. Calculate SHAP Values                                       │
│     ├─ explainer.shap_values(features)                          │
│     ├─ Sort by importance                                       │
│     └─ Create explanation                                       │
│                                                                 │
│  6. Return Response                                             │
│     ├─ estimated_price_vnd                                      │
│     └─ analysis (base_price + factors)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      App Frontend                               │
│                                                                 │
│  • Display estimated price                                      │
│  • Show SHAP explanation                                        │
│  • Visualize factors on chart                                   │
└─────────────────────────────────────────────────────────────────┘
```

