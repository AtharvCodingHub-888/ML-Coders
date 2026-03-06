import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Full-screen Background Image */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="/bg-image.jpg"
                    className="w-full h-full object-cover opacity-90"
                    alt="Space Robot Background"
                />
            </div>

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-[#05050A]/40 -z-10" />

            {/* Navigation */}
            <TopNav />

            {/* Hero Section */}
            <HeroSection />

            {/* Feature Cards */}
            <FeatureCards />
        </main>
    );
}
