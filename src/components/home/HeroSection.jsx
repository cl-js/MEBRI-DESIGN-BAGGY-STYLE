import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useProjectData } from "@/lib/ProjectDataContext";

export default function HeroSection() {
  const { projects } = useProjectData();
  const firstProject = projects[0];
  const heroImage = firstProject?.heroImage || firstProject?.image || firstProject?.images?.[0];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-charcoal text-gallery" aria-label="Mebri contemporary fashion">
      {heroImage && <img src={heroImage} alt={firstProject.title} className="fashion-image absolute inset-0 h-full w-full object-cover object-center opacity-75" fetchPriority="high" />}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/25 to-charcoal/10" />
      <div className="editorial-grid absolute inset-0 opacity-20" />
      <div className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-7 pt-32 md:px-8 md:pb-10 md:pt-40">
        <div className="flex items-start justify-between border-t border-white/25 pt-3 text-[10px] uppercase tracking-[0.28em] text-white/70">
          <span>Contemporary forms</span>
          <span>Collection 01 / 2026</span>
        </div>
        <div className="max-w-5xl">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.34em] text-white/65">Addis Ababa / Worldwide</p>
          <h1 className="display-word max-w-4xl text-[clamp(4.4rem,13vw,12rem)] font-semibold leading-[0.78]">RELAXED<br />BY DESIGN</h1>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link to="/projects" className="inline-flex items-center gap-3 border-b border-white/60 pb-2 font-mono text-[10px] uppercase tracking-[0.28em] transition-colors hover:border-white hover:text-white">Shop the collection <ArrowUpRight size={14} /></Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">Upper / Lower / Outerwear</span>
          </div>
        </div>
        <div className="flex items-end justify-between text-white/55">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em]">01 — {String(projects.length).padStart(2, "0")}</span>
          <ArrowDown size={18} strokeWidth={1} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
