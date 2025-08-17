import React from "react";

export default function Button({ className = "", variant = "default", children, ...props }) {
  return (
    <button className={`btn ${variant ? `btn--${variant}` : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}


