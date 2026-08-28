import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "englishpractice265@gmail.com";
const defaultSettings = {
  location: "Addis Ababa, Ethiopia",
  mapQuery: "Addis Ababa, Ethiopia",
  myLocation: "https://maps.app.goo.gl/6YKNdJUvh3XbZ2Aq7?g_st=atm",
  phone: "+251 93 429 0520",
  whatsapp: "https://wa.me/251934290520",
  instagram: "https://instagram.com",
  telegram: "https://t.me/MTdesignerandmodel",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
};

const fields = [
  ["location", "Displayed location"],
  ["mapQuery", "Google Maps search"],
  ["myLocation", "My location in Google Maps"],
  ["phone", "Phone number"],
  ["whatsapp", "WhatsApp URL"],
  ["instagram", "Instagram URL"],
  ["telegram", "Telegram URL"],
  ["tiktok", "TikTok URL"],
  ["twitter", "Twitter URL"],
];

export default function UpdateContact() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { navigate("/contact", { replace: true }); return; }
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
        navigate("/contact", { replace: true });
        return;
      }
      const { data, error } = await supabase.from("contact_settings").select("settings").eq("id", 1).maybeSingle();
      if (active) {
        if (error) setStatus(error.message);
        if (data?.settings) setSettings({ ...defaultSettings, ...data.settings });
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [navigate]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    const { error } = await supabase.from("contact_settings").upsert({ id: 1, settings }, { onConflict: "id" });
    setStatus(error ? `Unable to save: ${error.message}` : "Contact details updated.");
    setSaving(false);
  }

  if (loading) return <main className="min-h-screen px-6 pt-32 md:px-8">Loading contact settings...</main>;

  return (
    <main className="min-h-screen px-6 pb-20 pt-28 md:px-8 md:pt-36">
      <div className="mx-auto max-w-4xl">
        <Link to="/contact" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-cobalt">Back to contact</Link>
        <div className="mb-12 mt-8 border-t border-border pt-6">
          <h1 className="font-body text-5xl font-light tracking-tight">Update contact</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">Manage the map, precise location link, phone number, and social channels shown publicly.</p>
        </div>
        {status && <p className="mb-6 text-sm text-muted-foreground" role="status">{status}</p>}
        <form onSubmit={save} className="grid grid-cols-1 gap-6 border-y border-border py-8 md:grid-cols-2">
          {fields.map(([field, label]) => <label key={field} className={field === "myLocation" ? "md:col-span-2" : ""}><span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span><input className="w-full border-b border-border bg-transparent py-3 outline-none transition-colors focus:border-cobalt" value={settings[field]} onChange={(event) => setSettings((current) => ({ ...current, [field]: event.target.value }))} required /></label>)}
          <div className="flex flex-wrap gap-3 pt-4 md:col-span-2"><button type="submit" disabled={saving} className="bg-charcoal px-6 py-3 font-mono text-xs uppercase tracking-widest text-gallery transition-colors hover:bg-cobalt disabled:opacity-50">{saving ? "Saving..." : "Save contact details"}</button><button type="button" onClick={() => navigate("/contact")} className="border border-border px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-cobalt hover:text-cobalt">Cancel</button></div>
        </form>
      </div>
    </main>
  );
}
