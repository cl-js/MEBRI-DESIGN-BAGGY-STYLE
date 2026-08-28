import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const sections = [

  {
     
    body: "Last updated: August 23, 2026",
  },
  
  {

    title: "Privacy Policy",
    title: "1. Introduction",
    body: "Welcome to the official website of Mebri, a contemporary fashion label based in Addis Ababa, Ethiopia. We respect your privacy and are committed to protecting any personal information you share through this website. This Privacy Policy outlines how information is collected, used, and safeguarded when you visit the platform or contact the studio.",
  },
  {
    title: "2. Information We Collect",
    body: "To provide exceptional custom tailoring, design consultations, and client service, the following types of information may be collected: Contact Information includes your full name, email address, phone number (+251 93 429 0520), and delivery or studio location details provided via contact or booking forms. Custom Measurement Data covers specific body measurements, sizing notes, fabric preferences, and stylistic requests shared during custom garment commissions or fitting appointments. Visual and Reference Material consists of design inspirations, reference images, or reference photos uploaded or shared by clients for bespoke tailoring projects. Technical Data includes standard analytics data, browser type, IP address, and device information gathered automatically through cookies to optimize your browsing experience.",
  },
  {
    title: "3. How We Use Your Information",
    body: "The information collected is used exclusively for professional and operational purposes. This includes communicating regarding clothing orders, fit guidance, design consultations, studio updates, and improving website performance, interface design, and digital asset layouts.",
  },

  {
    title: "4. Data Sharing & Security",
    body: "Strict confidentiality is maintained regarding all client records, measurements, and design concepts. Personal information is never sold, traded, or rented to third parties. Data is only accessible to authorized studio personnel directly involved in crafting your garments. Appropriate technical and organizational security measures are implemented to protect your information against unauthorized access, alteration, or disclosure.",
  },

  {
    title: "5. Your Rights",
    body: "You have the right to request access to the personal data held about you, ask for corrections to your sizing or contact records, or request the deletion of your data from the active client database at any time by contacting me directly.",
  },

  {
    title: "6. Contact Us",
    body: "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please reach out to Mebri Studio in Addis Ababa via email at studio@mebri.com or by phone at +251 93 429 0520.",
  },

  
];

export default function Privacy() {
  const { language } = useLanguage();
  const labels = {
    en: { legal: "Legal", title: "Privacy Policy", updated: "Last updated: August 23, 2026" },
    am: { legal: "ህጋዊ", title: "የግላዊነት መመሪያ", updated: "መጨረሻ የተሻሻለው፦ ነሐሴ 23፣ 2026" },
    ti: { legal: "ሕጋዊ", title: "ፖሊሲ ምስጢራዊነት", updated: "መወዳእታ ዝተሓደሰ፦ 23 ነሓሰ 2026" },
  }[language];
  const sectionTitles = language === "am"
    ? ["", "1. መግቢያ", "2. የምንሰበስበው መረጃ", "3. መረጃዎን እንዴት እንጠቀማለን", "4. የመረጃ መጋራት እና ደህንነት", "5. መብቶችዎ", "6. ያግኙን"]
    : language === "ti"
      ? ["", "1. መእተዊ", "2. ዝእክቦ ሓበሬታ", "3. ንሓበሬታኹም ብኸመይ ንጥቀመሉ", "4. ምክፋልን ድሕነትን ሓበሬታ", "5. መሰላትኩም", "6. ርኸቡና"]
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
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="border-t border-border pt-10"
            >
              <h2 className="font-body text-xl font-medium text-foreground mb-4">
                {sectionTitles[i] || section.title}
              </h2>
              {section.body.split("\n\n").map((para, j) => (
                <p key={j} className="font-body text-base text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}