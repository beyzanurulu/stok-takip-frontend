import React from "react";
import { Search, Filter, Download } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function FilterBar({ query, onQuery, category, onCategory, onlyLow, onOnlyLow, categories, onExport }) {
  return (
    <div className="filter-bar">
      <div className="search">
        <Search className="icon search__icon" />
        <input className="input search__input" placeholder="SKU, ürün adı, kategori, lokasyon ara..." value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      <div className="filter-actions">
        <select className="input select" value={category} onChange={(e) => onCategory(e.target.value)}>
          <option>Hepsi</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="checkbox">
          <input type="checkbox" checked={onlyLow} onChange={(e) => onOnlyLow(e.target.checked)} />
          <span>Sadece kritik stok</span>
        </label>
        <Button className="inline-flex gap-2"><Filter className="icon" /> Gelişmiş Filtreler</Button>
        <Button className="inline-flex gap-2" onClick={onExport}><Download className="icon" /> Dışa Aktar</Button>
      </div>
    </div>
  );
}


