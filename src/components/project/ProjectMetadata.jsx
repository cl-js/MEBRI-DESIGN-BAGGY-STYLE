import React from "react";
import { motion } from "framer-motion";

export default function ProjectMetadata({ project }) {
  return (
    <section className="pt-10 md:pt-0">
      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-start-2 col-span-10 grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4"
        >
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-charcoal/60 md:text-gallery/60 block mb-3">Role</span>
            <p className="font-body text-base text-charcoal md:text-gallery">{project.role}</p>
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-charcoal/60 md:text-gallery/60 block mb-3">Year</span>
            <p className="font-body text-base text-charcoal md:text-gallery">{project.year}</p>
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-charcoal/60 md:text-gallery/60 block mb-3">Fit</span>
            <p className="font-body text-base text-charcoal md:text-gallery">{project.fit}</p>
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-charcoal/60 md:text-gallery/60 block mb-3">Material</span>
            <p className="font-body text-base text-charcoal md:text-gallery">{project.material}</p>
          </div>
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-charcoal/60 md:text-gallery/60 block mb-3">Price</span>
            <p className="font-body text-base text-charcoal md:text-gallery">{project.price}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}