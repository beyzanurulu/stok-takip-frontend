import React from "react";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import { CATEGORIES } from "../utils/constants.js";

export default function AddProductModal({ open, onClose, form, setForm, errors, onSubmit }) {
  return (
    <Modal
      title="Yeni Ürün Ekle"
      open={open}
      onClose={onClose}
      footer={
        <div className="modal__actions">
          <Button onClick={onClose}>Vazgeç</Button>
          <Button variant="primary" onClick={onSubmit}>Kaydet</Button>
        </div>
      }
    >
      <div className="form-grid">
        <label className="form-row">
          <span>Ürün Adı</span>
          <input className={`input ${errors.name ? "input--error" : ""}`} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          {errors.name && <div className="error">{errors.name}</div>}
        </label>

        <label className="form-row">
          <span>Kategori</span>
          <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label className="form-row">
          <span>Lokasyon</span>
          <select className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>
            <option>Depo-1</option>
            <option>Depo-2</option>
            <option>Depo-3</option>
          </select>
        </label>

        <label className="form-row">
          <span>Birim</span>
          <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
            <option>adet</option>
            <option>kutu</option>
            <option>paket</option>
          </select>
        </label>

        <label className="form-row">
          <span>Başlangıç Stok</span>
          <input type="number" className={`input ${errors.stock ? "input--error" : ""}`} value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          {errors.stock && <div className="error">{errors.stock}</div>}
        </label>

        <label className="form-row">
          <span>ROP</span>
          <input type="number" className={`input ${errors.reorderPoint ? "input--error" : ""}`} value={form.reorderPoint} onChange={e => setForm({...form, reorderPoint: e.target.value})} />
          {errors.reorderPoint && <div className="error">{errors.reorderPoint}</div>}
        </label>

        <label className="form-row">
          <span>Satış Fiyatı (₺)</span>
          <input type="number" className={`input ${errors.price ? "input--error" : ""}`} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          {errors.price && <div className="error">{errors.price}</div>}
        </label>

        <label className="form-row">
          <span>Maliyet (₺)</span>
          <input type="number" className={`input ${errors.cost ? "input--error" : ""}`} value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
          {errors.cost && <div className="error">{errors.cost}</div>}
        </label>

        <label className="form-row form-row--full">
          <span>Barkod / SKU Notu</span>
          <input className="input" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} placeholder="Barkod veya kısa not" />
        </label>
      </div>
    </Modal>
  );
}


