# 02 Tech Stack Spec

<!-- Add your content here -->
# Technical Stack & Environment Specification

## 1. Languages & Runtimes
- **Language:** TypeScript (v5.0+) – Used across frontend and backend for type safety.
- **Frontend Runtime:** Node.js (v20.x) – For Next.js.
- **Backend Runtime:** Node.js (v20.x) – For AWS Lambda environment.

## 2. Frameworks & Libraries
- **Frontend Framework:** Next.js (v14.x) – Using App Router.
- **Backend Framework:** Next.js API Routes (deployed to AWS Lambda via `@opennextjs/aws` or Serverless Framework) OR separate Node.js functions.
- **PDF Text Extraction:** `pdfjs-dist` (v3.x) – Mozilla's actively maintained PDF.js library. Chosen over `pdf-parse` (abandoned since 2019, Node 18+ compatibility issues, path traversal risk on untrusted uploads).
- **AI Integration:** `@google/generative-ai` (^0.21.0) – Official Google AI SDK for Gemini. Pinned to `^0.21.0` minimum; do not use unqualified `v0.x` as the API surface changed significantly across minor versions.
- **File Storage:** `aws-sdk/client-s3` (v3.x) – AWS SDK v3 for JavaScript.
- **Database/Storage Client:** `@supabase/supabase-js` (v2.x) – For interacting with Supabase (Postgres) for session management.

## 3. Database & Storage
- **Database Engine:** PostgreSQL (v14+) – Hosted on Supabase.
- **File Storage:** AWS S3 – For storing uploaded resume PDFs.
- **Session Management:** Supabase will manage anonymous `sessions` table to link uploaded files to a processing job without user accounts.

## 4. Package Manager & Deployment
- **Package Manager:** `pnpm`
- **Frontend Hosting:** Vercel (or AWS S3 + CloudFront).
- **Backend Hosting:** AWS Lambda (via Serverless Framework or Vercel Functions).
- **Deployment Tool:** `serverless` CLI (v3.x) for AWS Lambda deployment, or integrated Vercel deployment.

## 5. Development Environment Setup Steps
1.  **Clone Repository:** `git clone [repo-url]`
2.  **Install Dependencies:** `pnpm install` — project uses `pnpm` as the package manager. Do not use `npm install` or `yarn install`; doing so will create a conflicting lockfile.
3.  **Set Up Supabase:**
    - Create a new project on Supabase.
    - Run the initial schema SQL (from `Data Model` document) in the Supabase SQL editor.
4.  **Set Up AWS:**
    - Create an S3 bucket for file uploads (e.g., `recruitscorer-uploads`).
    - Create an IAM user with programmatic access and attach policies for `AmazonS3FullAccess` (or more restrictive).
5.  **Obtain API Keys:**
    - Get a Gemini API key from Google AI Studio.
    - Get Supabase `anon` and `service_role` keys.
6.  **Configure Environment Variables:**
    - Create a `.env.local` file in the project root.
    - Populate with variables listed below.

## 6. Environment Variables Required
| Variable Name | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public URL of your Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public "anon" key for client-side Supabase calls. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key for server-side operations (e.g., inserting session). |
| `GEMINI_API_KEY` | API key for Google Gemini API. |
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key. |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key. |
| `AWS_REGION` | AWS region (e.g., `us-east-1`). |
| `S3_BUCKET_NAME` | Name of the S3 bucket for file storage. |
