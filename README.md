# RestoranQR - Multi-Tenant Dijital QR Menü Platformu 🚀

Kafe ve restoranlar için sıfırdan geliştirilmiş, production-ready dijital QR menü SaaS platformu.

> 📖 **Detaylı çalıştırma, kurulum ve kullanım adımları için [ÇALIŞTIRMA REHBERİ (CALISTIRMA_REHBERI.md)](./CALISTIRMA_REHBERI.md) dokümanını inceleyin.**  
> ⚡️ **Tek terminalde çalıştırma ve Vercel'e deploy adımları için [VERCEL DEPLOY REHBERİ (VERCEL_DEPLOYMENT.md)](./VERCEL_DEPLOYMENT.md) dokümanını inceleyin.**  
> 🗄️ **Veritabanı varlık ve model detayları için [VERİTABANI ŞEMASI (DATABASE_SCHEMA.md)](./DATABASE_SCHEMA.md) dokümanını inceleyin.**

---

## 🏗 Mimari ve Teknoloji Yığını

### 1. Backend (`/backend`)
- **Framework**: NestJS 10 + TypeScript
- **Veritabanı**: MongoDB + Mongoose (Multi-tenant mimari)
- **Kimlik Doğrulama**: JWT (Passport.js) + Google OAuth desteği
- **Görsel Depolama**: Cloudinary (Otomatik yükleme ve silme)
- **Ödeme Altyapısı**: iyzico Checkout Form (Abonelik planları: 199₺, 399₺, 799₺)
- **QR Kod Üretimi**: `qrcode` + `pdfkit` (Şeffaf PNG ve Masa Standı A4 PDF indirme)
- **Dokümantasyon**: Swagger UI (`/api/docs`)
- **Güvenlik**: Helmet, Throttler (Rate Limiting), CORS, Global Exception Filters

### 2. Müşteri Arayüzü & Landing (`/frontend-nextjs`)
- **Framework**: Next.js 14 (App Router) + React 18
- **Stil & Tasarım**: Tailwind CSS, Lucide Icons, Mobil-Öncelikli (Mobile-First)
- **Sayfalar**:
  - `/` → SaaS Landing Page (Hero, Özellikler, 5 Tema Galerisi, Fiyatlandırma)
  - `/m/[slug]` → Hızlı Müşteri Menü Sayfası (Kategori sekmeleri, canlı arama, Açık/Koyu mod, alerjen ve besin bilgileri)

### 3. Restoran & Admin Yönetim Paneli (`/frontend-angular`)
- **Framework**: Angular 18 (Standalone Components + Signals + Router)
- **Stil & Tasarım**: Tailwind CSS (#1F4E79 Lacivert, #F97316 Turuncu, FontAwesome 6)
- **Ekranlar**:
  - `/auth/login` & `/auth/register` → Kullanıcı girişi ve işletme kaydı
  - `/dashboard` → Genel istatistikler ve canlı görüntülenme sayacı
  - `/dashboard/business` → Restoran bilgileri (ad, slogan, telefon, adres, logo)
  - `/dashboard/categories` → Kategori ekleme, düzenleme ve sıralama
  - `/dashboard/products` → Ürün CRUD, fiyat, stok durumu (Tükendi/Var), kalori ve vejetaryen rozetleri
  - `/dashboard/themes` → 5 lüks tema seçimi (Minimal, Klasik, Dark, Renkli, Elegant)
  - `/dashboard/qr` → Canlı QR kod görüntüleme, PNG ve yazdırılabilir A4 PDF indirme
  - `/dashboard/subscription` → iyzico ödeme durumu ve paket yönetimi
  - `/admin` → Süper Admin: Kayıtlı işletmeler, kullanıcılar ve toplam gelir takibi

---

## ⚡️ Hızlı Başlatma (Local Development)

### 1. Backend Çalıştırma
```bash
cd backend
npm install
npm run start:dev
```
- API adresi: `http://localhost:3001/api`
- Swagger API Docs: `http://localhost:3001/api/docs`

### 2. Next.js (Landing & Müşteri Menüsü)
```bash
cd frontend-nextjs
npm install
npm run dev
```
- Landing Page: `http://localhost:3000`
- Örnek Menü: `http://localhost:3000/m/bella-italia`

### 3. Angular Yönetim Paneli
```bash
cd frontend-angular
npm install
npm start
```
- Panel adresi: `http://localhost:4200`
- Giriş sayfası: `http://localhost:4200/auth/login`
