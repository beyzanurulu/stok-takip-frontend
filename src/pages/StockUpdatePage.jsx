import React, { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Search } from "lucide-react";

export default function StockUpdatePage({ items, setItems, onBack }) {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setNewStock(item.stock);
  };

  const handleSave = (itemId) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, stock: Number(newStock) }
        : item
    ));
    setEditingItem(null);
    setNewStock("");
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewStock("");
  };

  return (
    <div className="stock-update-view">
      <div className="stock-header">
        <button className="btn btn--primary inline-flex gap-2" onClick={onBack}>
          ← Dashboard'a Dön
        </button>
        <h2>Stok Güncelleme</h2>
      </div>

      <Card className="mb-4">
        <div className="card__body">
          <div className="search">
            <Search className="icon search__icon" />
            <input
              className="input search__input"
              placeholder="Ürün ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="stock-table">
          <div className="table-header">
            <div>Ürün</div>
            <div>SKU</div>
            <div>Kategori</div>
            <div>Mevcut Stok</div>
            <div>Yeni Stok</div>
            <div>İşlem</div>
          </div>
          {filtered.map(item => (
            <div key={item.id} className="table-row">
              <div>{item.name}</div>
              <div>{item.id}</div>
              <div>{item.category}</div>
              <div>{item.stock}</div>
              <div>
                {editingItem === item.id ? (
                  <input
                    type="number"
                    className="input table-input"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                ) : (
                  <span>{item.stock}</span>
                )}
              </div>
              <div>
                {editingItem === item.id ? (
                  <div className="inline-flex gap-2">
                    <Button variant="primary" onClick={() => handleSave(item.id)}>Kaydet</Button>
                    <Button onClick={handleCancel}>İptal</Button>
                  </div>
                ) : (
                  <Button onClick={() => handleEdit(item)}>Düzenle</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


