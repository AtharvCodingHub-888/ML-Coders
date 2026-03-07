import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black -z-10" />

            <SplashScreen />
            <TopNav />
            <HeroSection />
            <FeatureCards />
        </main>
    );
}
