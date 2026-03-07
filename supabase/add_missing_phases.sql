-- =============================================
--  ELEARN ML — Add Missing Phases
--  Run this in your Supabase SQL Editor
-- =============================================

-- Add missing phases for Linear Algebra (phases 4-8 don't exist yet)
INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT c.id, p.phase_number, p.title, p.content_markdown
FROM courses c
CROSS JOIN (
    VALUES
    (4, 'Matrices', '### Matrices\nA matrix is a collection of vectors representing a dataset.'),
    (5, 'Multiplication', '### Matrix Multiplication\nIn Neural Networks, we multiply data by weight matrices.'),
    (6, 'Transformations', '### Transformations\nMatrices represent linear transformations that scale, rotate, or shear space.'),
    (7, 'Eigenvectors', '### Eigenvectors\nAn Eigenvector remains on its span during a transformation.'),
    (8, 'Dimensionality Reduction (PCA)', '### PCA\nDimensionality Reduction finds the most important spans and discards the rest.')
) AS p(phase_number, title, content_markdown)
WHERE c.slug = 'linear-algebra'
ON CONFLICT (course_id, phase_number) DO NOTHING;

-- Add phases for Probability & Statistics (only has 2 phases, needs 4)
INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT c.id, p.phase_number, p.title, p.content_markdown
FROM courses c
CROSS JOIN (
    VALUES
    (3, 'Bayes Theorem', '### Bayes Theorem\nBayes Theorem updates our beliefs as new evidence emerges.'),
    (4, 'Statistical Inference', '### Statistical Inference\nDrawing conclusions about populations from sample data.')
) AS p(phase_number, title, content_markdown)
WHERE c.slug = 'probability-statistics'
ON CONFLICT (course_id, phase_number) DO NOTHING;

-- Add phases for OOP Masterclass (currently has 0 phases)
INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT c.id, p.phase_number, p.title, p.content_markdown
FROM courses c
CROSS JOIN (
    VALUES
    (1, 'Classes & Objects', '### Classes & Objects\nThe building blocks of OOP in Python.'),
    (2, 'Inheritance', '### Inheritance\nCreating specialized classes from general ones.'),
    (3, 'Polymorphism', '### Polymorphism\nUsing a unified interface for different data types.'),
    (4, 'Encapsulation', '### Encapsulation\nHiding internal details and exposing only what is necessary.')
) AS p(phase_number, title, content_markdown)
WHERE c.slug = 'oop-masterclass'
ON CONFLICT (course_id, phase_number) DO NOTHING;
