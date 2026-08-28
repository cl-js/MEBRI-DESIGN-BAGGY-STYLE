import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ProjectGallery from "@/components/home/ProjectGallery";
import PhilosophySection from "@/components/home/PhilosophySection";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

const HERO_IMAGE = "https://i.imgur.com/Iz9Or1a.png";

export default function Home() {
  return <HomeContent />;
}

function HomeContent() {
  const { language, text } = useLanguage();

  return (
    <div>
      <HeroSection key={language} heroImage={HERO_IMAGE} />
      <ProjectGallery />
      <PhilosophySection />
      <div className="flex justify-end border-t border-border px-6 py-10 md:px-8">
        <Link to="/admin" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
          {text.admin}
        </Link>
      </div>
    </div>
  );
}