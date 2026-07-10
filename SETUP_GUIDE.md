# Kurulum ve Çalıştırma Rehberi

## 📋 Ön Koşullar

- **Node.js**: v16 veya üzeri
- **npm**: v8 veya üzeri
- **İnternet Bağlantısı**: OpenStreetMap ve Google erişimi için

## 🚀 Hızlı Başlangıç (5 dakika)

### 1. Projeyi Klonla
```bash
git clone https://github.com/cagferaga-source/business-finder-app.git
cd business-finder-app
```

### 2. Bağımlılıkları Yükle
```bash
# Tüm bağımlılıkları bir komutla yükle
npm run install-all
```

**Veya manuel olarak:**
```bash
npm install
cd frontend && npm install && cd ..
```

### 3. Geliştirme Modunda Çalıştır

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Tarayıcıda aç:** http://localhost:5173

## 📦 Production Deployment

### Build Etme
```bash
# Frontend'i derle
cd frontend
npm run build
cd ..
```

### Çalıştırma
```bash
# Backend (frontend dist otomatik serve edilir)
npm start
```

**Erişim:** http://localhost:5000

---

## 🛠️ Ortam Değişkenleri

Kök dizinde `.env` dosyası oluştur:

```env
PORT=5000
NODE_ENV=production
```

---

## 📁 Proje Yapısı

```
business-finder-app/
├── server.js                 # Express ana sunucu
├── package.json              # Backend bağımlılıkları
├── services/
│   ├── businessService.js    # İşletme arama logici
│   └── excelService.js       # Excel export
├── routes/
│   └── businessRoutes.js     # API rotaları
├── uploads/                  # İndirilecek Excel dosyaları (auto-create)
└── frontend/
    ├── package.json          # Frontend bağımlılıkları
    ├── vite.config.js        # Vite konfigürasyonu
    ├── index.html            # HTML template
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Ana component
        ├── index.css         # Styles
        └── components/
            ├── SearchForm.jsx    # Arama formu
            ├── MapComponent.jsx  # Leaflet haritası
            └── ResultsTable.jsx  # Sonuçlar tablosu
```

---

## 🐛 Sorun Giderme

### Port 5000 zaten kullanılıyor
```bash
# Farklı port ayarla
PORT=3000 npm start
```

### CORS Hatası
- Backend'in CORS ayarları doğru mu?
- Tarayıcı konsolu kontrol et (F12)

### Web Scraping Başarısız
- İnternet bağlantısı var mı?
- Website engellemeler var mı?
- Timeout ayarlarını artır (services/businessService.js)

### Excel İndirme Başarısız
- `uploads/` dizini otomatik oluşturulur
- Yazma izinleri var mı?
- Disk boş alanı kontrol et

---

## 🔧 Gelişmiş Konfigürasyon

### Scraping Timeout'ını Artır
`services/businessService.js` içinde:
```javascript
timeout: 10000  // 10 saniyeye çıkar
```

### Rate Limit Ekle
`routes/businessRoutes.js` içinde:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

router.use(limiter);
```

### Paralel İşleme Ekle
`services/businessService.js`:
```javascript
// Seçili işletmeler için paralel işle
const batchSize = 5;
for (let i = 0; i < results.length; i += batchSize) {
  const batch = results.slice(i, i + batchSize);
  await Promise.all(batch.map(r => processBusinesses(r)));
}
```

---

## 📊 Performans İpuçları

| Ayar | Etkisi |
|------|--------|
| Paralel işleme | 3-4x hızlı |
| Web scraping cache | 50% hızlı |
| Batch processing | 2x hızlı |

---

## 📝 Logları Görüntüle

Backend loglarında hata detayları:
```bash
# Hatalı arama görmek için
DEBUG=* npm run dev
```

Browser console (F12) frontend hatalarını gösterir.

---

## 🚢 Docker Deployment

İsteğe bağlı `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
WORKDIR /app/frontend
RUN npm install && npm run build
WORKDIR /app

EXPOSE 5000
CMD ["npm", "start"]
```

Build ve çalıştır:
```bash
docker build -t business-finder .
docker run -p 5000:5000 business-finder
```

---

## 📞 Destek

Sorular veya sorunlar: GitHub Issues açın

## 📄 Lisans

MIT - Açıkça kullan ve paylaş
