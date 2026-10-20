# RestoranQR - Veritabanı Mongoose Şema Dokümantasyonu 🗄️

Bu dokümanda projenin MongoDB Atlas üzerinde barındırılan tüm veri modelleri, şema yapıları, veri tipleri, ilişkileri ve indeksleri detaylandırılmıştır.

---

## 🏛️ Mimari Varlık İlişki Diyagramı (ERD)

```mermaid
erDiagram
    USER ||--o| BUSINESS : "sahip_olur (1-1)"
    USER ||--o{ PAYMENT : "yapar (1-N)"
    USER ||--o{ SUBSCRIPTION : "abone_olur (1-N)"
    BUSINESS ||--o{ CATEGORY : "barindirir (1-N)"
    BUSINESS ||--o{ PRODUCT : "barindirir (1-N)"
    BUSINESS ||--o| THEME : "kullanir (N-1)"
    BUSINESS ||--o| SUBSCRIPTION : "sahiptir (1-1)"
    CATEGORY ||--o{ PRODUCT : "gruplar (1-N)"
    SUBSCRIPTION ||--o{ PAYMENT : "baglidir (1-N)"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "user | admin"
        string provider "local | google"
        string googleId
        string avatar
        boolean isActive
        boolean isEmailVerified
        Date lastLoginAt
        string refreshToken
        Date createdAt
        Date updatedAt
    }

    BUSINESS {
        ObjectId _id PK
        ObjectId owner FK "ref: User (Unique)"
        string name
        string slug UK
        string description
        string address
        string phone
        string email
        string logo
        string coverImage
        ObjectId theme FK "ref: Theme"
        string currency
        string currencySymbol
        string status "draft | active | suspended"
        boolean isPublished
        Date publishedAt
        number totalViews
        string qrCodeUrl
        Array workingHours
        Object socialMedia
        Date createdAt
        Date updatedAt
    }

    CATEGORY {
        ObjectId _id PK
        ObjectId business FK "ref: Business"
        ObjectId owner FK "ref: User"
        string name
        string description
        string image
        string icon
        number order "Sürükle-bırak sıralama"
        boolean isActive
        Date createdAt
        Date updatedAt
    }

    PRODUCT {
        ObjectId _id PK
        ObjectId business FK "ref: Business"
        ObjectId category FK "ref: Category"
        ObjectId owner FK "ref: User"
        string name
        string description
        number price
        number discountedPrice
        string image
        string imagePublicId
        Array allergens "gluten, dairy, eggs vb."
        boolean inStock
        number stockCount
        number order
        boolean isActive
        boolean isFeatured
        boolean isVegetarian
        boolean isVegan
        boolean isGlutenFree
        boolean isSpicy
        string preparationTime
        string calories
        Array tags
        number viewCount
        Date createdAt
        Date updatedAt
    }

    THEME {
        ObjectId _id PK
        string name UK
        string slug UK
        string description
        string thumbnail
        Object colors "light ve dark paletler"
        Object typography
        Object layout
        boolean isActive
        boolean isPremium
        boolean isDefault
        number order
        Date createdAt
        Date updatedAt
    }

    SUBSCRIPTION {
        ObjectId _id PK
        ObjectId user FK "ref: User"
        ObjectId business FK "ref: Business"
        string plan "free | starter | professional | enterprise"
        string status "active | inactive | cancelled | expired"
        number amount
        string currency
        Date startDate
        Date endDate
        Date cancelledAt
        boolean autoRenew
        Date createdAt
        Date updatedAt
    }

    PAYMENT {
        ObjectId _id PK
        ObjectId user FK "ref: User"
        ObjectId business FK "ref: Business"
        ObjectId subscription FK "ref: Subscription"
        string status "pending | success | failure | cancelled"
        string type "subscription | one_time"
        number amount
        string currency
        string description
        string iyzicoConversationId
        string iyzicoToken
        string iyzicoPaymentId
        Object iyzicoCallbackData
        Date createdAt
        Date updatedAt
    }
```

---

## 📋 1. User Şeması (`users`)
Sistemdeki restoran sahiplerini ve platform yöneticilerini tutar.

