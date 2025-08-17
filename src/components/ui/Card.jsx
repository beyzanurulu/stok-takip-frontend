import React from "react";

export function Card({ className = "", children }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, right }) {
  return (
    <div className="card__header">
      <div className="card__title">{title}</div>
      <div>{right}</div>
    </div>
  );
}


