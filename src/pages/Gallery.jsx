import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useProjectData } from "@/lib/ProjectDataContext";

export default function Gallery() {
  const { projects } = useProjectData();
  return (
    <div className="bg-charcoal text-gallery">
      <section className="px-5 pb-20 pt-36 md:px-8 md:pb-32 md:pt-48">
        <div className="grid grid-cols-12 gap-4 border-t border-white/20 pt-4">
          <span className="col-span-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Lookbook / 01</span>
          <h1 className="display-word col-span-9 max-w-4xl text-5xl font-semibold leading-[0.88] tracking-tight md:text-8xl">FORM IN<br /><span className="text-white/45">MOTION.</span></h1>
        </div>
        <p className="mt-20 max-w-sm font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-white/55 md:ml-[25%]">A study in relaxed proportion, layered volume, and the quiet confidence of clothes made for movement.</p>
      </section>
      <section className="bg-background px-5 py-20 text-foreground md:px-8 md:py-32" aria-label="Mebri lookbook">
        <div className="mb-14 flex items-end justify-between border-b border-border pb-4"><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">The looks</span><span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">08 / 08</span></div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:grid-cols-12">
          {projects.map((project, index) => (
            <Link key={project.slug} to={`/project/${project.slug}`} className={`group ${index % 3 === 0 ? "md:col-span-7" : "md:col-span-5"}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-muted"><img src={project.image} alt={`${project.title}, ${project.category}`} loading="lazy" className="fashion-image h-full w-full object-cover group-hover:scale-[1.04]" /><span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/75">Look {project.id}</span></div>
              <div className="flex items-start justify-between border-b border-border py-4"><div><h2 className="text-xl font-medium">{project.title}</h2><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{project.category} / {project.fit}</p></div><ArrowUpRight size={17} strokeWidth={1.2} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