| Alan Adı | Tip | Zorunlu? | Varsayılan | Açıklama |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Evet | Otomatik | Benzersiz kullanıcı ID'si |
| `name` | `String` | Evet | - | Kullanıcı Adı ve Soyadı |
| `email` | `String` | Evet | - | Benzersiz, küçük harfe dönüştürülmüş e-posta |
| `password` | `String` | Hayır (Google için) | - | Bcrypt (12 salt round) ile hash'lenmiş şifre |
| `role` | `String` | Evet | `'user'` | `'user'` veya `'admin'` |
| `provider` | `String` | Evet | `'local'` | `'local'` veya `'google'` |
| `googleId` | `String` | Hayır | - | Google OAuth ID'si |
| `avatar` | `String` | Hayır | - | Profil fotoğrafı URL'i |
| `isActive` | `Boolean` | Evet | `true` | Hesap aktif mi? |
| `isEmailVerified`| `Boolean` | Evet | `false` | E-posta doğrulandı mı? |
| `lastLoginAt` | `Date` | Hayır | - | Son başarılı giriş tarihi |
| `refreshToken` | `String` | Hayır | - | Hash'lenmiş JWT yenileme token'ı |
| `timestamps` | `Date` | Evet | Otomatik | `createdAt` ve `updatedAt` |

**İndeksler:**
- `{ email: 1 }` (Unique)
- `{ googleId: 1 }`

---

## 🏢 2. Business Şeması (`businesses`)
Multi-tenant mimarisindeki restoran ve kafe işletmelerinin profilleridir.

| Alan Adı | Tip | Zorunlu? | Varsayılan | Açıklama |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Evet | Otomatik | Benzersiz işletme ID'si |
| `owner` | `ObjectId` | Evet | - | `User` modeline referans (1 kullanıcı = 1 işletme) |
| `name` | `String` | Evet | - | İşletme Adı (Örn: Bella Italia) |
| `slug` | `String` | Evet | - | URL adı (Örn: `bella-italia-52yaag`, benzersiz) |
| `description` | `String` | Hayır | - | İşletme sloganı veya kısa açıklaması |
| `address` | `String` | Hayır | - | Açık restoran adresi |
| `phone` | `String` | Hayır | - | Restoran iletişim numarası |
| `email` | `String` | Hayır | - | Restoran iletişim e-postası |
| `logo` | `String` | Hayır | - | Cloudinary logo URL'i |
| `coverImage` | `String` | Hayır | - | Cloudinary kapak görseli URL'i |
| `theme` | `ObjectId` | Hayır | - | `Theme` modeline referans |
| `currency` | `String` | Hayır | `'TRY'` | Para birimi kodu |
| `currencySymbol`| `String` | Hayır | `'₺'` | Menüde gösterilecek sembol (`₺`, `$`, `€`) |
| `status` | `String` | Evet | `'draft'` | `'draft'`, `'active'`, `'suspended'` |
| `isPublished` | `Boolean` | Evet | `false` | Menü müşterilere açık mı? |
| `publishedAt` | `Date` | Hayır | - | Menünün yayına alınma zamanı |
| `totalViews` | `Number` | Evet | `0` | Menü QR okutulma ve görüntülenme sayısı |
| `qrCodeUrl` | `String` | Hayır | - | Üretilen QR kod görselinin Cloudinary linki |
| `workingHours` | `Array` | Evet | 7 Gün Tanımlı | `{ day, open, close, isOpen }` dizisi |
| `socialMedia` | `Object` | Hayır | - | `{ instagram, facebook, twitter, website }` |

**İndeksler:**
- `{ owner: 1 }` (Unique)
- `{ slug: 1 }` (Unique)
- `{ isPublished: 1 }`
- `{ status: 1 }`

---

## 🗂️ 3. Category Şeması (`categories`)
Menüdeki bölümleri (Başlangıçlar, Pizzalar, İçecekler vb.) barındırır.

| Alan Adı | Tip | Zorunlu? | Varsayılan | Açıklama |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Evet | Otomatik | Kategori ID'si |
| `business` | `ObjectId` | Evet | - | Ait olduğu `Business` referansı |
| `owner` | `ObjectId` | Evet | - | Ait olduğu kullanıcı (`User`) referansı |
| `name` | `String` | Evet | - | Kategori başlığı |
| `description` | `String` | Hayır | - | Kategori alt açıklaması |
| `image` | `String` | Hayır | - | Görsel URL'i |
| `order` | `Number` | Evet | `0` | Sürükle & bırak sıralama önceliği |
| `isActive` | `Boolean` | Evet | `true` | Menüde gösterilsin mi? |

