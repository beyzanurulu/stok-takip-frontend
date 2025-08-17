import React from "react";

export default function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat__icon"><Icon className="icon" /></div>
      <div className="stat__body">
        <div className="stat__label">{label}</div>
        <div className="stat__value">{value}</div>
        {sub && <div className="stat__sub">{sub}</div>}
      </div>
    </div>
  );
}


