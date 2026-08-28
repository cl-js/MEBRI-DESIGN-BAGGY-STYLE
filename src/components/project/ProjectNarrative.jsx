import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Section({ label, title, text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="mb-20 md:mb-32"
    >
      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-3">{label}</span>
      <h2 className="font-body text-2xl md:text-3xl font-light tracking-tight text-foreground mb-6">{title}</h2>
      <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl">{text}</p>
    </motion.div>
  );
}

export default function ProjectNarrative({ project }) {
  return (
    <section className="py-24 md:py-40 px-6 md:px-8" aria-label="Project narrative">
      <div className="max-w-5xl mx-auto">
        <Section label="The Challenge" title="Problem" text={project.problem} />
        <Section label="The Answer" title="Solution" text={project.solution} />
      </div>
    </section>
  );
}