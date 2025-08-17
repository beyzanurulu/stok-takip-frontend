import React, { useState, useEffect } from "react";
import { Settings, Bell, HelpCircle, Mail, Book, Phone } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader } from "../components/ui/Card.jsx";

export default function SettingsPage({ onBack }) {
  // Ayarları localStorage'dan yükle
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('stockApp_notifications');
    return saved ? JSON.parse(saved) : {
      updates: true
    };
  });



  const [activeTab, setActiveTab] = useState('notifications');

  // Ayarları kaydet
  useEffect(() => {
    localStorage.setItem('stockApp_notifications', JSON.stringify(notifications));
  }, [notifications]);



  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };



  const handleSupportRequest = () => {
    const subject = "Stok Takip Sistemi - Destek Talebi";
    const body = `Merhaba,

Stok Takip Sistemi ile ilgili aşağıdaki konuda destek almak istiyorum:

[Lütfen sorununuzu detaylı olarak yazınız]

Sistem Bilgileri:
- Tarayıcı: ${navigator.userAgent}
- Tarih: ${new Date().toLocaleString('tr-TR')}

Teşekkürler.`;
    
    const mailtoLink = `mailto:admin@stok-takip.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleUserGuide = () => {
    alert(`Kullanım Kılavuzu

📊 Dashboard: Ana ekranda stok durumunuzu görüntüleyin
➕ Ürün Ekle: Yeni ürünleri sisteme ekleyin
📦 Stok Güncelle: Mevcut stok miktarlarını güncelleyin
📈 Raporlar: Detaylı stok analizlerini inceleyin
⚙️ Ayarlar: Sistem tercihlerinizi yapılandırın

🔍 Arama: SKU, ürün adı veya kategori ile arama yapabilirsiniz
🏷️ Filtreler: Kategori ve kritik stok filtrelerini kullanın
📁 Dışa Aktar: Stok verilerinizi CSV formatında indirin

💡 İpucu: Kritik stok seviyesinin altındaki ürünler otomatik olarak uyarı verir.`);
  };

  return (
    <div className="settings-view">
      <div className="settings-header">
        <Button className="inline-flex gap-2" onClick={onBack}>
          ← Dashboard'a Dön
        </Button>
        <h2><Settings className="icon" style={{marginRight: '8px'}} />Ayarlar</h2>
      </div>

      {/* Settings Tabs */}
      <Card className="mb-4">
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Bildirimler
          </button>
          <button 
            className={`settings-tab ${activeTab === 'help' ? 'settings-tab--active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            Yardım
          </button>
        </div>
      </Card>

      <div className="settings-content">
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader title="Bildirim Ayarları" />
            <div className="card__body">
              <div className="settings-group">
                <label className="settings-item">
                  <div className="settings-item__info">
                    <div className="settings-item__title">Güncelleme Bildirimleri</div>
                    <div className="settings-item__desc">Stok değişiklikleri ve sistem güncellemeleri hakkında bildirim al</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.updates}
                      onChange={(e) => handleNotificationChange('updates', e.target.checked)}
                    />
                    <span className="switch__slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'help' && (
          <Card>
            <CardHeader title="Yardım & Destek" />
            <div className="card__body">
              <div className="help-actions">
                <button className="help-action" onClick={handleUserGuide}>
                  <div className="help-action__icon">
                    <Book className="icon" />
                  </div>
                  <div className="help-action__content">
                    <div className="help-action__title">Kullanım Kılavuzu</div>
                    <div className="help-action__desc">Sistemin nasıl kullanılacağını öğrenin</div>
                  </div>
                </button>

                <button className="help-action" onClick={handleSupportRequest}>
                  <div className="help-action__icon">
                    <Mail className="icon" />
                  </div>
                  <div className="help-action__content">
                    <div className="help-action__title">Sistem Yöneticisine Destek Talebi</div>
                    <div className="help-action__desc">Teknik sorunlar için destek isteyin</div>
                  </div>
                </button>

                <a className="help-action" href="tel:+902123456789">
                  <div className="help-action__icon">
                    <Phone className="icon" />
                  </div>
                  <div className="help-action__content">
                    <div className="help-action__title">Telefon Desteği</div>
                    <div className="help-action__desc">0212 345 67 89 (Mesai saatleri)</div>
                  </div>
                </a>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
