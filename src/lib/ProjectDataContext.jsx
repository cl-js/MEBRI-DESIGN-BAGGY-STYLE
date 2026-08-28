import React, { createContext, useContext, useEffect, useState } from "react";
import { projects as bundledProjects } from "@/lib/projectData";
import { supabase } from "@/lib/supabaseClient";

const ProjectDataContext = createContext(null);

export function ProjectDataProvider({ children }) {
  const [projects, setProjects] = useState(bundledProjects);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("projects")
        .select("sort_order, images, data")
        .eq("is_deleted", false)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load public projects from Supabase:", error);
      } else if (data?.length && active) {
        const remoteProjects = data.map((row) => ({ ...row.data, images: row.images || row.data.images || [] }));
        const isCurrentCatalog = remoteProjects.every((project) => ["Upper", "Lower", "Outerwear", "Sets", "Essentials"].includes(project.category));
        if (isCurrentCatalog) setProjects(remoteProjects);
      }
    }

    loadProjects();
    return () => { active = false; };
  }, []);

  return (
    <ProjectDataContext.Provider value={{ projects, projectCount: projects.length }}>
      {children}
    </ProjectDataContext.Provider>
  );
}

export function useProjectData() {
  const context = useContext(ProjectDataContext);
  if (!context) throw new Error("useProjectData must be used within ProjectDataProvider");
  return context;
}
