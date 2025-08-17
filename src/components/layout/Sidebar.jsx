import React from "react";
import { Warehouse } from "lucide-react";

export default function Sidebar({ open, items, activeKey, onChange, onToggle }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="brand">
        <div className="brand__icon"><Warehouse className="icon" /></div>
        {open && <div className="brand__title">Stok Takip</div>}
      </div>
      <nav className="nav">
        {items.map((m) => (
          <button
            key={m.key}
            className={`nav-item ${activeKey === m.key ? "nav-item--active" : ""}`}
            onClick={() => onChange(m.key)}
            title={!open ? m.label : ""}
          >
            <m.icon className="icon" />
            {open && <span>{m.label}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <button className="toggle-btn" onClick={onToggle}>
          {open ? "←" : "→"}
        </button>
        {open && <div>v1.0.0</div>}
      </div>
    </aside>
  );
}


