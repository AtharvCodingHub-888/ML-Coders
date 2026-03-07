-- 1. Add the missing "Unsupervised Learning" module if it doesn't exist
INSERT INTO courses (title, slug, category, icon, is_locked, sort_order)
SELECT 'Unsupervised Learning', 'unsupervised-learning', 'ml', 'BrainCircuit', false, 2
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'unsupervised-learning');

-- 2. Ensure "Supervised Learning" has sort_order 1
UPDATE courses SET sort_order = 1 WHERE slug = 'supervised-learning';

-- 3. Lock the last 2 modules of Mathematics and Python
UPDATE courses SET is_locked = true WHERE slug IN (
    'calculus-ml',
    'optimization-theory',
    'data-manipulation',
    'numerical-python'
);

-- 4. Ensure other modules are unlocked (optional, based on user previously wanting everything unlocked)
UPDATE courses SET is_locked = false WHERE slug NOT IN (
    'calculus-ml',
    'optimization-theory',
    'data-manipulation',
    'numerical-python'
);

-- Verify results
SELECT title, slug, category, is_locked, sort_order FROM courses ORDER BY category, sort_order;
