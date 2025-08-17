import React from "react";
import Button from "../ui/Button.jsx";
import { LogOut } from "lucide-react";

export default function Navbar({ sidebarOpen, onExit }) {
  return (
    <header className={`navbar ${sidebarOpen ? 'navbar--sidebar-open' : 'navbar--sidebar-closed'}`}>
      <div className="navbar__title">Stok Takip Sistemi</div>
      <div className="navbar__right">
        <div className="badge">Admin</div>
        <Button variant="primary" className="inline-flex gap-2" onClick={onExit}>
          <LogOut className="icon" /> Çıkış
        </Button>
      </div>
    </header>
  );
}


