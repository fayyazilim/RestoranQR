# RestoranQR - Proje Çalıştırma ve Kurulum Kılavuzu 🚀

Bu doküman, **RestoranQR** multi-tenant dijital QR menü SaaS platformunu yerel (local) geliştirme ortamında veya sunucuda sıfırdan kurup çalıştırmak için gereken tüm adımları, servis yapılandırmalarını ve sorun giderme yönergelerini içerir.

---

## 📑 İçindekiler
1. [Sistem Mimarisi ve Portlar](#-sistem-mimarisi-ve-portlar)
2. [Ön Gereksinimler](#-ön-gereksinimler)
3. [Ortam Değişkenleri (.env)](#-ortam-değişkenleri-env)
4. [Hızlı Başlatma (Tek Komutla)](#-hızlı-başlatma-tek-komutla)
5. [Manuel Başlatma (Adım Adım)](#-manuel-başlatma-adım-adım)
6. [Adım Adım Kullanım Senaryosu (İlk Çalıştırma)](#-adım-adım-kullanım-senaryosu-ilk-çalıştırma)
7. [Sık Karşılaşılan Sorunlar ve Çözümleri](#-sık-karşılaşılan-sorunlar-ve-çözümleri)
8. [Hızlı Erişim Bağlantıları Tablosu](#-hızlı-erişim-bağlantıları-tablosu)

---

## 🏛 Sistem Mimarisi ve Portlar

Proje birbiriyle entegre çalışan **3 bağımsız servisten** oluşmaktadır:

```mermaid
flowchart LR
    A["Müşteri / Ziyaretçi"] -->|"QR Okutma"| B["Next.js 14 Frontend<br/>Port: 3000<br/>(/m/:slug)"]
    C["Restoran Sahibi / Admin"] -->|"Tarayıcı"| D["Angular 18 Panel<br/>Port: 4200<br/>(/dashboard)"]
    B -->|"REST API"| E["NestJS 10 Backend<br/>Port: 3001<br/>(/api)"]
    D -->|"REST API + JWT"| E
    E --> F[("MongoDB Atlas")]
    E --> G["Cloudinary CDN"]
    E --> H["iyzico API"]
```

| Servis | Klasör | Teknoloji | Port | Açıklama |
|---|---|---|---|---|
| **Backend** | `/backend` | NestJS 10, Mongoose, JWT, Swagger | `3001` | Çekirdek REST API, yetkilendirme, veri tabanı ve iş mantığı |
| **Müşteri Menüsü & Landing** | `/frontend-nextjs` | Next.js 14 App Router, Tailwind, Lucide | `3000` | SaaS ana sayfası ve QR okutulduğunda açılan lüks menü arayüzü |
| **Yönetim Paneli** | `/frontend-angular` | Angular 18 (Signals), Tailwind | `4200` | Restoran işletmecisi ve Süper Admin yönetim konsolu |

---

## 💻 Ön Gereksinimler

Projenin sorunsuz derlenip çalışabilmesi için sisteminizde aşağıdaki araçların kurulu olması gerekir:

1. **Node.js**: v18.x veya v20.x LTS (Önerilen: v20.x)
   - Kontrol: `node -v`
2. **npm**: v9.x veya v10.x
   - Kontrol: `npm -v`
3. **MongoDB Atlas** hesabı veya yerel MongoDB servisi
4. **Cloudinary** hesabı (restoran logosu ve yemek fotoğrafları için)
5. **İşletim Sistemi**: Windows (PowerShell), macOS veya Linux

---

## 🔑 Ortam Değişkenleri (.env)

Backend servisinin çalışması için `backend/.env` dosyasının mevcut olması gerekir.

`backend/.env` dosyası içeriği:

```env
NODE_ENV=development
PORT=3001

# MongoDB Atlas Bağlantısı
MONGODB_URI=mongodb+srv://<KULLANICI>:<SIFRE>@cluster0.cgkisvs.mongodb.net/restoran-qr?retryWrites=true&w=majority

# JWT Güvenlik Anahtarları
JWT_SECRET=restoran-qr-jwt-secret-key-prod-2026-safe-secure
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=restoran-qr-jwt-refresh-secret-key-2026
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary (Görsel Depolama)
CLOUDINARY_CLOUD_NAME=whfouru9
CLOUDINARY_API_KEY=339639355141929
CLOUDINARY_API_SECRET=WYP78hlBmSxl9SI8YZw0BHnnbtU
CLOUDINARY_URL=cloudinary://339639355141929:WYP78hlBmSxl9SI8YZw0BHnnbtU@whfouru9

# iyzico Ödeme Entegrasyonu (Sandbox)
IYZICO_API_KEY=sandbox-api-key-restoranqr
IYZICO_SECRET_KEY=sandbox-secret-key-restoranqr
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Frontend Bağlantı Adresleri (CORS İzinleri)
FRONTEND_URL=http://localhost:4200
NEXTJS_URL=http://localhost:3000

# QR Menü Yönlendirme
APP_URL=http://localhost:3001
MENU_BASE_URL=http://localhost:3000/m
```

> [!NOTE]
> MongoDB bağlantı bilgileriniz `backend/.env` içerisine hazır olarak tanımlanmıştır.

---

## ⚡️ Hızlı Başlatma (Tek Komutla)

Windows PowerShell üzerinden tek bir komut ile 3 servisi de aynı anda ayrı pencerelerde başlatabilirsiniz:

```powershell
./start-all.ps1
```

Bu script sırasıyla:
1. `backend` klasöründe API'yi derleyip başlatır (Port 3001)
2. `frontend-nextjs` klasöründe müşteri arayüzünü başlatır (Port 3000)
3. `frontend-angular` klasöründe yönetim panelini başlatır (Port 4200)

---

## 🛠 Manuel Başlatma (Adım Adım)

Servisleri ayrı terminallerde geliştirme modunda çalıştırmak için:

### 1. Terminal — Backend (NestJS)
```bash
cd backend
npm install
npm run build
npm run start:dev
```
- API Endpoint: `http://localhost:3001/api`
- Swagger API Dokümantasyonu: `http://localhost:3001/api/docs`

### 2. Terminal — Next.js (Müşteri Menüsü & Landing)
```bash
cd frontend-nextjs
npm install
npm run dev
```
- SaaS Tanıtım Sayfası: `http://localhost:3000`
- Örnek Menü Sayfası: `http://localhost:3000/m/bella-italia`

### 3. Terminal — Angular (Restoran Yönetim Paneli)
```bash
cd frontend-angular
npm install
npm start
```
- Yönetim Paneli: `http://localhost:4200`
- Giriş / Kayıt: `http://localhost:4200/auth/login`

---

## 🎯 Adım Adım Kullanım Senaryosu (İlk Çalıştırma)

Sistemin çalıştığını doğrulamak ve baştan sona bir restoran açıp menü oluşturmak için:

### Adım 1: Sisteme Kayıt Olun
1. Tarayıcınızda [http://localhost:4200/auth/register](http://localhost:4200/auth/register) adresini açın.
2. Ad Soyad, E-posta ve Şifre girerek kayıt olun.
3. Kayıt sonrası otomatik olarak Dashboard'a yönlendirileceksiniz.

### Adım 2: İşletme Bilgilerini Kaydedin & Logo Yükleyin
1. Sol menüden **İşletme Bilgileri** (`/dashboard/business`) sekmesine geçin.
2. Restoran Adı, Slogan, Telefon, Adres ve Para Birimini belirleyin.
3. Sayfanın üstündeki **Logo Yükle** butonuna tıklayarak restoranınızın logosunu yükleyin (otomatik Cloudinary CDN'e yüklenir ve önizlenir).
4. **Değişiklikleri Kaydet** butonuna basın. Başarı toast bildirimi çıkacaktır.

### Adım 3: Menü Kategorileri Ekleyin
1. Sol menüden **Kategoriler** (`/dashboard/categories`) sekmesine tıklayın.
2. **Yeni Kategori Ekle** butonuna basın.
3. Örnek: `Taş Fırın Pizzalar`, `Sıcak İçecekler`, `Tatlılar`.

### Adım 4: Ürünleri ve Fiyatları Ekleyin
1. Sol menüden **Ürün Yönetimi** (`/dashboard/products`) sekmesine geçin.
2. **Yeni Ürün Ekle** butonuna tıklayın.
3. Kategori seçin, ürün adı, fiyat, kalori, hazırlık süresi ve alerjen/vejetaryen rozetlerini işaretleyin.
4. Kaydedin. Ürünün stok durumunu ("Stokta Var / Tükendi") tek tıkla değiştirebilirsiniz.

### Adım 5: Menü Temanızı Seçin
1. Sol menüden **Tema Seçimi** (`/dashboard/themes`) sekmesine geçin.
2. Restoranınızın konseptine uygun temayı seçin (Minimal, Klasik, Dark, Renkli, Elegant).

### Adım 6: QR Kodunuzu İndirin ve Menüyü Yayınlayın
1. Sol menüden **QR Kod & İndir** (`/dashboard/qr`) sekmesine geçin.
2. Restoranınıza özel üretilen QR kodu ekranda görüntüleyin.
3. **PNG İndir** veya masalara koymak için **Yazdırılabilir A4 PDF İndir** butonlarına basarak çıktısını alın.
4. Üst bardaki turuncu **Menüyü Yayınla** butonuna tıklayın. Durum rozeti `Yayında` (yeşil) olacaktır.

### Adım 7: Müşteri Gözünden Menüyü İnceleyin
- Sağ üstteki **Canlı Menüyü Aç** butonuna tıklayın veya doğrudan `http://localhost:3000/m/<restoran-slug>` adresini açın.
- Kategoriler arası geçiş, anlık filtreleme/arama, açık/koyu tema değiştirici ve ürün detay pencerelerini test edin.

---

## ❓ Sık Karşılaşılan Sorunlar ve Çözümleri

### 1. "Port 3001 (veya 4200/3000) already in use" Hatası
Eğer önceki bir çalıştırmadan kalan açık işlem varsa port meşgul uyarısı alırsınız.

**PowerShell ile portu kullanan işlemi bulup kapatmak için:**
```powershell
# 3001 portunu kullanan işlemi bul
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# 4200 portunu kullanan işlemi bul
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process -Force

# 3000 portunu kullanan işlemi bul
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### 2. "MongoDB connection error / MongooseServerSelectionError"
- `backend/.env` içindeki `MONGODB_URI` adresinin doğruluğunu kontrol edin.
- MongoDB Atlas kullanıyorsanız, MongoDB Atlas konsolunda **Network Access** bölümünden mevcut IP adresinizin `0.0.0.0/0` (her yerden erişim) olarak ekli olduğundan emin olun.

### 3. "property currencySymbol should not exist" veya DTO Hataları
- Backend kodlarında yapılan değişikliklerin aktifleşmesi için backend klasöründe `npm run build` komutunun çalıştırılması ve servisin yeniden başlatılması gerekir.

### 4. Cloudinary Görsel Yükleme Hatası (500)
- `backend/.env` içerisindeki `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` ve `CLOUDINARY_API_SECRET` anahtarlarını kontrol edin.
- Maksimum dosya boyutu sınırı 5 MB'dir.

---

## 🔗 Hızlı Erişim Bağlantıları Tablosu

| Sayfa / Modül | URL | Kullanıcı Rolü |
|---|---|---|
| **Yönetim Paneli Giriş** | [http://localhost:4200/auth/login](http://localhost:4200/auth/login) | Restoran Yöneticisi |
| **Yeni İşletme Kaydı** | [http://localhost:4200/auth/register](http://localhost:4200/auth/register) | Yeni Restoran Sahibi |
| **Yönetim Konsolu (Dashboard)** | [http://localhost:4200/dashboard](http://localhost:4200/dashboard) | Restoran Yöneticisi |
| **Kategori Yönetimi** | [http://localhost:4200/dashboard/categories](http://localhost:4200/dashboard/categories) | Restoran Yöneticisi |
| **Ürün Yönetimi** | [http://localhost:4200/dashboard/products](http://localhost:4200/dashboard/products) | Restoran Yöneticisi |
| **QR Kod & PDF Çıktı** | [http://localhost:4200/dashboard/qr](http://localhost:4200/dashboard/qr) | Restoran Yöneticisi |
| **Süper Admin Paneli** | [http://localhost:4200/admin](http://localhost:4200/admin) | Platform Admini (`role: admin`) |
| **Müşteri Landing Page** | [http://localhost:3000](http://localhost:3000) | Herkese Açık |
| **Müşteri Canlı Menüsü (Örnek)** | [http://localhost:3000/m/bella-italia](http://localhost:3000/m/bella-italia) | Herkese Açık (Mobil Uyumlu) |
| **Swagger API Dokümanı** | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) | Geliştirici |
