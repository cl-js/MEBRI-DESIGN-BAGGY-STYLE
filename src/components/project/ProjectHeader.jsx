import React from "react";
import { motion } from "framer-motion";
import ProjectMetadata from "./ProjectMetadata";
import ProjectImage from "./ProjectImage";
import { useProjectData } from "@/lib/ProjectDataContext";

export default function ProjectHeader({ project }) {
  const { projectCount } = useProjectData();
  return (
    <section className="min-h-screen flex flex-col justify-end pb-16 pt-24 relative overflow-hidden">
      {/* Background Hero */}
      <div className="absolute inset-0 z-0">
        <ProjectImage
          key={project.heroImage}
          src={project.heroImage}
          alt={`${project.title} hero visual`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="grid grid-cols-12 gap-x-4 md:gap-x-6"
        >
          {/* Category  -  col 2 */}
          <div className="col-start-2 col-span-10 mb-4">
            <span className="font-mono text-xs tracking-widest uppercase text-gallery/60">
              {project.id}/{String(projectCount).padStart(2, "0")}  -  {project.category}
            </span>
          </div>

          {/* Title  -  cols 2 - 11 */}
          <h1 className="col-start-2 col-span-10 font-body text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter text-gallery leading-none mb-6">
            {project.title}
          </h1>

          {/* Subtitle  -  cols 2 - 6 */}
          <p className="col-start-2 col-span-5 font-body text-xl md:text-2xl font-light text-gallery/80 mb-4">
            {project.subtitle}
          </p>
        </motion.div>
        {/* Desktop: Metadata in hero */}
        <div className="hidden md:block mt-12 col-start-2 col-span-10">
          <ProjectMetadata project={project} />
        </div>
      </div>
    </section>
  );
}