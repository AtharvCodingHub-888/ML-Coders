-- Lock the last 2 courses in Mathematics and Python
UPDATE courses SET is_locked = true WHERE slug IN (
    'calculus-ml',
    'optimization-theory',
    'data-manipulation',
    'numerical-python'
);

-- Verify
SELECT title, slug, category, is_locked FROM courses ORDER BY category, sort_order;
