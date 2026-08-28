import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const awards = [
  { name: "The Dieline Award  -  Gold", project: "Grove Packaging", year: "2025" },
  { name: "Type Directors Club  -  Award of Excellence", project: "Forma Typeface", year: "2024" },
  { name: "Communication Arts  -  Identity Annual", project: "Meridian Identity", year: "2025" },
  { name: "Wallpaper* Design Award Finalist", project: "Sable Fashion Brand", year: "2024" },
  { name: "Brand New Awards  -  Small Studio", project: "Kinto Cafe", year: "2024" },
  { name: "AIGA 365", project: "Multiple Projects", year: "2023" },
];

const press = [
  { publication: "It's Nice That", topic: "Studio Feature" },
  { publication: "The Dieline", topic: "Grove Packaging Spotlight" },
  { publication: "Wallpaper*", topic: "Designer Profile" },
  { publication: "Brand New", topic: "Identity Review  -  Kinto & Meridian" },
];

export default function Recognition() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Awards */}
      <div className="mb-16">
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-6">Awards</span>
        {awards.map((award, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-4 border-b border-border">
            <span className="md:col-span-5 font-body text-base text-foreground">{award.name}</span>
            <span className="md:col-span-5 font-body text-sm text-muted-foreground">{award.project}</span>
            <span className="md:col-span-2 font-mono text-xs text-muted-foreground">{award.year}</span>
          </div>
        ))}
      </div>

      {/* Press */}
      <div>
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-6">Press</span>
        {press.map((item, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 py-4 border-b border-border">
            <span className="font-body text-base text-foreground">{item.publication}</span>
            <span className="font-body text-sm text-muted-foreground">{item.topic}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}