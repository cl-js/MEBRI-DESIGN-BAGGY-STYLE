import React from "react";

export default function ProjectImage({ src, alt, className, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover object-center ${className || ""}`}
      loading="lazy"
      {...props}
    />
  );
}