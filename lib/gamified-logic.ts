/**
 * Shared logic for the gamified track XP and leveling system.
 */

export interface LevelThreshold {
    id: number;
    xp: number;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
    { id: 1, xp: 100 },
    { id: 2, xp: 250 },
    { id: 3, xp: 500 },
    { id: 4, xp: 750 },
    { id: 5, xp: 1300 },
];

/**
 * Calculates the current level based on total XP.
 * @param xp - The user's total XP
 * @returns The calculated level (default 1)
 */
export function calculateLevel(xp: number): number {
    // Start from the highest threshold and work down
    const sortedThresholds = [...LEVEL_THRESHOLDS].sort((a, b) => b.xp - a.xp);

    for (const threshold of sortedThresholds) {
        if (xp >= threshold.xp) {
            return threshold.id;
        }
    }

    return 1;
}
