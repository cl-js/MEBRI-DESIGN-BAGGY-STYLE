import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import FAQ from "@/components/contact/FAQ";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Instagram, MessageCircle, Music2, Phone, Send, Twitter } from "lucide-react";

const defaultSettings = { location: "Addis Ababa, Ethiopia", mapQuery: "Addis Ababa, Ethiopia", myLocation: "https://maps.app.goo.gl/zAfbZ3vp7xGEfKnP8?g_st=atm", phone: "+251 93 429 0520", whatsapp: "https://wa.me/251934290520", instagram: "https://instagram.com", telegram: "https://t.me/MTdesignerandmodel", tiktok: "https://tiktok.com", twitter: "https://twitter.com" };

function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;
    supabase.from("contact_settings").select("settings").eq("id", 1).maybeSingle().then(({ data }) => {
      if (active && data?.settings) setSettings({ ...defaultSettings, ...data.settings });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  async function unlockSettings(event) {
    event.preventDefault();
    setChecking(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: "englishpractice265@gmail.com", password });
    if (authError || data.user?.email?.toLowerCase() !== "englishpractice265@gmail.com") setError("Invalid admin password.");
    else navigate("/update-contact");
    setPassword("");
    setChecking(false);
  }

  const phoneUrl = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div className="pt-24 md:pt-32">
      {/* Header */}
      <section className="px-6 md:px-8 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
              Contact
            </span>
            <h1 className="font-body text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-6 leading-tight">
        
              <span className="text-muted-foreground">Contact the studio</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl">
              For stockist inquiries, fit questions, custom development, or a conversation about the next Mebri piece, reach out to the studio.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Map */}
      <section className="px-6 md:px-8 py-16 md:py-24 border-t border-border" aria-label={`Map showing ${settings.location}`}>
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">Find the atelier</span>
            <h2 className="font-body text-3xl md:text-5xl font-light tracking-tight mb-8">{settings.location}</h2>
            <div className="aspect-[16/9] min-h-[320px] w-full overflow-hidden border border-border bg-muted"><iframe title={`Map of ${settings.location}`} src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery || settings.location)}&output=embed`} className="h-full w-full border-0" loading="lazy" /></div>
            <a href={settings.myLocation} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex font-mono text-xs uppercase tracking-widest text-cobalt">Open my precise location in Google Maps -&gt;</a>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info & Social */}
      <section className="contact-orbit-section px-6 md:px-8 pt-16 md:pt-24 pb-20 md:pb-32 border-t border-border text-gallery" aria-label="Contact information">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <span className="font-mono text-xs tracking-widest uppercase text-sage">Stay connected</span>
            <h2 className="mt-3 font-body text-3xl font-light tracking-tight text-gallery md:text-5xl">Follow the work.</h2>
          </div>
          <div className="social-orbit mx-auto" aria-label="Social media links">
            <div className="social-orbit-track">
              <div className="social-orbit-ring" aria-hidden="true" />
              {[["WhatsApp", settings.whatsapp, MessageCircle], ["Telegram", settings.telegram, Send], ["Instagram", settings.instagram, Instagram], ["TikTok", settings.tiktok, Music2], ["Twitter", settings.twitter, Twitter], ["Phone", phoneUrl, Phone]].map(([label, url, Icon], index) => (
                <a key={label} href={url} target={label === "Phone" ? undefined : "_blank"} rel={label === "Phone" ? undefined : "noopener noreferrer"} className={`social-orbit-link social-orbit-link-${index + 1}`} aria-label={label}>
                  <Icon size={22} strokeWidth={1.5} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
            <img src="/images/mebri-design-logo.png" alt="Mebri Design" className="social-orbit-logo" />
          </div>
          <div className="hidden grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <FadeIn>
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
                Phone
              </span>
              <a
                href="tel:+251934290520"
                className="font-body text-lg text-foreground hover:text-cobalt transition-colors focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4"
              >
                +251 93 429 0520
              </a>
            </FadeIn>

            <FadeIn delay={0.1}>
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
                Location
              </span>
              <p className="font-body text-lg text-foreground">Addis Ababa, Ethiopia</p>
              <p className="font-body text-sm text-muted-foreground mt-1">Available for commissions worldwide</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-4">
                Messaging & Social
              </span>
                <div className="flex flex-col gap-2">
                  <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="font-body text-base text-gallery hover:text-sage">WhatsApp -&gt;</a>
                  {[["Telegram", settings.telegram], ["Instagram", settings.instagram], ["TikTok", settings.tiktok], ["Twitter", settings.twitter]].map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="font-body text-base text-gallery hover:text-sage">{label} -&gt;</a>)}
              </div>
            </FadeIn>
          </div>
          <div className="mt-20 border-t border-gallery/20 pt-8">
            <button type="button" onClick={() => setShowPrompt(true)} className="font-mono text-xs uppercase tracking-widest text-gallery/60 hover:text-sage">Update contact details</button>
          </div>
          {showPrompt && <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/80 px-6"><form onSubmit={unlockSettings} className="w-full max-w-md border border-border bg-background p-6 text-foreground"><h2 className="font-body text-2xl font-light">Admin access</h2><input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="mt-8 w-full border-b border-border bg-transparent py-3" required />{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-8 flex gap-3"><button type="submit" disabled={checking} className="bg-charcoal px-5 py-3 font-mono text-xs uppercase tracking-widest text-gallery">{checking ? "Checking..." : "Continue"}</button><button type="button" onClick={() => { setShowPrompt(false); setPassword(""); }} className="border border-border px-5 py-3 font-mono text-xs uppercase tracking-widest">Cancel</button></div></form></div>}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-8 py-16 md:py-24 border-t border-border" aria-label="Frequently asked questions">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-8">
              Collaboration FAQ
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <FAQ />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}