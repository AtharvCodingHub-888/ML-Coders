/**
 * challenges.js
 * Predefined, structured challenges for each learning concept.
 * Ordered from easiest to hardest with descriptive instructions.
 */

export const CHALLENGES = {
    // ───────────────────────────────────────────────
    // LEVEL 1: VARIABLES — multi-round type identification
    // ───────────────────────────────────────────────
    variables: [
        {
            id: 'round1',
            target: 'str',
            question: 'Which data type stores text like a name or a sentence?',
            hint: 'Think: "Hello World" is assigned with quotes. It\'s text — not a number, not True/False.',
        },
        {
            id: 'round2',
            target: 'int',
            question: 'You need to store the count of training samples (e.g. 1500). Which type?',
            hint: 'Counting always uses whole numbers. No decimals needed.',
        },
        {
            id: 'round3',
            target: 'bool',
            question: 'A model flag: "Is training complete?" — which type holds this state?',
            hint: 'It can only be True or False. Two possible values.',
        },
        {
            id: 'round4',
            target: 'float',
            question: 'A learning rate of 0.001 must be stored. Which type handles decimal precision?',
            hint: 'Floats handle decimal numbers. Ints cannot store 0.001.',
        },
    ],

    // ───────────────────────────────────────────────
    // VECTORS — magnitude & angle matching
    // ───────────────────────────────────────────────
    vectors: [
        {
            target: { mag: 7, angle: 45 },
            intro: "Target: magnitude 7 at 45° (north-east). Start rough, then fine-tune.",
            hint: "45° is exactly halfway between right (0°) and up (90°)."
        },
        {
            target: { mag: 5, angle: 180 },
            intro: "Target: magnitude 5 pointing exactly LEFT (180°).",
            hint: "180° means the vector faces the opposite of 0° (which is right)."
        },
        {
            target: { mag: 9, angle: 270 },
            intro: "Target: magnitude 9 pointing STRAIGHT DOWN (270°).",
            hint: "270° is three-quarters of a full rotation counterclockwise."
        },
        {
            target: { mag: 3, angle: 135 },
            intro: "Target: magnitude 3 at 135° (north-west). Precise calibration required.",
            hint: "135° is between 90° (up) and 180° (left). Half of that range."
        },
        {
            target: { mag: 6, angle: 315 },
            intro: "Final target: magnitude 6 at 315° (south-east diagonal).",
            hint: "315° = 360° - 45°. It's the mirror of 45° but pointing down-right."
        },
    ],

    // ───────────────────────────────────────────────
    // MEAN / VARIANCE — reading distributions
    // ───────────────────────────────────────────────
    mean_variance: [
        {
            points: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
            trueMean: 0,
            variance: 330,
            varianceLabel: 'Low',
            intro: "Balanced distribution. Points span evenly from -5 to +5.",
            hint: "With equal numbers on both sides, the mean is the midpoint: 0."
        },
        {
            points: [2, 3, 2, 4, 3, 8, 9, 8, 10, 9],
            trueMean: 5.8,
            variance: 936,
            varianceLabel: 'High',
            intro: "Bimodal distribution: two clusters at 2–4 and 8–10.",
            hint: "High variance — points scatter far. Mean ≈ midpoint between the two clusters."
        },
        {
            points: [1, 1.1, 0.9, 1.2, 0.8, 1, 1.1, 0.9, 1.2, 0.8],
            trueMean: 1,
            variance: 20,
            varianceLabel: 'Low',
            intro: "Super tight cluster near 1.0. Very small spread.",
            hint: "All values hover around 1.0 — the mean is right there. Variance is tiny."
        },
        {
            points: [-8, -1, 0, 7, 3, -4, 5, 2, -6, 2],
            trueMean: 0,
            variance: 1900,
            varianceLabel: 'High',
            intro: "Wild scatter from -8 to +7. Find the true center.",
            hint: "Sum all values: (-8)+(-1)+0+7+3+(-4)+5+2+(-6)+2 = 0. Divide by 10 = 0."
        },
    ],

    // ───────────────────────────────────────────────
    // LOOPS — iteration count & type-safety prediction
    // ───────────────────────────────────────────────
    loops: [
        {
            target: 4,
            t1: "int",
            t2: "int",
            intro: "Simple safe loop. Count iterations and check type safety.",
            hint: "range(4) runs 4 times: i=0,1,2,3. Both types are int — safe!"
        },
        {
            target: 6,
            t1: "str",
            t2: "int",
            intro: "Watch out! A type is reassigned mid-loop.",
            hint: "range(6) = 6 iterations. But str ≠ int → TYPE MISMATCH!"
        },
        {
            target: 3,
            t1: "float",
            t2: "float",
            intro: "Float type, few iterations. Precision matters.",
            hint: "range(3) = 3 iterations. float = float → SAFE."
        },
        {
            target: 8,
            t1: "bool",
            t2: "int",
            intro: "Logic flag assigned an integer value. Is this safe?",
            hint: "range(8) = 8 iterations. bool ≠ int in strict typing → MISMATCH."
        },
        {
            target: 5,
            t1: "float",
            t2: "int",
            intro: "A float variable gets reassigned to an exact integer. Safe?",
            hint: "range(5) = 5 iterations. float ≠ int → technically MISMATCH (strict mode)."
        },
    ],

    // ───────────────────────────────────────────────
    // LINEAR REGRESSION — slope + bias fitting
    // ───────────────────────────────────────────────
    linear_regression: [
        {
            points: [
                { x: -2, y: -2.1 }, { x: -1, y: -0.9 }, { x: 0, y: 0.1 },
                { x: 1, y: 1.2 }, { x: 2, y: 1.9 }
            ],
            intro: "Positive trend. Slope ≈ 1, bias ≈ 0. Classic y = x.",
            hint: "When x doubles, y doubles. Set slope near 1 and bias near 0."
        },
        {
            points: [
                { x: -2, y: 4.1 }, { x: -1, y: 2.1 }, { x: 0, y: 0.2 },
                { x: 1, y: -1.9 }, { x: 2, y: -3.8 }
            ],
            intro: "Negative slope! As x increases, y decreases steeply.",
            hint: "y ≈ -2x. Drag slope to the left (negative) and bias stays near 0."
        },
        {
            points: [
                { x: -2, y: 1 }, { x: -1, y: 1.1 }, { x: 0, y: 0.9 },
                { x: 1, y: 1 }, { x: 2, y: 0.9 }
            ],
            intro: "Horizontal line. Slope = 0. Only bias matters here.",
            hint: "All y values are near 1. Set slope to 0, bias to 1."
        },
        {
            points: [
                { x: -2, y: -3.5 }, { x: -1, y: -1 }, { x: 0, y: 1.8 },
                { x: 1, y: 4.3 }, { x: 2, y: 6.5 }
            ],
            intro: "Steeper positive trend with an upward offset.",
            hint: "Rise is ~2.5 per x unit → slope ≈ 2.5. Line starts around y=2 at x=0 → bias ≈ 2."
        },
    ],

    // ───────────────────────────────────────────────
    // CLASSIFICATION — decision boundary placement
    // ───────────────────────────────────────────────
    classification: [
        {
            points: [
                { x: -2, y: -2, label: 'A' }, { x: -3, y: -1, label: 'A' }, { x: -1, y: -3, label: 'A' },
                { x: 2, y: 2, label: 'B' }, { x: 3, y: 1, label: 'B' }, { x: 1, y: 3, label: 'B' }
            ],
            intro: "Class A in bottom-left, Class B in top-right. Draw a diagonal separator.",
            hint: "Rotate angle to ~45°, keep offset near 0. The line should pass through the center."
        },
        {
            points: [
                { x: -4, y: 2, label: 'A' }, { x: -3, y: 3, label: 'A' }, { x: -2, y: 4, label: 'A' },
                { x: 4, y: -2, label: 'B' }, { x: 3, y: -3, label: 'B' }, { x: 2, y: -4, label: 'B' }
            ],
            intro: "A is top-left, B is bottom-right. Angled separation needed.",
            hint: "The classes are diagonally opposite. Angle ≈ 135°, offset ≈ 0."
        },
        {
            points: [
                { x: 0, y: 1, label: 'A' }, { x: 1, y: 2, label: 'A' }, { x: -1, y: 2, label: 'A' },
                { x: 0, y: -1, label: 'B' }, { x: 1, y: -2, label: 'B' }, { x: -1, y: -2, label: 'B' }
            ],
            intro: "A is above, B is below. A pure horizontal split should work.",
            hint: "Set angle to ~90° (vertical normal = horizontal split). Offset near 0."
        },
        {
            points: [
                { x: -3, y: 0, label: 'A' }, { x: -4, y: 1, label: 'A' }, { x: -2, y: -1, label: 'A' },
                { x: 3, y: 0, label: 'B' }, { x: 4, y: -1, label: 'B' }, { x: 2, y: 1, label: 'B' }
            ],
            intro: "Pure left/right split. Class A on the left, B on the right.",
            hint: "Rotate angle to ~0° (vertical line). Offset near 0 places the line between them."
        },
    ],

    // ───────────────────────────────────────────────
    // NEURAL NETWORKS — weight routing puzzles
    // ───────────────────────────────────────────────
    neural_networks: [
        {
            inputs: [1, 1],
            target: [1, 0],
            intro: "Activate Output 1 ONLY. Route the signal through the correct path.",
            hint: "You need H1 active (W[0] or W[1] > 0.7) AND W[2] > 0.7 (H1→O1). Keep W[3] LOW."
        },
        {
            inputs: [1, 1],
            target: [0, 1],
            intro: "Activate Output 2 ONLY. The other output must stay silent.",
            hint: "H1 must fire AND W[3] > 0.7 (H1→O2). Keep W[2] LOW to silence O1."
        },
        {
            inputs: [1, 1],
            target: [1, 1],
            intro: "Both outputs must fire simultaneously — maximum throughput.",
            hint: "H1 must fire AND both W[2] and W[3] must exceed 0.7."
        },
        {
            inputs: [1, 1],
            target: [0, 0],
            intro: "SILENCE the network. Neither output should activate.",
            hint: "Keep ALL weights below 0.7, or ensure H1 never fires. W[0] and W[1] must stay LOW."
        },
    ],
};
