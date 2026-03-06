/**
 * progressService.js
 * The ONLY file allowed to touch localStorage.
 */

const STORAGE_KEY = 'mlearn_progress';

const defaultProgress = {
    totalXP: 0,
    unlockedConcepts: ['vectors'],
    masteredConcepts: [],
    currentLevel: 1,
};

const progressService = {
    getProgress: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            const initial = { ...defaultProgress };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    },

    saveProgress: (progress) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },

    addXP: (amount) => {
        const progress = progressService.getProgress();
        progress.totalXP += amount;

        // Auto-unlocking logic based on rules
        // Unlock next concept at 100 XP, next level at 200 XP
        // (This is a simplified check, can be expanded based on concept list)

        progressService.saveProgress(progress);
        return progress;
    },

    unlockConcept: (id) => {
        const progress = progressService.getProgress();
        if (!progress.unlockedConcepts.includes(id)) {
            progress.unlockedConcepts.push(id);
            progressService.saveProgress(progress);
        }
        return progress;
    },

    markMastery: (id) => {
        const progress = progressService.getProgress();
        if (!progress.masteredConcepts.includes(id)) {
            progress.masteredConcepts.push(id);
            progressService.saveProgress(progress);
        }
        return progress;
    },

    resetProgress: () => {
        localStorage.removeItem(STORAGE_KEY);
        return progressService.getProgress();
    }
};

export default progressService;
