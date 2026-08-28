import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectImage from "./ProjectImage";

export default function ProjectProcess({ project }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-24 px-6 md:px-8 bg-charcoal" aria-label="Design process">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Sticky Left */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <span className="font-mono text-xs tracking-widest uppercase text-gallery/40 block mb-3">
                Process & Research
              </span>
              <h2 className="font-body text-3xl md:text-4xl font-light tracking-tight text-gallery mb-6">
                How we got there.
              </h2>
              <p className="font-body text-lg leading-relaxed text-gallery/70">
                {project.process}
              </p>
            </motion.div>
          </div>

          {/* Right  -  Visual */}
          <div className="md:col-start-7 md:col-span-6">
            <ProjectImage
              src={project.processImage}
              alt={`Design process visual for ${project.title}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}