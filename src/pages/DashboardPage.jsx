import React, { useMemo } from "react";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import Stat from "../components/ui/Stat.jsx";
import FilterBar from "../components/features/FilterBar.jsx";
import QuickActions from "../components/features/QuickActions.jsx";
import CategoryChart from "../components/features/CategoryChart.jsx";
import { Box, ShoppingCart, AlertTriangle, FileBarChart2, Plus, PackageCheck } from "lucide-react";
import { CATEGORIES } from "../utils/constants.js";

export default function DashboardPage({ items, query, setQuery, category, setCategory, onlyLow, setOnlyLow, onExportCSV, onOpenAdd, onOpenStock, onOpenReports }) {
  const totalSku = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowStock = items.filter((i) => i.stock > 0 && i.stock <= i.reorderPoint).length;
  const outStock = items.filter((i) => i.stock === 0).length;
  const totalValue = items.reduce((s, i) => s + i.stock * (i.cost ?? i.price ?? 0), 0);

  const chartData = useMemo(() => {
    return CATEGORIES.map((c) => {
      const inCat = items.filter((i) => i.category === c);
      const total = inCat.reduce((s, i) => s + i.stock, 0);
      const need = inCat.reduce((s, i) => s + Math.max(0, i.reorderPoint - i.stock), 0);
      return { category: c, Stok: total, "Eksik (İhtiyaç)": need };
    });
  }, [items]);

  return (
    <>
      <Card>
        <FilterBar
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          onlyLow={onlyLow}
          onOnlyLow={setOnlyLow}
          categories={CATEGORIES}
          onExport={onExportCSV}
          items={items}
        />
      </Card>

      <section className="stats-grid">
        <Card><Stat icon={Box} label="Toplam Ürün" value={totalSku} sub="↑ %12" /></Card>
        <Card><Stat icon={ShoppingCart} label="Toplam Stok" value={totalStock} sub="↑ %8" /></Card>
        <Card><Stat icon={AlertTriangle} label="Düşük Stok" value={lowStock + outStock} sub={`kritik: ${lowStock}, stoksuz: ${outStock}`} /></Card>
        <Card><Stat icon={FileBarChart2} label="Toplam Değer" value={`₺${totalValue.toLocaleString("tr-TR")}`} sub="Maliyet esaslı" /></Card>
      </section>

      <section className="grid-3">
        <Card>
          <CardHeader title="Düşük Stok Uyarıları" />
          <div className="card__body">
            {items.filter((i) => i.stock <= i.reorderPoint).length === 0 ? (
              <div className="empty">Tüm ürünlerde yeterli stok bulunuyor!</div>
            ) : (
              <ul className="list">
                {items
                  .filter((i) => i.stock <= i.reorderPoint)
                  .map((i) => (
                    <li key={i.id} className="list__item">
                      <div>
                        <div className="list__title">{i.name}</div>
                        <div className="muted">{i.id} • ROP: {i.reorderPoint} • Stok: {i.stock}</div>
                      </div>
                      {i.incoming > 0 ? (
                        <span className="chip chip--soft">Yolda: {i.incoming}</span>
                      ) : (
                        <span className="chip chip--danger">Sipariş gerekli</span>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="recent-products">
          <CardHeader title="Son Eklenen Ürünler" />
          <div className="card__body">
            <ul className="list list--plain">
              {items.map((i) => (
                <li key={i.id} className="list__item list__item--plain">
                  <div>
                    <div className="list__title">{i.name}</div>
                    <div className="muted">{new Date(i.createdAt || Date.now()).toLocaleDateString("tr-TR")}</div>
                  </div>
                  <div className="price">₺{i.price}</div>
                </li>
              ))}
            </ul>
            <div className="link">Tüm ürünleri görüntüle →</div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Kategori Bazlı Stok & İhtiyaç" />
          <CategoryChart data={chartData} />
        </Card>
      </section>

      <QuickActions
        actions={[
          { title: "Yeni Ürün Ekle", desc: "Stok sistemine yeni ürün ekleyin", icon: Plus, onClick: onOpenAdd, accent: true },
          { title: "Stok Güncelle", desc: "Mevcut stok miktarlarını güncelleyin", icon: PackageCheck, onClick: onOpenStock },
          { title: "Raporları Görüntüle", desc: "Detaylı stok raporlarını inceleyin", icon: FileBarChart2, onClick: onOpenReports },
        ]}
      />
    </>
  );
}


