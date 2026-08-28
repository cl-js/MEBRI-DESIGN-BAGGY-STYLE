import React from "react";
import ProjectImage from "./ProjectImage";

export default function ProjectImageWrapper({ src, alt, className, index }) {
  const isVideo = src && (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov"));

  return (
    <div key={`image-${index}`} className="w-full" data-image-index={index}>
      {isVideo ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`object-cover object-center ${className || ""}`}
        />
      ) : (
        <ProjectImage key={`${src}-${index}`} src={src} alt={alt} className={className} data-image-id={`image-${index}`} />
      )}
    </div>
  );
}