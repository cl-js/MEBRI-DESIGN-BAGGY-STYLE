import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is your process for a bespoke commission?",
    a: "Every garment begins with a conversation  -  understanding the occasion, your body, and the traditions you wish to honour. From there we select handwoven fabrics and trims, take measurements, draft a pattern, and cut by hand. Two to three fittings refine the silhouette before final construction and finishing.",
  },
  {
    q: "Do you work with clients outside Ethiopia?",
    a: "Yes. While my atelier is in Addis Ababa, I work with clients across the diaspora worldwide. Measurements can be taken remotely with guidance, and finished pieces are shipped internationally. For larger commissions I travel for in-person fittings where possible.",
  },
  {
    q: "How long does a bespoke garment take?",
    a: "A single bespoke piece typically takes three to eight weeks, depending on complexity, fabric availability, and the number of fittings. Bridal and ceremonial trousseaus may take longer. I'll give you a clear timeline after our first consultation.",
  },
  {
    q: "Can I request a custom fit?",
    a: "Yes. Every Mebri block is designed with room to move, and the studio can advise on sizing, length, and proportion for custom development or small runs.",
  },
  {
    q: "What are your starting prices?",
    a: "Pricing depends on fabric, complexity, and handwork. Bespoke commissions start at around $500 for simpler pieces, with bridal and heavily embroidered couture scaling accordingly. I provide a detailed quote after our initial consultation.",
  },
];

export default function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
          <AccordionTrigger className="font-body text-base text-foreground hover:text-cobalt py-6 text-left">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <p className="font-body text-base text-muted-foreground leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}