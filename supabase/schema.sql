-- =============================================
--  ELEARN ML — Supabase Schema
--  Run this in your Supabase SQL Editor
-- =============================================

-- 1. User Profiles (synced from NextAuth on login)
CREATE TABLE IF NOT EXISTS profiles (
    id          TEXT PRIMARY KEY,           -- NextAuth user id (token.sub)
    email       TEXT UNIQUE NOT NULL,
    name        TEXT,
    avatar_url  TEXT,
    xp          INTEGER DEFAULT 0,
    level       INTEGER DEFAULT 1,
    rank_title  TEXT DEFAULT 'Beginner',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses
CREATE TABLE IF NOT EXISTS courses (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL CHECK (category IN ('mathematics', 'python', 'ml')),
    color       TEXT NOT NULL DEFAULT 'blue',
    icon        TEXT NOT NULL DEFAULT 'Code',
    sort_order  INTEGER DEFAULT 0,
    is_locked   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Course Phases (lesson content within a course)
CREATE TABLE IF NOT EXISTS course_phases (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id        UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    phase_number     INTEGER NOT NULL,
    title            TEXT NOT NULL,
    content_markdown TEXT NOT NULL DEFAULT '',
    is_locked        BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, phase_number)
);

-- 4. User Progress (tracks completion per phase)
CREATE TABLE IF NOT EXISTS user_progress (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    phase_id      UUID NOT NULL REFERENCES course_phases(id) ON DELETE CASCADE,
    completed     BOOLEAN DEFAULT FALSE,
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, phase_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_course_phases_course ON course_phases(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user   ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON user_progress(user_id, course_id);

-- Enable Row-Level Security (RLS)
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_phases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  ENABLE ROW LEVEL SECURITY;

-- Public read for courses & phases (everyone can see the catalog)
CREATE POLICY "Courses are publicly readable"
    ON courses FOR SELECT USING (true);

CREATE POLICY "Course phases are publicly readable"
    ON course_phases FOR SELECT USING (true);

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid()::text = id);

-- Allow insert from service role (NextAuth callback)
CREATE POLICY "Service can insert profiles"
    ON profiles FOR INSERT WITH CHECK (true);

-- Progress: users can manage their own progress
CREATE POLICY "Users can view own progress"
    ON user_progress FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own progress"
    ON user_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress"
    ON user_progress FOR UPDATE USING (auth.uid()::text = user_id);

-- Also allow anon access for when NextAuth manages auth (no Supabase auth)
-- This is needed because we use NextAuth, not Supabase Auth
CREATE POLICY "Anon can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Anon can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update profiles" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Anon can read progress" ON user_progress FOR SELECT USING (true);
CREATE POLICY "Anon can insert progress" ON user_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update progress" ON user_progress FOR UPDATE USING (true);
