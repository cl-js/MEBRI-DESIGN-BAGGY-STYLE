import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ProjectOutcomes({ project }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-40 px-6 md:px-8" aria-label="Project outcomes">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Outcomes */}
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-6">
              Outcomes
            </span>
            <div className="space-y-6">
              {project.outcomes.map((outcome, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="font-mono text-xs text-cobalt mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-body text-lg text-foreground">{outcome}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-6">
              Deliverables
            </span>
            <div className="space-y-4">
              {project.deliverables.map((deliverable, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 py-3 border-b border-border"
                >
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-body text-base text-foreground">{deliverable}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}