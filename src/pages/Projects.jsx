import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { useProjectData } from "@/lib/ProjectDataContext";

export default function Projects() {
  const { projects } = useProjectData();

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen" onMouseMove={handleMouseMove}>
      {/* Header */}
      <div className="px-6 md:px-8 pt-32 pb-12">
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
          Mebri / Collection 01
        </span>

        <h1 className="font-body text-4xl md:text-6xl font-light tracking-tight text-foreground mt-3">
          The wardrobe
        </h1>
      </div>

      {/* Strips */}
      <div className="border-t border-border">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            to={`/project/${project.slug}`}
            className="group block border-b border-border relative overflow-hidden"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Background fill on hover — desktop only */}
            <motion.div
              className="hidden lg:block absolute inset-0 bg-foreground"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
              transition={{
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1],
              }}
              style={{ originX: 0 }}
            />

            {/* ========================================================= */}
            {/* MOBILE — ORIGINAL MOBILE LAYOUT                          */}
            {/* ========================================================= */}
            <div className="md:hidden relative overflow-hidden">
              {/* Full image — no cropping */}
              <img
                src={project.image}
                alt={project.title}
                className="block w-full h-auto object-contain"
              />

              {/* Mobile overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Number + title */}
                <div className="text-center">
                  {/* Index */}
                  <span className="block font-mono text-[clamp(5rem,14vw,8rem)]  tracking-widest text-white">
                    {project.id}
                  </span>

                  {/* Title */}
                  <span className="mt-3 block font-body text-[clamp(3rem,10vw,6.5rem)] font-light tracking-tight text-white">
                    {project.title}
                  </span>
                </div>

                {/* Right arrow */}
                <motion.span
                  className="absolute right-6 bottom-6 font-mono text-3xl text-white"
                  animate={{
                    x: hoveredIndex === i ? 4 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  &gt;
                </motion.span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* TABLET / iPAD — ONLY NEW RESPONSIVE LAYOUT               */}
            {/* 768px–1023px                                              */}
            {/* ========================================================= */}
            <div className="hidden md:grid lg:hidden relative z-10 grid-cols-12 items-stretch">
              {/* Left side — number + title */}
              <div className="col-span-5 flex flex-col justify-center px-8 py-10">
                <span className="font-mono text-[clamp(7rem,12vw,10rem)] leading-none tracking-widest text-foreground ">
                  {project.id}
                </span>

                <span className="mt-8 block font-body text-[clamp(4rem,7vw,6.5rem)] leading-[0.95] font-light tracking-tight text-foreground">
                  {project.title}
                </span>
              </div>

              {/* Right side — complete image */}
              <div className="col-span-7 relative flex items-end justify-center overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="block w-full h-auto object-contain"
                />

                {/* Arrow — bottom-right of the image */}
                <motion.span
                  className="absolute right-8 bottom-8 font-mono text-4xl text-white"
                  animate={{
                    x: hoveredIndex === i ? 6 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  &gt;
                </motion.span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* DESKTOP — ORIGINAL STRUCTURE                              */}
            {/* ========================================================= */}
            <div className="hidden lg:grid relative z-10 px-6 md:px-8 py-7 md:py-8 grid-cols-12 items-center gap-4">
              {/* Index */}
              <div className="col-span-2 md:col-span-1">
                <span
                  className="font-mono text-xs tracking-widest transition-colors duration-300"
                  style={{
                    color:
                      window.innerWidth >= 768 && hoveredIndex === i
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {project.id}
                </span>
              </div>

              {/* Title */}
              <div className="col-span-7 md:col-span-5">
                <span
                  className="font-body text-xl md:text-2xl font-light tracking-tight transition-colors duration-300"
                  style={{
                    color:
                      window.innerWidth >= 768 && hoveredIndex === i
                        ? "hsl(var(--background))"
                        : "hsl(var(--foreground))",
                  }}
                >
                  {project.title}
                </span>
              </div>

              {/* Category */}
              <div className="hidden md:block col-span-3">
                <span
                  className="font-mono text-xs tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color:
                      window.innerWidth >= 768 && hoveredIndex === i
                        ? "hsl(var(--background))/60"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Year */}
              <div className="hidden md:block col-span-2">
                <span
                  className="font-mono text-xs tracking-widest transition-colors duration-300"
                  style={{
                    color:
                      window.innerWidth >= 768 && hoveredIndex === i
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {project.year}
                </span>
              </div>

              {/* Arrow */}
              <div className="col-span-3 md:col-span-1 flex justify-end">
                <motion.span
                  className="font-mono text-sm transition-colors duration-300"
                  animate={{
                    x: hoveredIndex === i ? 4 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  style={{
                    color:
                      window.innerWidth >= 768 && hoveredIndex === i
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  &gt;
                </motion.span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating image that follows cursor — desktop only */}
      <AnimatePresence>
        {hoveredIndex !== null && window.innerWidth >= 1024 && (
          <motion.div
            key={hoveredIndex}
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed pointer-events-none z-50 w-56 h-72 overflow-hidden shadow-2xl"
            style={{
              left: mousePos.x + 24,
              top: mousePos.y - 100,
            }}
          >
            <img
              src={projects[hoveredIndex].image}
              alt={projects[hoveredIndex].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}