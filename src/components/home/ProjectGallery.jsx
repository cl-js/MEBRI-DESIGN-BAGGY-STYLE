import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { useProjectData } from "@/lib/ProjectDataContext";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProjectGallery() {
  const { text } = useLanguage();
  const { projects } = useProjectData();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-40 px-6 md:px-8" aria-label="Selected Works">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16 md:mb-24"
      >
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
          {text.selectedWorks}
        </span>
        <h2 className="font-body text-4xl md:text-6xl font-light tracking-tight text-foreground max-w-[60%]">
          {text.selectedWorksHeading}
        </h2>
      </motion.div>

      <div className="space-y-20 md:space-y-32">
        {projects.slice(0, 3).map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      <div className="mt-20 md:mt-32">
        <Link
          to="/projects"
          className="font-mono text-2xl md:text-3xl tracking-widest uppercase font-light pb-1 focus:outline-none animated-gradient-text"
          style={{ borderBottom: 'none' }}
        >
          {text.allProjects} &gt;
        </Link>
      </div>
    </section>
  );
}


//I am the best....