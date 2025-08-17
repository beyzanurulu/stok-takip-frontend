import React, { useState } from "react";
import "./App.css";
import { FileBarChart2, Layers, Plus, PackageCheck, Settings } from "lucide-react";
import Sidebar from "./components/layout/Sidebar.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import StockUpdatePage from "./pages/StockUpdatePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AddProductModal from "./pages/AddProductModal.jsx";
import { MOCK_ITEMS } from "./utils/constants.js";
import { NAV_ITEMS } from "./utils/nav.js";
import useProducts from "./hooks/useProducts.js";


export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Hepsi");
  const [onlyLow, setOnlyLow] = useState(false);
  const { items, setItems } = useProducts();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportsView, setReportsView] = useState(false);
  const [settingsView, setSettingsView] = useState(false);

  // Toggle function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Sidebar menüsü sabitlere taşındı
  const [active, setActive] = useState("dashboard");

  // Ürün Ekle modalı & formu
const [addOpen, setAddOpen] = useState(false);
const [stockView, setStockView] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Aksesuar",
    location: "Depo-1",
    unit: "adet",
    stock: 0,
    reorderPoint: 10,
    price: 0,
    cost: 0,
    barcode: ""
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Ürün adı gerekli";
    if (!form.category) e.category = "Kategori gerekli";
    if (!form.location) e.location = "Lokasyon gerekli";
    if (form.stock < 0) e.stock = "Stok negatif olamaz";
    if (form.reorderPoint < 0) e.reorderPoint = "ROP negatif olamaz";
    if (form.price < 0) e.price = "Fiyat negatif olamaz";
    if (form.cost < 0) e.cost = "Maliyet negatif olamaz";
    return e;
  }

  function handleAddSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // Benzersiz SKU türet
    const base = form.name.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 6) || "SKU";
    let idx = 1; 
    let sku = `${base}-${String(items.length + idx).padStart(4, "0")}`;
    while (items.some(i => i.id === sku)) { 
      idx++; 
      sku = `${base}-${String(items.length + idx).padStart(4, "0")}`; 
    }

    const newItem = {
      id: sku,
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      incoming: 0,
      barcode: form.barcode,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);
    setAddOpen(false);
    setForm({ name: "", category: "Aksesuar", location: "Depo-1", unit: "adet", stock: 0, reorderPoint: 10, price: 0, cost: 0, barcode: "" });
  }

  // Çıkış işlemi
  function handleExit() {
    try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
    if (window?.electron?.quitApp) { window.electron.quitApp(); return; }
    if (window?.electronAPI?.quit) { window.electronAPI.quit(); return; }
    window.open('', '_self');
    window.close();
    window.location.replace('about:blank');
  }

  // DashboardPage içinde hesaplamalar yapılacak; burada tutulmuyor

  function exportCSV() {
    const header = ["id", "name", "category", "stock", "reorderPoint", "location", "incoming", "price", "cost"].join(",");
    const rows = items
      .map((i) => [i.id, i.name, i.category, i.stock, i.reorderPoint, i.location, i.incoming, i.price ?? "", i.cost ?? ""].join(","))
      .join("\n");
    const csv = header + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stoklar.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        items={NAV_ITEMS}
        activeKey={active}
        onToggle={toggleSidebar}
        onChange={(key) => {
          if (key === "create") { setAddOpen(true); return; }
          if (key === "stock") { setStockView(true); setReportsView(false); setSettingsView(false); setActive("stock"); return; }
          if (key === "reports") { setReportsView(true); setStockView(false); setSettingsView(false); setActive("reports"); return; }
          if (key === "settings") { setSettingsView(true); setStockView(false); setReportsView(false); setActive("settings"); return; }
          setStockView(false); setReportsView(false); setSettingsView(false);
          setActive(key);
        }}
      />

      {/* TOP NAVBAR */}
      <Navbar sidebarOpen={sidebarOpen} onExit={handleExit} />

  <main className={`main ${sidebarOpen ? 'main--sidebar-open' : 'main--sidebar-closed'}`}>
  <div className="container">
    {reportsView ? (
      <ReportsPage 
        items={items} 
        onBack={() => { setReportsView(false); setActive("dashboard"); }}
      />
    ) : stockView ? (
      <StockUpdatePage 
        items={items} 
        setItems={setItems} 
        onBack={() => { setStockView(false); setActive("dashboard"); }}
      />
    ) : settingsView ? (
      <SettingsPage 
        onBack={() => { setSettingsView(false); setActive("dashboard"); }}
      />
    ) : (
      <DashboardPage
        items={items}
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        onlyLow={onlyLow}
        setOnlyLow={setOnlyLow}
        onExportCSV={exportCSV}
        onOpenAdd={() => setAddOpen(true)}
        onOpenStock={() => { setStockView(true); setActive("stock"); }}
        onOpenReports={() => { setReportsView(true); setActive("reports"); }}
      />
      )}
   </div>  
           
       




        <AddProductModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleAddSubmit}
        />
      </main>
    </div>
  );
}
