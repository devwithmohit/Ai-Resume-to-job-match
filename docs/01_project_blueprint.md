# 01 Project Blueprint

<!-- Add your content here -->
# Project Blueprint: AI Resume-to-Job Match Scorer

## 1. Project Definition
- **Project Name:** RecruitScorer (Working Title)
- **One-Sentence Summary:** A tool that helps recruiters instantly rank and score candidates by pasting a job description and uploading resumes (PDFs), powered by AI.
- **Elevator Pitch:** Stop manually comparing resumes to job descriptions. RecruitScorer automates the initial screening process, providing ranked lists, match scores, and detailed reasoning in seconds, allowing recruiters to focus on interviewing the best talent, not reading every resume.

## 2. Problem & Target User
- **Problem Being Solved:** Recruiters spend 50-70% of their time manually screening resumes against job descriptions, a process that is slow, inconsistent, and prone to human bias.
- **Target User:**
    - Small HR agencies managing multiple clients with high-volume screening.
    - Startup founders hiring their first 10-20 employees and lacking a dedicated HR team.
    - Freelance recruiters who need to quickly deliver shortlists to clients.

## 3. Core Features
**Must-Have (MVP)**
- **JD Input:** Ability for a user to paste a job description into a text field.
- **Resume Upload:** Functionality to upload multiple PDF resumes simultaneously.
- **Automated Processing:** Backend system that extracts text from PDFs.
- **AI Scoring:** Integration with Gemini API to compare each resume text against the JD to generate a numerical match score and a textual reasoning summary.
- **Ranked Results Dashboard:** A simple web interface displaying a sortable list of candidates (using filenames) with their scores and reasoning.
- **CSV Export:** A button to download the results (rank, filename, score, reasoning) as a CSV file.
- **Session-Based Workflow:** A unique session ID for each processing job, allowing results to be accessed without requiring user accounts.

**Nice-to-Have (Post-MVP)**
- User accounts to save history.
- Support for .docx and .txt file uploads.
- Option to compare against multiple JDs (e.g., find candidates suitable for any of 3 open roles).
- "Explain Score" feature to highlight key matching phrases in the resume.

## 4. Out-of-Scope Items (for MVP)
- **User Accounts / Authentication:** No login or sign-up process for the initial tool.
- **LinkedIn Profile Parsing:** Handling anything other than PDF files.
- **Integration with External ATS:** No direct integration with Lever, Greenhouse, etc.
- **Bulk API:** No programmatic access for agencies.
- **Payment Processing:** Monetization will be handled manually via a "contact us for access" model or a simple Stripe link outside the core tool flow for the initial launch.
- **Editing or Resumes:** No feature to edit resume data or manually override scores.

## 5. Success Criteria
- **Functional:** A user can paste a JD, upload 10 PDFs, and receive a ranked list with scores and reasoning within 60 seconds.
- **Business:** Achieve 15 monthly subscribers OR 100 one-time pay-per-use users, resulting in ~$1,200 in monthly recurring revenue (MRR) or total revenue.
- **User Satisfaction:** 3 small recruitment agencies provide positive testimonials about the tool's time-saving capabilities.

## 6. Constraints
- **Timeline:** 4 weeks to MVP launch (as per execution plan).
- **Budget:** Minimal. Target to use free tiers (Supabase, AWS Free Tier) for as long as possible, with primary cost being Gemini API usage.
- **Team Size:** 1 (Solo Founder/Developer).
