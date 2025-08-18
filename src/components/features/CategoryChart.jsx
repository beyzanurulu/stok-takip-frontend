import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function CategoryChart({ data }) {
  // Custom XAxis tick formatter to ensure all categories are visible
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            tick={<CustomXAxisTick />}
            interval={0} // Tüm kategorileri göster
            height={60} // Alt boşluk artırıldı
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              value, 
              name === 'Stok' ? 'Stok Miktarı' : 'Eksik (İhtiyaç)'
            ]}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <ReferenceLine y={0} />
          <Bar dataKey="Stok" fill="#ff6a00" name="Stok" />
          <Bar dataKey="Eksik (İhtiyaç)" fill="#94a3b8" name="Eksik (İhtiyaç)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


