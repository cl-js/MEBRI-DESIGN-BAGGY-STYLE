import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProjectImage from "./ProjectImage";

function ProjectNavItem({ project, label, align }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/project/${project.slug}`}
      className={`flex flex-col gap-3 group focus:outline-none ${align === "right" ? "items-end" : "items-start"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hot dot with hover image */}
      <div className="relative flex-shrink-0 order-first">
        <div
          className="w-2 h-2 rounded-full bg-cobalt transition-transform duration-300 group-hover:scale-125"
          style={{ width: '7.7px', height: '7.7px' }}
        />
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-50 w-48 h-64 overflow-hidden pointer-events-none ${align === "right" ? "right-4 bottom-4" : "left-4 bottom-4"}`}
            >
              <ProjectImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text */}
      <div className={align === "right" ? "text-right" : "text-left"}>
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2 ltr" style={{ direction: 'ltr' }}>
          {label}
        </span>
        <span className="font-body text-lg md:text-2xl font-light tracking-tight text-foreground group-hover:text-cobalt transition-colors duration-300">
          {project.title}
        </span>
        <span className="font-mono text-xs text-muted-foreground block mt-0.5">
          {project.subtitle}
        </span>
      </div>
    </Link>
  );
}

export default function NextProject({ nextProject, prevProject }) {
  return (
    <section
      className="px-6 md:px-8 py-16 md:py-24 max-w-none"
      aria-label="Project navigation"
    >
      <div className="flex items-start justify-between gap-12 md:gap-16">
        {prevProject && (
          <ProjectNavItem project={prevProject} label="Previous Project" align="left" />
        )}
        {nextProject && (
          <ProjectNavItem project={nextProject} label="Next Project" align="right" />
        )}
      </div>
    </section>
  );
}