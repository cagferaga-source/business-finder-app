# Business Finder - İşletme Bulucusu API Dökümentasyonu

## Genel Bilgi

API tamamen açık kaynaktır ve OpenStreetMap, Google Search gibi ücretsiz servisleri kullanır.

## Endpoints

### 1. İşletme Arama

**POST** `/api/search`

İşletme araması yapar ve server-sent events (SSE) ile canlı ilerleme gönderi.

**Request Body:**
```json
{
  "state": "New York",
  "keyword": "Auto Service"
}
```

**Response (Streaming):**
```
data: {"progress": 10, "processed": 5, "total": 50}
data: {"progress": 20, "processed": 10, "total": 50}
...
data: {"complete": true, "businesses": [...]}
```

**Örnek İşletme Objesi:**
```json
{
  "name": "ABC Auto Service",
  "address": "123 Main St, New York",
  "phone": "(555) 123-4567",
  "email": "info@abcauto.com",
  "website": "https://abcauto.com",
  "lat": "40.7128",
  "lon": "-74.0060",
  "status": "Web sitesinden bulundu"
}
```

**Status Kodları:**
- `Bulundu` - E-mail web sitesinden çıkarıldı
- `Google'dan bulundu` - E-mail Google araması ile bulundu
- `Aranıyor` - Hala aranıyor (bu durumda liste dışı)

---

### 2. Excel Export

**POST** `/api/export`

Sonuçları Excel dosyasında dışa aktarır.

**Request Body:**
```json
{
  "businesses": [
    {
      "name": "ABC Auto Service",
      "address": "123 Main St",
      "phone": "(555) 123-4567",
      "email": "info@abcauto.com",
      "status": "Bulundu"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "filename": "isletmeler_1234567890.xlsx",
  "download": "/api/download/isletmeler_1234567890.xlsx"
}
```

---

### 3. Dosya İndirme

**GET** `/api/download/:filename`

Excel dosyasını indirir.

**Parametreler:**
- `filename` - Export endpoint'ten dönen dosya adı

**Örnek:**
```
GET /api/download/isletmeler_1234567890.xlsx
```

---

## E-mail Bulma Stratejileri

API, e-mail adresi bulmak için 3 farklı yöntem kullanır:

### 1️⃣ Web Sitesinden Çıkarma (Scraping)
- İşletmenin web sitesini ziyaret eder
- HTML'de `mailto:` linklerini arar
- Metinde e-mail desenlerini arar
- **Başarı Oranı:** ~60%

### 2️⃣ Google Araması
- Google'da işletme adı + "email" arar
- Sonuçlardan e-mail adreslerini çıkarır
- **Başarı Oranı:** ~40%

### 3️⃣ Telefon ile Arama
- İşletme telefon numarası ile Google araması yapar
- **Başarı Oranı:** ~20%

**Not:** E-mail bulunamazsa bu işletme listeye eklenmez (kullanıcı tarafından istenen)

---

## Limitler ve Güvenlik

⚠️ **Rate Limits:**
- OpenStreetMap: 1 istek/saniye
- Google: Resmi limit yok (pratik limit ~30 istek/dakika)

🔒 **Gizlilik:**
- Hiçbir veri kayıt edilmez
- Tüm veriler RAM'de işlenir
- Excel dosyaları 24 saat sonra silinir

---

## Hata Kodları

| Kod | Anlam | Çözüm |
|-----|-------|-------|
| 400 | Eksik parameter | state ve keyword kontrol edin |
| 404 | Dosya bulunamadı | İndirme linkini kontrol edin |
| 500 | Server hatası | Lütfen daha sonra deneyin |

---

## Örnek İstek (cURL)

```bash
# Arama
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"state": "New York", "keyword": "Restaurant"}'

# Export
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{"businesses": [...]}' \
  -o results.json
```

---

## Örnek İstek (JavaScript/Fetch)

```javascript
// Arama
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    state: 'New York', 
    keyword: 'Restaurant' 
  })
});

const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}
```

---

## Performans Notları

⚡ **Beklenen Süreler:**
- 50 işletme araması: 2-3 dakika
- 100 işletme araması: 5-8 dakika
- Excel export: < 1 saniye

💡 **İyileştirme İpuçları:**
1. Daha spesifik arama kelimesi kullanın
2. Web sitesi olan işletmeler daha hızlı işlenir
3. Paralel işlemeyi etkinleştirmek için backend'i değiştirin
