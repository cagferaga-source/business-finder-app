# 🚀 Business Finder - Deployment Rehberi

## ☁️ 1. Vercel'e Deploy Etme (Önerilen)

Vercel Node.js + React için en hızlı deployment yöntemidir.

### Adım 1: GitHub'a Push Yap
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Adım 2: Vercel'e Bağlan
1. https://vercel.com adresine git
2. GitHub hesabınla oturum aç
3. "Import Project" butonuna tıkla
4. `business-finder-app` repository'sini seç
5. "Deploy" butonuna tıkla

### Adım 3: Konfigürasyon (Otomatik olacak)
- Framework: `Other`
- Build Command: `npm run build` (otomatik)
- Output Directory: `frontend/dist` (otomatik)

**Bitti!** Vercel otomatik URL'ni verecek (örn: `https://business-finder-app.vercel.app`)

---

## 🐳 2. Docker ile Deploy

### Yerel Ortamda Test Et
```bash
docker build -t business-finder .
docker run -p 5000:5000 business-finder
```

### Erişim: http://localhost:5000

---

## 🌐 3. Render.com'a Deploy Etme

1. https://render.com adresine git
2. GitHub ile bağlan
3. "New +" → "Web Service"
4. Repository'sini seç
5. Ayarlar:
   - **Name**: business-finder
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. "Create Web Service"

**URL**: `https://business-finder-xxx.onrender.com`

---

## 🖥️ 4. Kendi Sunucuna Deploy (VPS/Linux)

### Gereksinimler
- Linux sunucu (Ubuntu 20.04+)
- Node.js 18+
- Nginx (reverse proxy)

### Adım 1: Sunucuya Bağlan
```bash
ssh user@your-server-ip
```

### Adım 2: Projeyi Klonla
```bash
cd /var/www
git clone https://github.com/cagferaga-source/business-finder-app.git
cd business-finder-app
```

### Adım 3: Bağımlılıkları Yükle
```bash
npm run install-all
npm run build
```

### Adım 4: PM2 ile Başlat
```bash
npm install -g pm2
pm2 start server.js --name "business-finder"
pm2 startup
pm2 save
```

### Adım 5: Nginx Konfigürasyonu
```bash
sudo nano /etc/nginx/sites-available/business-finder
```

İçeriği:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Adım 6: Nginx'i Etkinleştir
```bash
sudo ln -s /etc/nginx/sites-available/business-finder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Adım 7: SSL Sertifikası (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📊 Deployment Karşılaştırması

| Platform | Ücret | Kurulum | Performans | Yönetim |
|----------|-------|---------|-----------|---------|
| **Vercel** | Ücretsiz | 2 min | Çok Hızlı | Otomatik |
| **Render** | Ücretsiz | 3 min | Hızlı | Otomatik |
| **Docker** | Değişken | 15 min | Orta | Manuel |
| **VPS** | $5+/ay | 30 min | Yüksek | Manuel |

---

## 🔍 Deployment Sonrası Kontrol

### Health Check Endpoint Ekle
```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
```

Tarayıcıda: `https://your-domain.com/health`

---

## 🆘 Sorun Giderme

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### CORS Hatası
Backend'de CORS kontrol et:
```javascript
app.use(cors({
  origin: ['https://your-domain.com'],
  credentials: true
}));
```

### Excel İndirme Başarısız
```bash
mkdir -p uploads
chmod 755 uploads
```

---

## 📈 Monitoring

### PM2 Dashboard
```bash
pm2 monit
```

### Log Kontrol
```bash
pm2 logs business-finder
```

---

## 🔐 Production Güvenliği

### 1. Environment Değişkenlerini Ayarla
```bash
# Vercel Dashboard'da
PORT=5000
NODE_ENV=production
```

### 2. Rate Limiting Ekle
```bash
npm install express-rate-limit
```

### 3. Security Headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 📱 Mobil Uyumluluğu Test Et

1. Chrome DevTools: F12 → Device Toolbar
2. Telefondan açın: http://your-ip:5000
3. Responsive kontrol yapın

---

**Başarılar! 🎉**
