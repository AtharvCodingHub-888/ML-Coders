-- =============================================
--  ELEARN ML — Unlock All Courses
--  Run this in your Supabase SQL Editor
-- =============================================

-- Unlock all courses
UPDATE courses SET is_locked = false WHERE is_locked = true;

-- Verify
SELECT slug, is_locked FROM courses ORDER BY sort_order;
