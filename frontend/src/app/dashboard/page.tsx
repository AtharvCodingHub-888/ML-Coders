"use client";

import TopNav from "@/components/dashboard/TopNav";
import CourseCard from "@/components/dashboard/CourseCard";
import { Sigma, Code, BrainCircuit } from "lucide-react";

const mathematicsTopics = [
    { title: "Linear Algebra", icon: Sigma, href: "/dashboard/courses/linear-algebra/master" },
    { title: "Probability & Statistics", icon: Sigma, href: "/dashboard/courses/probability-statistics/master" },
    { title: "Calculus for ML", icon: Sigma, isLocked: true },
    { title: "Optimization Theory", icon: Sigma, isLocked: true },
];

const pythonTopics = [
    { title: "Python Core Foundations", icon: Code, href: "/dashboard/courses/python-foundation/master" },
    { title: "Object Oriented Programming", icon: Code, href: "/dashboard/courses/oop-masterclass/master" },
    { title: "Data Manipulation (Pandas)", icon: Code, isLocked: true },
    { title: "Numerical Python (NumPy)", icon: Code, isLocked: true },
];

const mlTopics = [
    { title: "Supervised Learning", icon: BrainCircuit, href: "/dashboard/courses/supervised/master" },
    { title: "Unsupervised Learning", icon: BrainCircuit, href: "/dashboard/courses/unsupervised/master" },
    { title: "Neural Networks & Backprop", icon: BrainCircuit, href: "/dashboard/courses/neural-networks/master" },
    { title: "Deep Learning Architectures", icon: BrainCircuit, href: "/dashboard/courses/deep-learning/master" },
    { title: "Model Evaluation & Metrics", icon: BrainCircuit, href: "/dashboard/courses/evaluation/master" },
];

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-[#05050B] text-white relative overflow-hidden">
            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col min-h-screen">
                {/* Top Navbar - Sticky */}
                <TopNav />

                {/* Content - Vertical Scrolling */}
                <main className="flex-1 p-8 pt-10 overflow-y-auto">
                    <div className="max-w-5xl mx-auto flex flex-col gap-8">
                        {/* Header Section */}
                        <div className="mb-2">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome Back, Felix</h1>
                            <p className="text-white/40 text-sm font-medium">Continue your path to mastering Machine Learning.</p>
                        </div>

                        {/* Vertically Stacked Course Cards */}
                        <CourseCard
                            title="Mathematics"
                            color="blue"
                            subtopics={mathematicsTopics}
                        />

                        <CourseCard
                            title="Python"
                            color="green"
                            subtopics={pythonTopics}
                        />

                        <CourseCard
                            title="Machine Learning"
                            color="purple"
                            subtopics={mlTopics}
                        />

                        {/* Footer / Extra Stats */}
                        <div className="py-12 border-t border-white/5 mt-8 flex justify-between items-center opacity-50">
                            <p className="text-xs">© 2026 ELEARN ML — Premium Educational Experience</p>
                            <div className="flex gap-6 text-xs uppercase tracking-widest font-bold">
                                <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
