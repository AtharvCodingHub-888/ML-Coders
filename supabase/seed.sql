-- =============================================
--  ELEARN ML — Seed Data
--  Run AFTER schema.sql in the Supabase SQL Editor
-- =============================================

-- ─── Mathematics Courses ──────────────────────

INSERT INTO courses (slug, title, category, color, icon, sort_order, is_locked) VALUES
    ('linear-algebra',          'Linear Algebra',           'mathematics', 'blue',   'Sigma', 1, false),
    ('probability-statistics',  'Probability & Statistics', 'mathematics', 'blue',   'Sigma', 2, false),
    ('calculus-ml',             'Calculus for ML',          'mathematics', 'blue',   'Sigma', 3, true),
    ('optimization-theory',     'Optimization Theory',      'mathematics', 'blue',   'Sigma', 4, true);

-- ─── Python Courses ───────────────────────────

INSERT INTO courses (slug, title, category, color, icon, sort_order, is_locked) VALUES
    ('python-foundation',  'Python Core Foundations',         'python', 'green',  'Code', 1, false),
    ('oop-masterclass',    'Object Oriented Programming',     'python', 'green',  'Code', 2, false),
    ('data-manipulation',  'Data Manipulation (Pandas)',       'python', 'green',  'Code', 3, true),
    ('numerical-python',   'Numerical Python (NumPy)',         'python', 'green',  'Code', 4, true);

-- ─── Machine Learning Courses ─────────────────

INSERT INTO courses (slug, title, category, color, icon, sort_order, is_locked) VALUES
    ('supervised-learning',  'Supervised Learning',            'ml', 'purple', 'BrainCircuit', 1, true),
    ('neural-networks',      'Neural Networks & Backprop',     'ml', 'purple', 'BrainCircuit', 2, true),
    ('deep-learning',        'Deep Learning Architectures',    'ml', 'purple', 'BrainCircuit', 3, true),
    ('model-evaluation',     'Model Evaluation & Metrics',     'ml', 'purple', 'BrainCircuit', 4, true);

-- ─── Python Foundation Phases ─────────────────

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 1, 'Variables & Memory',
    E'### 1. Variables & Memory\n\nIn Python, a variable is just a label pointing to a box in the computer''s memory. When you type `x = 10`, Python creates a 3D memory block and stores 10 inside it.\n\nPython manages this memory automatically, but understanding that variables are **references** to objects is key to avoiding bugs!'
FROM courses WHERE slug = 'python-foundation';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 2, 'Control Flow',
    E'### 2. Control Flow (Loops)\n\nA `for` loop iterates over a sequence. Think of it as a machine stepping through data points one by one.\n\n```python\nfor i in range(5):\n    print(i)\n```\n\nEach step of the loop moves the ''pointer'' to the next item in memory.'
FROM courses WHERE slug = 'python-foundation';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 3, 'Lists (Data Structures)',
    E'### 3. Lists (Data Structures)\n\nA List is a dynamic array in memory. When you use `.append()`, Python physically allocates a new block of memory and links it to the chain.\n\n```python\nmy_list = [1, 2, 3]\nmy_list.append(4)\n```'
FROM courses WHERE slug = 'python-foundation';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 4, 'Functions',
    E'### 4. Functions\n\nA function is a reusable machine. Data goes into the parameters (Inputs), gets transformed by the logic, and comes out the return statement (Output).\n\n```python\ndef square(n):\n    return n * n\n```'
FROM courses WHERE slug = 'python-foundation';

-- ─── Linear Algebra Phases ────────────────────

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 1, 'Vectors & Spaces',
    E'### 1. Vectors & Spaces\n\nA vector is a quantity with both magnitude and direction. In ML, we represent data points as vectors in high-dimensional space.\n\n```python\nimport numpy as np\nv = np.array([1, 2, 3])\n```'
FROM courses WHERE slug = 'linear-algebra';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 2, 'Matrix Operations',
    E'### 2. Matrix Operations\n\nMatrices are the backbone of ML. Every neural network layer is essentially a matrix multiplication.\n\n```python\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nC = A @ B  # Matrix multiply\n```'
FROM courses WHERE slug = 'linear-algebra';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 3, 'Eigenvalues & Eigenvectors',
    E'### 3. Eigenvalues & Eigenvectors\n\nEigenvectors reveal the principal directions of a transformation. PCA uses them to reduce dimensionality.\n\nFor matrix **A**, an eigenvector **v** satisfies: `Av = λv`'
FROM courses WHERE slug = 'linear-algebra';

-- ─── Probability & Statistics Phases ──────────

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 1, 'Probability Basics',
    E'### 1. Probability Basics\n\nProbability quantifies uncertainty. In ML, we use it to model predictions and make decisions under uncertainty.\n\nBayes'' Theorem: `P(A|B) = P(B|A) * P(A) / P(B)`'
FROM courses WHERE slug = 'probability-statistics';

INSERT INTO course_phases (course_id, phase_number, title, content_markdown)
SELECT id, 2, 'Distributions',
    E'### 2. Distributions\n\nA probability distribution describes how likely different outcomes are. The Normal (Gaussian) distribution is fundamental to ML.\n\n```python\nimport scipy.stats as stats\nnormal = stats.norm(loc=0, scale=1)\n```'
FROM courses WHERE slug = 'probability-statistics';
