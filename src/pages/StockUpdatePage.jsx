import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { Search } from "lucide-react";
import { CATEGORIES } from "../utils/constants.js";

export default function StockUpdatePage({ items, setItems, onBack }) {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Autocomplete suggestions
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const results = [];
    
    // Ürün adlarından öneriler
    items.forEach(item => {
      if (item.name.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'product',
          text: item.name,
          category: item.category,
          icon: '📦'
        });
      }
    });
    
    // Kategorilerden öneriler
    CATEGORIES.forEach(cat => {
      if (cat.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'category',
          text: cat,
          icon: '🏷️'
        });
      }
    });
    
    // SKU'lardan öneriler
    items.forEach(item => {
      if (item.id.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'sku',
          text: item.id,
          name: item.name,
          icon: '🏷️'
        });
      }
    });
    
    return results.slice(0, 8);
  }, [query, items]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
  };

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
          <div className="search" ref={searchRef}>
            <Search className="icon search__icon" />
            <input
              className="input search__input"
              placeholder="SKU, ürün adı, kategori ara..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => query.length > 0 && setShowSuggestions(true)}
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="search-suggestions">
                {filteredSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <div className="suggestion-content">
                      <div className="suggestion-text">{suggestion.text}</div>
                      {suggestion.category && (
                        <div className="suggestion-category">{suggestion.category}</div>
                      )}
                      {suggestion.name && (
                        <div className="suggestion-name">{suggestion.name}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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


