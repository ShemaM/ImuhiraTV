-- ============================================================================
-- SQL Script to Drop All Tables and Reset Database
-- Project: Imuhira (formerly daily-pulse)
-- ============================================================================
-- WARNING: This script will permanently delete ALL tables and their data.
-- Make sure you have a backup if you need to preserve any data.
-- ============================================================================

-- First, drop the tables (order matters due to foreign key constraints)
-- Drop dependent tables first (those with foreign keys)
DROP TABLE IF EXISTS debate_arguments CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS debates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any custom enum types that were created
DROP TYPE IF EXISTS debate_status CASCADE;
DROP TYPE IF EXISTS faction CASCADE;

-- ============================================================================
-- Optional: Drop any other tables that might exist from the old daily-pulse project
-- Uncomment these lines if needed
-- ============================================================================
-- DROP TABLE IF EXISTS articles CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS tags CASCADE;

-- ============================================================================
-- Alternative: Nuclear Option - Drop ALL tables in public schema
-- Use this if you want to ensure everything is deleted regardless of what exists
-- ============================================================================
/*
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Set session_replication_role to 'replica' to temporarily disable:
    -- - All triggers (including foreign key constraint triggers)
    -- - Replication-related checks
    -- This allows us to drop tables in any order without FK constraint errors.
    -- IMPORTANT: Must be reset to 'DEFAULT' after completion.
    SET session_replication_role = replica;
    
    BEGIN
        -- Drop all tables in the public schema
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
        LOOP
            EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        
        -- Drop all custom types/enums in the public schema
        FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid 
                  WHERE n.nspname = 'public' AND t.typtype = 'e')
        LOOP
            EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
    EXCEPTION
        WHEN OTHERS THEN
            -- Ensure session_replication_role is always reset even on error
            SET session_replication_role = DEFAULT;
            RAISE;
    END;
    
    -- Re-enable triggers and constraints
    SET session_replication_role = DEFAULT;
END $$;
*/

-- ============================================================================
-- Verify: List remaining tables (should be empty after running the script)
-- Run this query to verify all tables have been dropped
-- ============================================================================
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid 
--        WHERE n.nspname = 'public' AND t.typtype = 'e';

-- ============================================================================
-- DONE! Your database is now ready for the new Imuhira schema.
-- You can now run: npm run db:push or npx drizzle-kit push
-- to create the new tables based on the schema in db/schema.ts
-- ============================================================================
