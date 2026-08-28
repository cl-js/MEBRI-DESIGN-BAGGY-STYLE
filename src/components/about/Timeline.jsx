import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function FadeRow({ index, year, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8"
    >
      <div className="md:col-span-3">
        <span className="font-mono text-xs tracking-widest text-muted-foreground">{year}</span>
      </div>
      <div className="md:col-span-9">
        {children}
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  return (
    <div>
      <FadeRow index={0} year="2018  -  Present">
        <h3 className="font-body text-lg font-medium text-foreground mb-2">Founder & Design Director  -  Mebri Studio</h3>
        <p className="font-body text-base text-muted-foreground leading-relaxed">Leading an independent clothing studio in Addis Ababa focused on oversized proportions, everyday utility, and clothes designed for movement.</p>
      </FadeRow>

      <FadeRow index={1} year="2015  -  2018">
        <h3 className="font-body text-lg font-medium text-foreground mb-2">Pattern Lead  -  Independent Studio</h3>
        <p className="font-body text-base text-muted-foreground leading-relaxed">Developed seasonal blocks for relaxed shirts, wide-leg trousers, and outerwear while mentoring a small production team.</p>
      </FadeRow>

      <FadeRow index={2} year="2012  -  2015">
        <h3 className="font-body text-lg font-medium text-foreground mb-2">Tailor & Pattern Maker  -  Addis Ababa</h3>
        <p className="font-body text-base text-muted-foreground leading-relaxed">Built a foundation in proportion, drape, and construction across cotton, denim, fleece, and technical shell fabrics.</p>
      </FadeRow>

      <FadeRow index={3} year="2011">
        <h3 className="font-body text-lg font-medium text-foreground mb-2">Apprenticeship in Handweaving  -  Addis Ababa</h3>
        <p className="font-body text-base text-muted-foreground leading-relaxed">Trained alongside master weavers on the hand loom, learning the rhythms of shemma cotton and the geometry of tibeb borders from the source.</p>
      </FadeRow>

      <FadeRow index={4} year="2009">
        <h3 className="font-body text-lg font-medium text-foreground mb-2">Foundation in Fashion Design  -  Addis Ababa</h3>
        <p className="font-body text-base text-muted-foreground leading-relaxed">Grounding in pattern drafting, construction, and the principles of silhouette  -  the formal beginning of a lifelong craft.</p>
      </FadeRow>
    </div>
  );
}