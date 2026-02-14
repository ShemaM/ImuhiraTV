-- ============================================================================
-- SQL Script to Add Translation Columns to Existing Tables
-- Project: ImuhiraTV
-- ============================================================================
-- This script adds missing translation columns for i18n support.
-- Run this on your existing database to enable multi-language content.
-- ============================================================================

-- ============================================================================
-- STEP 1: Add translation columns to debates table
-- ============================================================================

-- Swahili (sw) translations
ALTER TABLE debates ADD COLUMN IF NOT EXISTS title_sw TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS summary_sw TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS proposer_arguments_sw TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS opposer_arguments_sw TEXT;

-- French (fr) translations
ALTER TABLE debates ADD COLUMN IF NOT EXISTS title_fr TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS summary_fr TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS proposer_arguments_fr TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS opposer_arguments_fr TEXT;

-- Kinyamulenge (kym) translations
ALTER TABLE debates ADD COLUMN IF NOT EXISTS title_kym TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS summary_kym TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS proposer_arguments_kym TEXT;
ALTER TABLE debates ADD COLUMN IF NOT EXISTS opposer_arguments_kym TEXT;

-- ============================================================================
-- STEP 2: Add translation columns to articles table
-- ============================================================================

-- Swahili (sw) translations
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_sw TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_sw TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_sw TEXT;

-- French (fr) translations
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_fr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_fr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_fr TEXT;

-- Kinyamulenge (kym) translations
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_kym TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_kym TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_kym TEXT;

-- ============================================================================
-- DONE! Translation columns have been added.
-- ============================================================================
