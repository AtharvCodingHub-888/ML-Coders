"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * Reusable hook for tracking course phase completion.
 * @param courseSlug - The slug of the course (e.g. "linear-algebra")
 * @param totalPhases - Total number of phases on the UI (used for clamping)
 */
export function useProgressTracking(courseSlug: string, totalPhases: number) {
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id;

    const [activePhase, setActivePhase] = useState(1);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [phaseIds, setPhaseIds] = useState<string[]>([]);
    const [completedPhases, setCompletedPhases] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured() || !supabase) {
            setLoading(false);
            return;
        }

        supabase
            .from("courses")
            .select("id")
            .eq("slug", courseSlug)
            .single()
            .then(({ data: course }) => {
                if (!course || !supabase) {
                    setLoading(false);
                    return;
                }
                setCourseId(course.id);

                supabase
                    .from("course_phases")
                    .select("id, phase_number")
                    .eq("course_id", course.id)
                    .order("phase_number")
                    .then(({ data: phasesData }) => {
                        if (phasesData) {
                            setPhaseIds(phasesData.map((p) => p.id));
                        }
                    });

                if (userId) {
                    supabase
                        .from("user_progress")
                        .select("phase_id")
                        .eq("user_id", userId)
                        .eq("course_id", course.id)
                        .eq("completed", true)
                        .then(({ data: progressData }) => {
                            if (progressData) {
                                // Assume phaseIds maps phaseNumber - 1 to phase_id
                                const completed = progressData.map((p) => {
                                    const idx = phaseIds.findIndex(id => id === p.phase_id);
                                    return idx !== -1 ? idx + 1 : -1;
                                }).filter(n => n > 0);
                                setCompletedPhases(completed);
                            }
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            });
    }, [session, courseSlug, userId]);

    const markPhaseComplete = async (phaseNumber: number) => {
        if (!courseId || !userId || phaseIds.length === 0) return;
        const phaseIndex = Math.min(phaseNumber - 1, phaseIds.length - 1);
        const phaseId = phaseIds[phaseIndex];
        if (!phaseId || completedPhases.includes(phaseNumber)) return;

        setIsMarkingComplete(true);
        try {
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course_id: courseId, phase_id: phaseId }),
            });
            if (res.ok) {
                setCompletedPhases((prev) => [...prev, phaseNumber]);
                
                await fetch("/api/ml/models", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: `${courseSlug}-phase-${phaseNumber}`,
                        type: "course_completion",
                        parameters: { course: courseSlug, phase: phaseNumber },
                        accuracy: 1.0
                    })
                }).catch(() => {});
            }
        } catch (err) {
            console.error("Failed to mark complete:", err);
        } finally {
            setIsMarkingComplete(false);
        }
    };

    return {
        activePhase,
        setActivePhase,
        completedPhases,
        loading,
        markPhaseComplete,
        isMarkingComplete,
    };
}
