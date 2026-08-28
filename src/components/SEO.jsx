import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const siteName = "Mebri";
const fallbackDescription = "Mebri is a contemporary fashion label from Addis Ababa creating oversized, baggy, and architectural everyday clothing.";

const pageContent = {
  "/": {
    title: "Mebri | Contemporary Forms",
    description: fallbackDescription,
    keywords: "Mebri fashion, oversized clothing, baggy fashion, contemporary African design",
  },
  "/about": {
    title: "About Mebri | Contemporary Fashion",
    description: "Discover the studio practice behind Mebri's oversized silhouettes, considered materials, and contemporary clothing from Addis Ababa.",
    keywords: "Mebri studio, contemporary African fashion, oversized silhouettes",
  },
  "/projects": {
    title: "Shop Mebri | Upper, Lower, Outerwear",
    description: "Explore Mebri's contemporary wardrobe of oversized tops, wide-leg trousers, outerwear, sets, and essentials.",
    keywords: "oversized tops, wide-leg trousers, baggy jeans, contemporary clothing",
  },
  "/gallery": {
    title: "Mebri Lookbook | Relaxed by Design",
    description: "Explore Mebri's editorial lookbook of oversized, baggy, and architectural contemporary clothing.",
    keywords: "Mebri lookbook, contemporary fashion editorial, baggy clothing",
  },
  "/contact": {
    title: "Contact Mebri | Addis Ababa Studio",
    description: "Contact the Mebri studio for stockist inquiries, fit questions, and contemporary clothing development.",
    keywords: "Mebri contact, Addis Ababa fashion studio, contemporary clothing inquiries",
  },
};

const privatePaths = new Set(["/admin", "/update-contact"]);

const faqSchema = [
  ["What is your process for a bespoke commission?", "Every garment begins with a conversation about the occasion, your body and the traditions you wish to honour. We then select fabrics and trims, take measurements, draft a pattern and refine the piece through fittings."],
  ["Do you work with clients outside Ethiopia?", "Yes. Mebri works with clients worldwide from the Addis Ababa studio, with remote fit guidance and international shipping available."],
  ["How long does a bespoke garment take?", "A single bespoke piece typically takes three to eight weeks depending on complexity, fabric availability and fittings."],
  ["Can I request a custom fit?", "Yes. The studio can advise on sizing, length, and proportion for custom development or small runs."],
  ["What are your starting prices?", "Bespoke commissions start at around $500, with pricing depending on fabric, complexity and handwork."],
];

function setMeta(attribute, value, content) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isProject = pathname.startsWith("/project/");
    const page = pageContent[pathname] || (isProject
      ? {
        title: "Mebri Piece | Contemporary Fashion",
        description: "Discover a contemporary Mebri clothing piece built around relaxed proportion and considered construction.",
        keywords: "Mebri clothing, oversized fashion, contemporary African design",
      }
      : pageContent["/"]);
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const canonicalPath = pathname.startsWith("/project/") ? pathname : pathname.replace(/\/$/, "") || "/";
    const canonicalUrl = `${siteUrl}${canonicalPath}`;

    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("name", "keywords", page.keywords);
    setMeta("name", "robots", privatePaths.has(pathname) ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", `${siteUrl}/images/mebri-design-logo.png`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);

    let canonical = document.head.querySelector("link[rel=canonical]");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let schema = document.head.querySelector("script[data-seo-schema]");
    if (!schema) {
      schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.dataset.seoSchema = "true";
      document.head.appendChild(schema);
    }
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "FashionDesigner",
      name: siteName,
      url: siteUrl,
      image: `${siteUrl}/images/mebri-design-logo.png`,
      description: fallbackDescription,
      address: { "@type": "PostalAddress", addressLocality: "Addis Ababa", addressCountry: "ET" },
      areaServed: "Worldwide",
      knowsAbout: ["Oversized clothing", "Baggy silhouettes", "Pattern engineering", "Contemporary African design"],
      sameAs: ["https://instagram.com", "https://tiktok.com", "https://twitter.com"],
    };
    schema.textContent = JSON.stringify(pathname === "/contact"
      ? [organizationSchema, {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSchema.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }]
      : organizationSchema);
  }, [pathname]);

  return null;
}