import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useParams } from "react-router-dom";
import { useInView } from "framer-motion";
import { useProjectData } from "@/lib/ProjectDataContext";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectMetadata from "@/components/project/ProjectMetadata";
import NextProject from "@/components/project/NextProject";
import ProjectImageWrapper from "@/components/project/ProjectImageWrapper";

export default function ProjectDetail() {
  const { projects } = useProjectData();
  const { slug } = useParams();
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[currentIndex];
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];

  const [gridCols, setGridCols] = useState(1);
  const imagesRef = useRef(null);
  const stickyTextRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesInView = useInView(imagesRef, { once: false, margin: "0px" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useLayoutEffect(() => {
    if (!stickyTextRef.current || !sectionRef.current) return;
    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 10px",
          end: "bottom bottom",
          pin: stickyTextRef.current,
          pinSpacing: false,
        });
        ScrollTrigger.refresh();
      });
    }, 100);
    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="font-mono text-sm text-muted-foreground">Project not found.</p>
      </div>
    );
  }

  return (
    <div>
      <ProjectHeader project={project} />
      {/* Mobile: Metadata as separate section */}
      <div className="md:hidden">
        <ProjectMetadata project={project} />
      </div>

      {/* Sticky Text + Images Layout */}
      <section ref={sectionRef} className="px-6 md:px-8 py-24 md:py-32" aria-label="Project detail">
        {/* Mobile: Title + Tagline above images */}
        <div className="md:hidden mb-8">
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
            {project.category}
          </span>
          <h2 className="font-body text-3xl font-light tracking-tight text-foreground mb-8 leading-snug">
            {project.tagline}
          </h2>
          <p className="font-body text-base leading-relaxed text-muted-foreground">{project.description}</p>
        </div>

        {/* Images */}
        <div ref={imagesRef} className={`md:hidden mb-12 ${gridCols === 2 ? 'columns-2 gap-x-4' : 'flex flex-col gap-4'}`}>
          {(project.images || [project.image]).map((src, i) =>
            <ProjectImageWrapper
              key={`img-${i}`}
              index={i}
              src={src}
              alt={`${project.title} ${i + 1}`}
              className={`w-full h-auto ${gridCols === 2 ? 'mb-4 break-inside-avoid' : ''}`}
            />
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-12 gap-16 relative">
          {/* Left  -  Sticky text */}
          <div ref={stickyTextRef} className="col-span-4 self-start">
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
              {project.category}
            </span>
            <h2 className="font-body text-2xl md:text-3xl font-light tracking-tight text-foreground mb-8 leading-snug">
              {project.tagline}
            </h2>
            <p className="font-body text-base leading-relaxed text-muted-foreground">{project.description}</p>
          </div>

          {/* Right  -  Images */}
          <div ref={imagesRef} className={`col-span-8 ${gridCols === 2 ? 'columns-2 gap-x-4' : 'flex flex-col gap-4'}`}>
            {(project.images || [project.image]).map((src, i) =>
              <ProjectImageWrapper
                key={`img-${i}`}
                index={i}
                src={src}
                alt={`${project.title} ${i + 1}`}
                className={`w-full h-auto ${gridCols === 2 ? 'mb-4 break-inside-avoid' : ''}`}
              />
            )}
          </div>
        </div>


        {/* Sticky Zoom Controls */}
        <div className="flex justify-end mt-8 md:mt-12">
          <div className={`hidden md:flex items-center gap-2 bg-white/50 backdrop-blur-md px-2 py-2 rounded-xl ${imagesInView ? 'fixed bottom-8 right-8' : 'sticky bottom-8'}`} style={{ transform: 'translateY(-25px)' }}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridCols(1); }}
              className={`flex items-center justify-center w-5 h-5 transition-colors duration-200 ${gridCols === 1 ? 'text-cobalt' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Zoom in"
              title="Zoom in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="6" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridCols(2); }}
              className={`flex items-center justify-center w-5 h-5 transition-colors duration-200 ${gridCols === 2 ? 'text-cobalt' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Zoom out"
              title="Zoom out">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <NextProject nextProject={nextProject} prevProject={prevProject} />
    </div>
  );
}