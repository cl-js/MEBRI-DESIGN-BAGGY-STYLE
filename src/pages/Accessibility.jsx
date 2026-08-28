import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const sections = [

  {
    body: "Last updated: August 23, 2026"
  },
  {
    title: "1. Accessibility Statement",
    body: "Mebri is dedicated to ensuring digital accessibility for people with disabilities. Continual improvements are being made to enhance the experience for everyone visiting the platform.",
  },
  {
    title: "2. What Web Accessibility Is",
    body: "An accessible site allows visitors with disabilities to browse with the same level of ease and enjoyment as other visitors. This is achieved through the capabilities of the operating system and assistive technologies.",
  },
  {
    title: "3. Accessibility Adjustments on This Site",
    body: "This site has been adapted in accordance with WCAG 2.1 Level AA guidelines and optimized to work seamlessly with assistive technologies such as screen readers and keyboard navigation. Specific measures implemented include using evaluation tools to find and fix potential accessibility issues, setting the proper language of the site, structuring logical content order across pages, defining clear heading hierarchies, adding alternative text to images, implementing compliant color contrast combinations, reducing unnecessary motion, and ensuring all embedded media and files are fully accessible.",
  },
  {
    title: "4. Requests, Issues, and Suggestions",
    body: "If you encounter any accessibility barriers on the site or require assistance with custom tailoring consultations and bookings, please reach out directly:",
    list: [
      "Coordinator: Mebri Studio",
      "Studio Location: Addis Ababa, Ethiopia",
      "Phone: +251 93 429 0520",
      "Email: studio@mebri.com",
       
    ],
  },
];

export default function Accessibility() {
  const { language } = useLanguage();
  const labels = {
    en: { legal: "Legal", title: "Accessibility" },
    am: { legal: "ህጋዊ", title: "ተደራሽነት" },
    ti: { legal: "ሕጋዊ", title: "ተበጻሕነት" },
  }[language];
  const sectionTitles = language === "am"
    ? ["", "1. የተደራሽነት መግለጫ", "2. የድር ተደራሽነት ምንድነው", "3. በዚህ ድረ-ገጽ ላይ የተደረጉ ማስተካከያዎች", "4. ጥያቄዎች፣ ችግሮች እና አስተያየቶች"]
    : language === "ti"
      ? ["", "1. መግለጺ ተበጻሕነት", "2. ተበጻሕነት ዌብ እንታይ እዩ", "3. ኣብዚ ሳይት ዝተገብሩ ምምሕያሻት", "4. ሕቶታት፣ ጸገማትን ሓሳባትን"]
      : sections.map((section) => section.title || "");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen px-6 md:px-8 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-6">
            {labels.legal}
          </span>
          <h1 className="font-body text-5xl md:text-6xl font-light tracking-tight text-foreground mb-16">
            {labels.title}
          </h1>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="border-t border-border pt-10"
            >
              {section.title && (
                <h2 className="font-body text-xl font-medium text-foreground mb-4">
                  {sectionTitles[i] || section.title}
                </h2>
              )}
              {section.body && section.body.split("\n\n").map((para, j) => (
                <p key={j} className="font-body text-base text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  {section.list.map((item, k) => (
                    <li key={k} className="font-body text-base text-muted-foreground leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}