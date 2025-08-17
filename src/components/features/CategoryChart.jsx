import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function CategoryChart({ data }) {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <ReferenceLine y={0} />
          <Bar dataKey="Stok" fill="#ff6a00" />
          <Bar dataKey="Eksik (İhtiyaç)" fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


