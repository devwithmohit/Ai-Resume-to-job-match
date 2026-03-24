-- Migration: 001_init
-- Description: Initial database schema for AI Resume-to-Job Match Scorer

-- Enable the pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,

    CONSTRAINT check_session_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Table: resumes
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    score INTEGER,
    reasoning TEXT,
    processing_started_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,

    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    CONSTRAINT check_resume_score CHECK (score >= 0 AND score <= 100),
    CONSTRAINT check_resume_status CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
    CONSTRAINT unique_session_filename UNIQUE (session_id, original_filename)
);

-- Indexes for resumes table
CREATE INDEX IF NOT EXISTS idx_resumes_session_id ON resumes(session_id);
CREATE INDEX IF NOT EXISTS idx_resumes_status ON resumes(status);

-- Disable Row Level Security (RLS) for MVP as per build sequence specification
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
