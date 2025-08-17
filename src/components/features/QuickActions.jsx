import React from "react";

export default function QuickActions({ actions }) {
  return (
    <section className="quick-actions">
      {actions.map(({ title, desc, icon: Icon, onClick, accent }, idx) => (
        <div className="card" key={title}>
          <button className={`quick ${accent ? "quick--accent" : ""}`} onClick={onClick}>
            <div className="quick__icon"><Icon className="icon" /></div>
            <div>
              <div className="quick__title">{title}</div>
              <div className="muted">{desc}</div>
            </div>
          </button>
        </div>
      ))}
    </section>
  );
}


