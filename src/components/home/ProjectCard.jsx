import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useProjectData } from "@/lib/ProjectDataContext";

export default function ProjectCard({ project, index }) {
  const { projectCount } = useProjectData();
  const ref = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
    >
      <Link
        to={`/project/${project.slug}`}
        className={`group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start focus:outline-none`}
      >
        {/* Image  -  Sticky Scroll */}
        <motion.div
          ref={imageRef}
          style={{
            y: imageY,
            opacity: imageOpacity,
          }}
          className={`${
            isEven ? "md:col-start-1 md:col-span-7" : "md:col-start-5 md:col-span-8"
          } overflow-hidden relative md:sticky md:top-24`}
        >
          <div className="image-hover-zone group/img relative overflow-hidden aspect-[4/5]">
            <img
              src={project.heroImage}
              alt={`${project.title} - ${project.subtitle}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
              style={{ transition: "transform 0.7s cubic-bezier(0.65,0,0.35,1)" }}
              loading="lazy"
            />
            <div className="absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 image-overlay" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.85) 0%, rgba(18,18,18,0.3) 50%, rgba(18,18,18,0) 100%)' }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 image-id-label">
              <span className="font-body text-8xl md:text-9xl font-light text-white tracking-tighter select-none">
                {project.id}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <div
          className={`${
            isEven ? "md:col-start-9 md:col-span-4" : "md:col-start-1 md:col-span-4 md:row-start-1"
          } flex flex-col justify-end md:justify-center md:items-center md:text-center md:h-full py-4 md:py-0`}
        >
          <span className="font-mono text-xs md:text-sm tracking-widest text-muted-foreground uppercase mb-3">
            {project.category} / {project.year}
          </span>
          <h3 className="font-body text-3xl md:text-6xl font-light tracking-tight text-foreground group-hover:text-cobalt transition-colors duration-300 mb-4">
            {project.title}
          </h3>
          <p className="font-body text-sm md:text-2xl text-muted-foreground mb-4">
            {project.subtitle}
          </p>
          <span className="font-mono text-xs md:text-sm tracking-widest text-muted-foreground uppercase">
            {project.fit} <span className="mx-2 text-border">/</span> {project.price}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}