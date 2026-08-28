import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { projects as bundledProjects } from "@/lib/projectData";

const ADMIN_EMAIL = "englishpractice265@gmail.com";
const emptyProject = {
  title: "", subtitle: "", role: "", year: "", category: "", objective: "",
  tagline: "", description: "", image: "", heroImage: "", processImage: "", images: [],
  outcomes: [], deliverables: [],
};

function splitLines(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function serializeProject(project) {
  return {
    ...project,
    images: Array.from(new Set((project.images || []).filter(Boolean))),
    outcomes: (project.outcomes || []).filter(Boolean),
    deliverables: (project.deliverables || []).filter(Boolean),
  };
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  function isAuthorized(nextSession) {
    return nextSession?.user?.email?.toLowerCase() === ADMIN_EMAIL;
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setStatus(error.message);
      setSession(isAuthorized(data?.session) ? data.session : null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession && !isAuthorized(nextSession)) {
        setSession(null);
        supabase.auth.signOut();
        setStatus("This account is not authorized as an administrator.");
        return;
      }
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) initializeProjects();
  }, [session?.user?.id]);

  async function initializeProjects() {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("projects")
        .select("slug");
      if (fetchError) throw fetchError;

      const existingSlugs = new Set((existing || []).map((row) => row.slug));
      const missing = bundledProjects
        .filter((project) => !existingSlugs.has(project.slug))
        .map((project, index) => ({
          title: project.title,
          slug: project.slug,
          sort_order: (existing || []).reduce((highest, row) => Math.max(highest, row.sort_order || 0), 0) + index + 1,
          images: project.images || [],
          data: project,
          is_deleted: false,
        }));

      if (missing.length) {
        const { error } = await supabase.from("projects").insert(missing);
        if (error) throw error;
      }
      await loadProjects();
    } catch (error) {
      console.error("Failed to initialize projects in Supabase:", error);
      setStatus(`Unable to load projects: ${error.message}`);
    }
  }

  async function loadProjects() {
    try {
      const { data, error } = await supabase.from("projects").select("id, sort_order, images, data").eq("is_deleted", false).order("sort_order");
      if (error) throw error;
      setProjects((data || []).map((row, index) => ({
        ...row,
        data: { ...row.data, id: String(index + 1).padStart(2, "0"), images: row.images || row.data.images || [] },
      })));
      return true;
    } catch (error) {
      console.error("Failed to load projects from Supabase:", error);
      setStatus(`Unable to load projects: ${error.message}`);
      return false;
    }
  }

  async function login(event) {
    event.preventDefault();
    setStatus("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user.email.toLowerCase() !== ADMIN_EMAIL) {
        console.error("Rejected unauthorized Supabase login:", data.user.email);
        setStatus("This account is not authorized as an administrator.");
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Supabase login failed:", error);
      setStatus(error.message);
    } finally {
      setPassword("");
    }
  }

  async function seedProjects() {
    setStatus("Seeding bundled projects...");
    try {
      const rows = bundledProjects.map((project, index) => ({
        title: project.title,
        slug: project.slug,
        sort_order: index + 1,
        images: project.images || [],
        data: project,
      }));
      const { error } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
      if (error) throw error;
      if (await loadProjects()) setStatus("Bundled projects are now editable.");
    } catch (error) {
      console.error("Failed to seed projects in Supabase:", error);
      setStatus(`Unable to seed projects: ${error.message}`);
    }
  }

  function startEdit(row = null) {
    setEditing(row?.id || "new");
    setForm(row ? { ...emptyProject, ...row.data } : { ...emptyProject });
    setStatus("");
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function uploadImage(file) {
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > 15 * 1024 * 1024) throw new Error("Images must be smaller than 15 MB.");

    const response = await fetch("/api/r2-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not prepare the image upload.");

    const uploadResponse = await fetch(result.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error("Cloudflare R2 rejected the image upload.");
    return result.publicUrl;
  }

  async function uploadSingleImage(field, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingImages(true);
    setStatus(`Uploading ${file.name}...`);
    try {
      const url = await uploadImage(file);
      updateField(field, url);
      setStatus("Image uploaded. Save the project to store its URL in Supabase.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setUploadingImages(false);
    }
  }

  async function uploadGalleryImages(event) {
    const availableSlots = 3 - (form.images || []).length;
    const files = Array.from(event.target.files || []).slice(0, availableSlots);
    event.target.value = "";
    if (!files.length) {
      if (availableSlots <= 0) setStatus("You can add a maximum of 3 gallery images.");
      return;
    }
    setUploadingImages(true);
    try {
      for (const file of files) {
        setStatus(`Uploading ${file.name}...`);
        const url = await uploadImage(file);
        setForm((current) => ({ ...current, images: [...(current.images || []), url].slice(0, 3) }));
      }
      setStatus("Gallery images uploaded. Save the project to store their URLs in Supabase.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setUploadingImages(false);
    }
  }

  function removeGalleryImage(url) {
    setForm((current) => ({
      ...current,
      images: (current.images || []).filter((imageUrl) => imageUrl !== url),
    }));
  }

  async function saveProject(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setStatus("");
    try {
      const title = form.title.trim();
      if (!title) {
        setStatus("A project title is required.");
        return;
      }
      const existing = projects.find((row) => row.id === editing);
      const fallbackSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const project = serializeProject({
        ...form,
        title,
        id: editing === "new" ? String(projects.length + 1).padStart(2, "0") : form.id,
        slug: form.slug?.trim() || `${fallbackSlug}-${editing === "new" ? Date.now() : form.id}`,
      });
      const nextSortOrder = existing?.sort_order || projects.reduce((highest, row) => Math.max(highest, row.sort_order || 0), 0) + 1;
      const payload = { title: project.title, slug: project.slug, sort_order: nextSortOrder, images: project.images, data: project };
      const query = existing
        ? supabase.from("projects").update(payload).eq("id", existing.id)
        : supabase.from("projects").insert(payload);
      const { data: savedRows, error } = await query.select("id");
      if (error) {
        setStatus(error.code === "23505" ? "That slug is already in use. Choose a unique slug." : error.message);
      } else if (!savedRows?.length) {
        setStatus("Project was not saved. Check the Supabase admin update policy.");
      } else {
        if (await loadProjects()) {
          setStatus("Project saved.");
          setEditing(null);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function renumberActiveProjects() {
    try {
      const { data: activeProjects, error: fetchError } = await supabase
        .from("projects")
        .select("id, sort_order, data")
        .eq("is_deleted", false)
        .order("sort_order", { ascending: true });
      if (fetchError) throw fetchError;

      for (const [index, projectRow] of activeProjects.entries()) {
        const nextId = String(index + 1).padStart(2, "0");
        const nextData = { ...projectRow.data, id: nextId };
        const { error } = await supabase
          .from("projects")
          .update({ sort_order: index + 1, data: nextData, title: nextData.title })
          .eq("id", projectRow.id);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Failed to renumber projects in Supabase:", error);
      return error;
    }

    return null;
  }

  async function deleteProject(row) {
    if (deleting) return;
    if (!window.confirm(`Delete ${row.data.title}?`)) return;
    setDeleting(true);
    try {
      const { data: deletedRows, error } = await supabase
        .from("projects")
        .update({ is_deleted: true })
        .eq("id", row.id)
        .select("id");
      if (error) throw error;
      if (!deletedRows?.length) throw new Error("Project was not deleted. Check the Supabase admin update policy.");

      const renumberError = await renumberActiveProjects();
      if (renumberError) throw renumberError;
      if (await loadProjects()) setStatus("Project deleted and remaining projects renumbered.");
    } catch (error) {
      console.error("Failed to delete project in Supabase:", error);
      setStatus(`Unable to delete project: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="min-h-screen p-8 pt-32">Loading admin...</div>;
  if (!supabase) return <div className="min-h-screen p-8 pt-32">Supabase is not configured.</div>;
  if (!session) return (
    <main className="min-h-screen px-6 pb-20 pt-28 md:px-8 md:pt-36">
      <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Back home</Link>
      <h1 className="font-body text-5xl font-light mt-12 mb-4">Admin access</h1>
      <p className="text-muted-foreground mb-10">Sign in with the authorized Supabase account.</p>
      <form onSubmit={login} className="space-y-6">
        <input className="w-full border-b border-border bg-transparent py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border-b border-border bg-transparent py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button className="bg-charcoal text-gallery px-6 py-3" type="submit">Sign in</button>
      </form>
      {status && <p className="mt-6 text-sm text-red-600" role="alert">{status}</p>}
    </main>
  );

  return (
    <main className="min-h-screen px-6 pb-20 pt-28 md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
      <div className="mb-12 flex flex-col items-start justify-between gap-8 border-t border-border pt-6 lg:flex-row lg:items-end">
        <div><Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Back home</Link><h1 className="font-body text-5xl font-light mt-6">Projects admin</h1></div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto"><button onClick={() => startEdit()} className="bg-charcoal px-4 py-3 text-sm uppercase tracking-widest text-gallery transition-colors hover:bg-cobalt">Add project</button><button onClick={seedProjects} className="border border-border px-4 py-3 text-sm uppercase tracking-widest transition-colors hover:border-cobalt hover:text-cobalt">Load bundled projects</button><button onClick={() => supabase.auth.signOut()} className="border border-border px-4 py-3 text-sm uppercase tracking-widest transition-colors hover:border-red-600 hover:text-red-600">Sign out</button></div>
      </div>
      {status && <p className="mb-6 text-sm text-muted-foreground">{status}</p>}
      {editing && <form onSubmit={saveProject} className="mb-10 grid min-w-0 grid-cols-1 gap-5 border-y border-border px-0 py-6 sm:p-6 md:grid-cols-2">
        {[['title','Title'],['subtitle','Subtitle'],['slug','Slug'],['category','Category'],['year','Year'],['role','Role'],['tagline','Tagline'],['objective','Objective'],['description','Description']].map(([field, label]) => <label key={field} className={`min-w-0 ${field === 'description' || field === 'objective' ? 'md:col-span-2' : ''}`}><span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>{['description', 'objective'].includes(field) ? <textarea className="min-h-24 w-full min-w-0 border border-border bg-transparent p-3 break-words" value={form[field] || ''} onChange={(e) => updateField(field, e.target.value)} /> : <input className="w-full min-w-0 border-b border-border bg-transparent py-2" value={form[field] || ''} onChange={(e) => updateField(field, e.target.value)} required={field === 'title'} />}</label>)}
        <div className="grid min-w-0 gap-5 md:col-span-2 md:grid-cols-3">{[['image','Cover image'],['heroImage','Hero image'],['processImage','Process image']].map(([field, label]) => <label key={field} className="min-w-0"><span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span><input className="w-full min-w-0 border border-border bg-transparent p-3 text-sm" type="file" accept="image/*" onChange={(event) => uploadSingleImage(field, event)} disabled={uploadingImages} />{form[field] && <span className="mt-2 block truncate text-xs text-muted-foreground">Uploaded</span>}</label>)}</div>
        <div className="min-w-0 md:col-span-2"><div className="mb-2 flex items-center justify-between gap-3"><span className="block text-xs uppercase tracking-widest text-muted-foreground">Gallery images</span><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{(form.images || []).length}/3 images</span></div><input className="w-full min-w-0 border border-border bg-transparent p-3 text-sm disabled:cursor-not-allowed disabled:opacity-50" type="file" accept="image/*" multiple onChange={uploadGalleryImages} disabled={uploadingImages || (form.images || []).length >= 3} />{(form.images || []).length >= 3 && <p className="mt-2 text-xs text-muted-foreground">Maximum of 3 gallery images reached.</p>}{(form.images || []).length > 0 && <div className="mt-4 space-y-2">{form.images.map((imageUrl) => <div key={imageUrl} className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-2"><span className="min-w-0 truncate text-sm text-muted-foreground">Uploaded image</span><button className="shrink-0 text-xs uppercase tracking-widest text-red-600 transition-colors hover:text-red-800" type="button" onClick={() => removeGalleryImage(imageUrl)} disabled={uploadingImages}>Remove</button></div>)}</div>}</div>
        {[['outcomes','Outcomes'],['deliverables','Deliverables']].map(([field,label]) => <label key={field} className="min-w-0"><span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</span><textarea className="min-h-24 w-full min-w-0 border border-border bg-transparent p-3 break-words" value={(form[field] || []).join("\n")} onChange={(e) => updateField(field, splitLines(e.target.value))} /></label>)}
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row md:col-span-2"><button className="w-full bg-charcoal px-5 py-3 text-sm uppercase tracking-widest text-gallery transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto" type="submit" disabled={saving || uploadingImages}>{saving ? "Saving..." : uploadingImages ? "Uploading..." : "Save project"}</button><button className="w-full border border-border px-5 py-3 text-sm uppercase tracking-widest transition-colors hover:border-cobalt hover:text-cobalt sm:w-auto" type="button" onClick={() => setEditing(null)} disabled={saving || uploadingImages}>Cancel</button></div>
      </form>}
      <div className="border-t border-border">{projects.map((row) => <div key={row.id} className="grid gap-5 border-b border-border py-6 md:grid-cols-[1fr_auto] md:items-center"><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-4 gap-y-1"><span className="font-mono text-xs text-muted-foreground">{row.data.id}</span><strong className="font-body text-xl font-light tracking-tight">{row.data.title}</strong></div><span className="mt-2 block text-sm text-muted-foreground">{row.data.category}</span></div><div className="flex flex-wrap gap-2"><button className="border border-border px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:border-cobalt hover:text-cobalt disabled:cursor-not-allowed disabled:opacity-50" onClick={() => startEdit(row)} disabled={deleting}>Edit</button><button className="border border-red-300 px-3 py-2 text-xs uppercase tracking-widest text-red-700 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={() => deleteProject(row)} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button></div></div>)}</div>
      </div>
    </main>
  );
}