**İndeksler:**
- `{ business: 1, order: 1 }`
- `{ business: 1, isActive: 1 }`

---

## 🍕 4. Product Şeması (`products`)
Kategorilerin altındaki yemek, tatlı ve içecekleri temsil eder.

| Alan Adı | Tip | Zorunlu? | Varsayılan | Açıklama |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | `ObjectId` | Evet | Otomatik | Ürün ID'si |
| `business` | `ObjectId` | Evet | - | `Business` referansı |
| `category` | `ObjectId` | Evet | - | `Category` referansı |
| `owner` | `ObjectId` | Evet | - | `User` referansı |
| `name` | `String` | Evet | - | Ürün adı (Örn: Pizza Margherita) |
| `description` | `String` | Hayır | - | İçindekiler ve açıklama |
| `price` | `Number` | Evet | - | Ürün fiyatı |
| `discountedPrice` | `Number` | Hayır | - | Kampanyalı / indirimli fiyat |
| `image` | `String` | Hayır | - | Cloudinary ürün fotoğrafı URL'i |
| `allergens` | `[String]`| Hayır | `[]` | Alerjenler (`gluten`, `dairy`, `eggs`, vb.) |
| `inStock` | `Boolean` | Evet | `true` | Stokta var mı? (Tükendi toggle'ı) |
| `order` | `Number` | Evet | `0` | Kategori içindeki gösterim sırası |
| `isVegetarian` | `Boolean` | Evet | `false` | Vejetaryen rozeti |
| `isVegan` | `Boolean` | Evet | `false` | Vegan rozeti |
| `isGlutenFree` | `Boolean` | Evet | `false` | Glutensiz rozeti |
| `isSpicy` | `Boolean` | Evet | `false` | Acılı lezzet ikonu |
| `calories` | `String` | Hayır | - | Kalori bilgisi (Örn: "750 kcal") |
| `preparationTime` | `String` | Hayır | - | Hazırlık süresi (Örn: "15 dk") |

**İndeksler:**
- `{ business: 1, category: 1, order: 1 }`
- `{ business: 1, isActive: 1 }`

---

## 🎨 5. Theme Şeması (`themes`)
Müşteri menüsünün (`/m/[slug]`) dinamik renk ve tipografi görünümünü belirler.

| Alan Adı | Tip | Açıklama |
| :--- | :--- | :--- |
| `name` | `String` | Tema adı (`Minimal`, `Klasik`, `Dark Elegance`, `Renkli & Enerjik`, `Elegant Gold`) |
| `slug` | `String` | Benzersiz tema kodu (`minimal`, `klasik`, `dark`, vb.) |
| `colors.light` | `Object` | Açık mod renkleri (`primary`, `secondary`, `background`, `surface`, `text`, `border`) |
| `colors.dark` | `Object` | Koyu mod renkleri (`primary`, `secondary`, `background`, `surface`, `text`, `border`) |
| `typography` | `Object` | Font ailesi (`Inter`, `Playfair Display`, `Poppins`, `Cormorant Garamond`) |
| `layout` | `Object` | Kenar yuvarlaklığı (`borderRadius`), gölge (`cardShadow`), azami genişlik |
| `isDefault` | `Boolean` | Yeni kayıt olan işletmelere varsayılan atanacak tema mı? |

---

## 💳 6. Subscription & Payment Şemaları
SaaS abonelik modeli ve iyzico ödeme akışını yönetir.

### `subscriptions`
- `user`: Kullanıcı ID'si
- `business`: İşletme ID'si
- `plan`: `'free'`, `'starter'`, `'professional'`, `'enterprise'`
- `status`: `'active'`, `'inactive'`, `'cancelled'`, `'expired'`
- `amount`: Paket tutarı (Örn: 399 ₺)
- `startDate` & `endDate`: Abonelik dönemi

### `payments`
- `iyzicoConversationId`: iyzico işlem takip kodu (UUID)
- `iyzicoToken`: Ödeme formu token'ı
- `iyzicoPaymentId`: Başarılı ödeme referans numarası
- `status`: `'pending'`, `'success'`, `'failure'`
- `amount`: Çekilen tutar
- `iyzicoCallbackData`: iyzico'dan dönen tam webhook verisi
