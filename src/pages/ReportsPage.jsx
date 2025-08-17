import React, { useState } from "react";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import Stat from "../components/ui/Stat.jsx";
import { FileBarChart2, Layers, ShoppingCart, Warehouse, AlertTriangle, Box } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { CATEGORIES } from "../utils/constants.js";

export default function ReportsPage({ items, onBack }) {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");

  const totalSku = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowStockItems = items.filter(i => i.stock > 0 && i.stock <= i.reorderPoint);
  const outOfStockItems = items.filter(i => i.stock === 0);
  const totalCostValue = items.reduce((s, i) => s + (i.stock * (i.cost || 0)), 0);
  const totalSaleValue = items.reduce((s, i) => s + (i.stock * (i.price || 0)), 0);
  const potentialProfit = totalSaleValue - totalCostValue;

  const categoryData = CATEGORIES.map(cat => {
    const categoryItems = items.filter(i => i.category === cat);
    const totalQty = categoryItems.reduce((s, i) => s + i.stock, 0);
    const totalValue = categoryItems.reduce((s, i) => s + (i.stock * (i.cost || i.price || 0)), 0);
    const lowStock = categoryItems.filter(i => i.stock <= i.reorderPoint).length;
    return { category: cat, quantity: totalQty, value: totalValue, lowStock, items: categoryItems.length };
  });

  const locationData = ["Depo-1", "Depo-2", "Depo-3"].map(loc => {
    const locationItems = items.filter(i => i.location === loc);
    const totalQty = locationItems.reduce((s, i) => s + i.stock, 0);
    const totalValue = locationItems.reduce((s, i) => s + (i.stock * (i.cost || i.price || 0)), 0);
    return { location: loc, quantity: totalQty, value: totalValue, items: locationItems.length };
  });

  const topValueItems = [...items]
    .map(item => ({ ...item, totalValue: item.stock * (item.cost || item.price || 0) }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const reportTabs = [
    { key: "overview", label: "Genel Özet", icon: FileBarChart2 },
    { key: "category", label: "Kategori Analizi", icon: Layers },
    { key: "financial", label: "Finansal Rapor", icon: ShoppingCart },
    { key: "location", label: "Lokasyon Raporu", icon: Warehouse },
    { key: "alerts", label: "Stok Uyarıları", icon: AlertTriangle },
  ];

  return (
    <div className="reports-view">
      <div className="reports-header">
        <button className="btn btn--primary inline-flex gap-2" onClick={onBack}>
          ← Dashboard'a Dön
        </button>
        <h2>Raporlar ve Analizler</h2>
        <select className="input select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">Tüm Zamanlar</option>
          <option value="month">Bu Ay</option>
          <option value="week">Bu Hafta</option>
        </select>
      </div>

      <Card className="mb-4">
        <div className="report-tabs">
          {reportTabs.map(tab => (
            <button
              key={tab.key}
              className={`report-tab ${selectedReport === tab.key ? 'report-tab--active' : ''}`}
              onClick={() => setSelectedReport(tab.key)}
            >
              <tab.icon className="icon" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {selectedReport === "overview" && (
        <div className="report-content">
          <section className="stats-grid mb-4">
            <Card><Stat icon={Box} label="Toplam SKU" value={totalSku} sub="Aktif ürün çeşidi" /></Card>
            <Card><Stat icon={ShoppingCart} label="Toplam Stok" value={totalStock.toLocaleString()} sub="adet" /></Card>
            <Card><Stat icon={AlertTriangle} label="Kritik Durum" value={lowStockItems.length + outOfStockItems.length} sub={`${lowStockItems.length} düşük, ${outOfStockItems.length} tükendi`} /></Card>
            <Card><Stat icon={FileBarChart2} label="Stok Değeri" value={`₺${totalCostValue.toLocaleString()}`} sub="Maliyet bazlı" /></Card>
          </section>

          <div className="grid-2 mb-4">
            <Card>
              <CardHeader title="Kategori Bazlı Stok Dağılımı" />
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#ff6a00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader title="En Değerli Ürünler" />
              <div className="card__body">
                <ul className="list">
                  {topValueItems.map(item => (
                    <li key={item.id} className="list__item">
                      <div>
                        <div className="list__title">{item.name}</div>
                        <div className="muted">{item.stock} adet • {item.category}</div>
                      </div>
                      <div className="price">₺{item.totalValue.toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedReport === "category" && (
        <div className="report-content">
          <Card>
            <CardHeader title="Kategori Detay Analizi" />
            <div className="category-table">
              <div className="table-header">
                <div>Kategori</div>
                <div>Ürün Sayısı</div>
                <div>Toplam Stok</div>
                <div>Toplam Değer</div>
                <div>Kritik Stok</div>
                <div>Ortalama Stok</div>
              </div>
              {categoryData.map(cat => (
                <div key={cat.category} className="table-row">
                  <div className="font-medium">{cat.category}</div>
                  <div>{cat.items}</div>
                  <div>{cat.quantity.toLocaleString()}</div>
                  <div>₺{cat.value.toLocaleString()}</div>
                  <div>
                    <span className={`chip ${cat.lowStock > 0 ? 'chip--danger' : 'chip--soft'}`}>
                      {cat.lowStock} ürün
                    </span>
                  </div>
                  <div>{cat.items > 0 ? Math.round(cat.quantity / cat.items) : 0}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "financial" && (
        <div className="report-content">
          <section className="stats-grid mb-4">
            <Card><Stat icon={ShoppingCart} label="Toplam Maliyet" value={`₺${totalCostValue.toLocaleString()}`} sub="Stok maliyet değeri" /></Card>
            <Card><Stat icon={FileBarChart2} label="Satış Değeri" value={`₺${totalSaleValue.toLocaleString()}`} sub="Potansiyel satış değeri" /></Card>
            <Card><Stat icon={AlertTriangle} label="Potansiyel Kar" value={`₺${potentialProfit.toLocaleString()}`} sub={`%${((potentialProfit/totalCostValue)*100).toFixed(1)} marj`} /></Card>
            <Card><Stat icon={Box} label="Ortalama Marj" value={`%${((potentialProfit/totalCostValue)*100).toFixed(1)}`} sub="Kar oranı" /></Card>
          </section>

          <Card>
            <CardHeader title="Kategori Bazlı Karlılık Analizi" />
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#ff6a00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "location" && (
        <div className="report-content">
          <div className="grid-2">
            <Card>
              <CardHeader title="Lokasyon Bazlı Dağılım" />
              <div className="card__body">
                <ul className="list">
                  {locationData.map(loc => (
                    <li key={loc.location} className="list__item">
                      <div>
                        <div className="list__title">{loc.location}</div>
                        <div className="muted">{loc.items} çeşit ürün</div>
                      </div>
                      <div>
                        <div className="price">{loc.quantity.toLocaleString()} adet</div>
                        <div className="muted">₺{loc.value.toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card>
              <CardHeader title="Depo Doluluk Oranları" />
              <div className="chart">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={locationData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#ff6a00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedReport === "alerts" && (
        <div className="report-content">
          <div className="grid-2">
            <Card>
              <CardHeader title="Kritik Stok Uyarıları" />
              <div className="card__body">
                {lowStockItems.length === 0 ? (
                  <div className="empty">Kritik stokta ürün bulunmuyor! 🎉</div>
                ) : (
                  <ul className="list">
                    {lowStockItems.map(item => (
                      <li key={item.id} className="list__item">
                        <div>
                          <div className="list__title">{item.name}</div>
                          <div className="muted">{item.id} • {item.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="price">{item.stock}/{item.reorderPoint}</div>
                          <span className="chip chip--danger">Kritik</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Stoksuz Ürünler" />
              <div className="card__body">
                {outOfStockItems.length === 0 ? (
                  <div className="empty">Stoksuz ürün bulunmuyor! ✅</div>
                ) : (
                  <ul className="list">
                    {outOfStockItems.map(item => (
                      <li key={item.id} className="list__item">
                        <div>
                          <div className="list__title">{item.name}</div>
                          <div className="muted">{item.id} • {item.location}</div>
                        </div>
                        <div className="text-right">
                          <span className="chip chip--danger">Tükendi</span>
                          {item.incoming > 0 && (
                            <div className="muted">Yolda: {item.incoming}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}


