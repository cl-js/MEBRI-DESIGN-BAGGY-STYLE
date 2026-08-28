import React from "react";
import { Link } from "react-router-dom";
import { languageOptions, useLanguage } from "@/lib/LanguageContext";

const footerGroups = [
  {
    heading: "Explore",
    links: [
      { label: "Collections", href: "/projects" },
      { label: "About Mebri", href: "/about" },
      { label: "Journal", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
      { label: "WhatsApp", href: "https://wa.me/251934290520" },
      { label: "Email", href: "mailto:studio@mebri.com" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

function FooterLink({ href, children }) {
  const className = "font-body text-sm text-foreground transition-colors duration-200 hover:text-[#ddd0c5] focus:outline-none focus:ring-2 focus:ring-[#ddd0c5] focus:ring-offset-4 focus:ring-offset-[#111111]";
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className={className}>{children}</a>;
  }
  return <Link to={href} className={className}>{children}</Link>;
}

export default function KineticFooter() {
  const { language, setLanguage, text } = useLanguage();

  return (
    <footer className="footer-shell relative overflow-hidden bg-transparent text-[#f5f5f7] lg:px-6 lg:py-6">
      <div className="footer-panel mx-auto max-w-[1600px] px-4 pb-4 pt-5 text-center sm:px-6 sm:pb-5 sm:pt-6 md:px-8 md:pb-6 md:pt-8 lg:px-8 lg:pb-6 lg:pt-8 md:max-lg:text-center">
        <div className="grid gap-7 sm:gap-8 md:max-lg:grid-cols-1 md:max-lg:justify-items-center lg:grid-cols-1 lg:justify-items-center lg:gap-8">
          <div className="max-w-[470px] md:max-lg:max-w-none lg:max-w-none">
            <div className="flex items-start justify-between gap-3 md:justify-center">
              <div className="flex-1 md:w-[min(52vw,380px)] md:flex-none">
                <h2 className="font-serif text-[2.35rem] leading-[0.8] tracking-[-0.06em] text-[#f0ece4] sm:text-[3.1rem]">
                  WEAR THE<br />VOLUME.<br />MOVE FREELY.
                </h2>
                <p className="mx-auto mt-4 max-w-[260px] text-sm leading-relaxed text-[#d8d0c7] sm:text-base md:text-lg">We look forward to hearing from you.</p>
                <Link to="/contact" className="mt-6 inline-flex items-center gap-3 border-b border-[#d8d0c7]/70 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f5f5f7] transition-colors duration-200 hover:border-[#f5f5f7] hover:text-[#ddd0c5]">Get in touch <span aria-hidden="true">→</span></Link>
              </div>
              <Link to="/contact" aria-label="Contact Mebri Design" className="-translate-y-[20%] hidden flex-shrink-0 md:block lg:block md:translate-y-[-20%] md:self-start">
                <img src="/images/mebri-design-logo.png" alt="Mebri Design" className="mt-0 block h-[11.76rem] w-[10.92rem] object-contain md:h-[18.9rem] md:w-[18.9rem]" />
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-[700px] grid-cols-3 gap-3 sm:gap-6 justify-items-center">
            {footerGroups.map((group) => (
              <div key={group.heading} className="min-w-0 lg:min-w-[180px]">
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#b5b0aa]">{group.heading}</h3>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {group.links.map((link) => <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 sm:mt-7 sm:pt-5 md:mt-8 md:pt-6 lg:mt-10 lg:pt-6">
          <div className="relative flex flex-col gap-4 md:max-lg:items-center lg:items-center">
            <div className="mebri-wordmark-wrap" aria-label="Mebri wordmark">
              <svg className="mebri-wordmark" viewBox="0 0 1000 190" role="img" aria-label="MEBRI">
                <text x="500" y="145" textAnchor="middle">MEBRI</text>
              </svg>
            </div>
            <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between md:max-lg:block lg:block lg:text-center">
              <div className="whitespace-nowrap text-sm text-[#d8d0c7] md:text-base md:max-lg:-translate-x-[5px]">© 2026 Mebri Design · All rights reserved.</div>
              <label className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#f5f5f7] md:max-lg:absolute md:max-lg:bottom-0 md:max-lg:left-0 lg:absolute lg:bottom-0 lg:left-0">
                <span className="sr-only">{text.switchLanguage}</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={text.switchLanguage} className="cursor-pointer appearance-none bg-transparent pr-5 text-[#f5f5f7] outline-none transition-colors duration-200 hover:text-[#ddd0c5]">
                  {languageOptions.map((option) => <option key={option.value} value={option.value} className="bg-[#111111] text-[#f5f5f7]">{option.label}</option>)}
                </select>
                <span className="pointer-events-none -ml-3" aria-hidden="true">⌄</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

}