-- ============================================================================
-- SQL Script to Create All Tables and Setup Database
-- Project: ImuhiraTV
-- ============================================================================
-- This script creates all necessary tables, enums, and constraints for the
-- ImuhiraTV application. It is safe to run on an empty database or one where
-- tables have been dropped.
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Tables (matches db/schema.ts)
-- ============================================================================

-- Debates table (stores debate posts with i18n support)
CREATE TABLE IF NOT EXISTS debates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    proposer_name TEXT NOT NULL,
    proposer_arguments TEXT NOT NULL,
    opposer_name TEXT NOT NULL,
    opposer_arguments TEXT NOT NULL,
    youtube_video_id TEXT,
    main_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    slug TEXT UNIQUE,
    
    -- Swahili (sw) translations
    title_sw TEXT,
    summary_sw TEXT,
    proposer_arguments_sw TEXT,
    opposer_arguments_sw TEXT,
    
    -- French (fr) translations
    title_fr TEXT,
    summary_fr TEXT,
    proposer_arguments_fr TEXT,
    opposer_arguments_fr TEXT,
    
    -- Kinyamulenge (kym) translations
    title_kym TEXT,
    summary_kym TEXT,
    proposer_arguments_kym TEXT,
    opposer_arguments_kym TEXT
);

-- Articles table (stores articles with i18n support)
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    
    -- Swahili (sw) translations
    title_sw TEXT,
    excerpt_sw TEXT,
    content_sw TEXT,
    
    -- French (fr) translations
    title_fr TEXT,
    excerpt_fr TEXT,
    content_fr TEXT,
    
    -- Kinyamulenge (kym) translations
    title_kym TEXT,
    excerpt_kym TEXT,
    content_kym TEXT,
    
    -- Shared Media & Metadata
    video_url TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table (for both debates and articles)
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    parent_id UUID,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT TRUE
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create Indexes for Better Performance
-- ============================================================================

-- Index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_debates_slug ON debates(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Index for is_published filtering
CREATE INDEX IF NOT EXISTS idx_debates_is_published ON debates(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);

-- Index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_debates_created_at ON debates(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_debates_category ON debates(category);

-- Index for comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_debate_id ON comments(debate_id);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);

-- ============================================================================
-- DONE! Your database schema is ready for ImuhiraTV.
-- ============================================================================
