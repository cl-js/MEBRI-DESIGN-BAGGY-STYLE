import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const philosophyText = "I believe a garment is never just fabric  -  it is memory made wearable. Every piece begins with the cloth, continues with the hand, and resolves in how it moves on the body. The goal is never novelty. The goal is to carry heritage forward, one cut at a time."

function AnimatedParagraph({ text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.65, 0, 0.35, 1],
      }}
    >
      {text}
    </motion.p>
  );
}

export default function PhilosophySection() {
  const { text } = useLanguage();
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <section className="py-24 md:py-40 px-6 md:px-8" aria-label="Design Philosophy">
      <div>
        <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-8 md:mb-12">
          {text.craft}
        </span>

        <div className="mb-16">
          <div className="font-body text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground leading-loose max-w-4xl">
            <AnimatedParagraph text={text.philosophy} />
          </div>
        </div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 items-start"
        >
          <Link
            to="/about"
            className="font-mono text-sm tracking-widest uppercase text-foreground hover:text-cobalt transition-colors duration-300 border-b border-foreground/20 hover:border-cobalt pb-1 focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4"
          >
            {text.readStory} &gt;
          </Link>
          <Link
            to="/contact"
            className="font-mono text-sm tracking-widest uppercase text-foreground hover:text-cobalt transition-colors duration-300 border-b border-foreground/20 hover:border-cobalt pb-1 focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4"
          >
            {text.commission} &gt;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}