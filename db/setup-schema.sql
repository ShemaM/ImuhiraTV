-- ============================================================================
-- SQL Script to Create All Tables and Setup Database
-- Project: ImuhiraTV
-- ============================================================================
-- This script creates all necessary tables, enums, and constraints for the
-- ImuhiraTV application. It is safe to run on an empty database or one where
-- tables have been dropped.
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Enum Types
-- ============================================================================

-- Create debate_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE debate_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create faction enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE faction AS ENUM ('idubu', 'akagara');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- STEP 2: Create Tables
-- ============================================================================

-- Users table (basic user information)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    phone VARCHAR(256)
);

-- Debates table (stores debate posts derived from YouTube interviews)
CREATE TABLE IF NOT EXISTS debates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    topic TEXT NOT NULL,
    summary TEXT,
    verdict TEXT NOT NULL,
    youtube_video_id VARCHAR(50),
    youtube_video_title VARCHAR(500),
    main_image_url TEXT,
    author_name VARCHAR(255) DEFAULT 'Imuhira Staff',
    status debate_status DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

-- Debate Arguments table (stores individual arguments from both factions)
CREATE TABLE IF NOT EXISTS debate_arguments (
    id SERIAL PRIMARY KEY,
    debate_id INTEGER NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    faction faction NOT NULL,
    speaker_name VARCHAR(255),
    argument TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Create Indexes for Better Performance
-- ============================================================================

-- Index for faster slug lookups (used in the debate page)
CREATE INDEX IF NOT EXISTS idx_debates_slug ON debates(slug);

-- Index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_debates_status ON debates(status);

-- Index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_debates_created_at ON debates(created_at);

-- Index for faster argument lookups by debate_id
CREATE INDEX IF NOT EXISTS idx_debate_arguments_debate_id ON debate_arguments(debate_id);

-- Index for faction filtering
CREATE INDEX IF NOT EXISTS idx_debate_arguments_faction ON debate_arguments(faction);

-- ============================================================================
-- STEP 4: Enable Row Level Security (Optional for Supabase)
-- ============================================================================
-- Uncomment these lines if you want to enable RLS for Supabase

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE debate_arguments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Create Policies (Optional for Supabase)
-- ============================================================================
-- These policies allow public read access to published debates
-- Uncomment and customize as needed

-- Policy: Anyone can read published debates
-- CREATE POLICY "Public can read published debates" ON debates
--     FOR SELECT
--     USING (status = 'published');

-- Policy: Anyone can read arguments of published debates
-- CREATE POLICY "Public can read debate arguments" ON debate_arguments
--     FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM debates 
--             WHERE debates.id = debate_arguments.debate_id 
--             AND debates.status = 'published'
--         )
--     );

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Run these queries to verify the setup was successful:

-- List all tables:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- List all enum types:
-- SELECT typname FROM pg_type t 
-- JOIN pg_namespace n ON t.typnamespace = n.oid 
-- WHERE n.nspname = 'public' AND t.typtype = 'e';

-- Describe debates table:
-- \d debates;

-- Describe debate_arguments table:
-- \d debate_arguments;

-- ============================================================================
-- DONE! Your database schema is ready for ImuhiraTV.
-- ============================================================================
