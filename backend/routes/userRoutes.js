import express from "express";
import prisma from "../db.js";
const router = express.Router();

// POST /api/users/progress
router.post("/progress", async (req, res) => {
    const { userId, courseSlug, phaseId, xpEarned = 10 } = req.body;

    try {
        // 1. Verify if the user already completed this specific phase
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_courseSlug_phaseId: {
                    userId,
                    courseSlug,
                    phaseId
                }
            }
        });

        if (existingProgress) {
            return res.status(400).json({ message: "Phase already completed. No extra XP awarded." });
        }

        // 2. Transaction: Save progress AND increment XP simultaneously
        const [newProgress, updatedUser] = await prisma.$transaction([
            prisma.userProgress.create({
                data: { userId, courseSlug, phaseId, xpEarned }
            }),
            prisma.user.update({
                where: { id: userId },
                data: { totalXp: { increment: xpEarned } }
            })
        ]);

        res.status(200).json({
            message: "Phase completed! XP awarded.",
            newTotalXp: updatedUser.totalXp,
            progress: newProgress
        });

    } catch (error) {
        console.error("❌ Progress API Error:", error);
        res.status(500).json({ error: "Internal server error while saving progress." });
    }
});

export default router;
