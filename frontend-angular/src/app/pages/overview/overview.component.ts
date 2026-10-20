import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 max-w-6xl mx-auto">

      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">
            Hoş Geldiniz{{ business()?.name ? ', ' + business()!.name : '' }}! 👋
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            Aşağıdaki adımları tamamlayarak QR menünüzü yayına alabilirsiniz.
          </p>
        </div>
        @if (business()?.isPublished) {
          <a
            [href]="'http://localhost:3000/m/' + business()?.slug"
            target="_blank"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
          >
            <i class="fa-solid fa-globe"></i> Canlı Menüyü Gör
          </a>
        } @else {
          <a
            routerLink="/dashboard/qr"
            class="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-qrcode"></i> QR Kodunu Al
          </a>
        }
      </div>

      <!-- Setup Progress Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-black text-[#1F4E79]">Kurulum İlerlemesi</h2>
          <span class="text-sm font-bold" [class]="completionPercent() === 100 ? 'text-emerald-600' : 'text-[#F97316]'">
            %{{ completionPercent() }} Tamamlandı
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div
            class="h-full rounded-full transition-all duration-700"
            [class]="completionPercent() === 100 ? 'bg-emerald-500' : 'bg-[#F97316]'"
            [style.width.%]="completionPercent()"
          ></div>
        </div>

        <!-- Checklist Steps -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <!-- Hesap -->
          <div class="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div class="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-check text-xs"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-emerald-800">Hesap Oluşturuldu</p>
              <p class="text-xs text-emerald-600">Sisteme başarıyla kayıt oldunuz.</p>
            </div>
          </div>

          <!-- İşletme Bilgileri -->
          <div
            class="flex items-start gap-3 p-3 rounded-2xl border transition"
            [class]="business()?.name
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-200'"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              [class]="business()?.name ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'"
            >
              <i class="fa-solid" [class]="business()?.name ? 'fa-check text-xs' : 'fa-store text-xs'"></i>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold" [class]="business()?.name ? 'text-emerald-800' : 'text-slate-700'">İşletme Bilgileri</p>
              @if (business()?.name) {
                <p class="text-xs text-emerald-600">{{ business()!.name }} hazır.</p>
              } @else {
                <a routerLink="/dashboard/business" class="text-xs text-[#F97316] font-semibold hover:underline">
                  Şimdi Doldur →
                </a>
              }
            </div>
          </div>

          <!-- Logo -->
          <div
            class="flex items-start gap-3 p-3 rounded-2xl border transition"
            [class]="business()?.logo
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-200'"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              [class]="business()?.logo ? 'ring-2 ring-emerald-400' : 'bg-slate-200 text-slate-400'"
            >
              @if (business()?.logo) {
                <img [src]="business()!.logo" class="w-full h-full object-cover" alt="logo" />
              } @else {
                <i class="fa-solid fa-image text-xs"></i>
              }
            </div>
            <div>
              <p class="text-sm font-bold" [class]="business()?.logo ? 'text-emerald-800' : 'text-slate-700'">Logo Yüklendi</p>
              @if (business()?.logo) {
                <p class="text-xs text-emerald-600">Logo aktif.</p>
              } @else {
                <a routerLink="/dashboard/business" class="text-xs text-[#F97316] font-semibold hover:underline">
                  Logo Yükle →
                </a>
              }
            </div>
          </div>

          <!-- Kategoriler -->
          <div
            class="flex items-start gap-3 p-3 rounded-2xl border transition"
            [class]="categories().length > 0
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-200'"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              [class]="categories().length > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'"
            >
              <i class="fa-solid" [class]="categories().length > 0 ? 'fa-check text-xs' : 'fa-layer-group text-xs'"></i>
            </div>
            <div>
              <p class="text-sm font-bold" [class]="categories().length > 0 ? 'text-emerald-800' : 'text-slate-700'">Kategori Eklendi</p>
              @if (categories().length > 0) {
                <p class="text-xs text-emerald-600">{{ categories().length }} kategori oluşturuldu.</p>
              } @else {
                <a routerLink="/dashboard/categories" class="text-xs text-[#F97316] font-semibold hover:underline">
                  Kategori Ekle →
                </a>
              }
            </div>
          </div>

          <!-- Ürünler -->
          <div
            class="flex items-start gap-3 p-3 rounded-2xl border transition"
            [class]="products().length > 0
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-200'"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              [class]="products().length > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'"
            >
              <i class="fa-solid" [class]="products().length > 0 ? 'fa-check text-xs' : 'fa-utensils text-xs'"></i>
            </div>
            <div>
              <p class="text-sm font-bold" [class]="products().length > 0 ? 'text-emerald-800' : 'text-slate-700'">Ürün Eklendi</p>
              @if (products().length > 0) {
                <p class="text-xs text-emerald-600">{{ products().length }} ürün var.</p>
              } @else {
                <a routerLink="/dashboard/products" class="text-xs text-[#F97316] font-semibold hover:underline">
                  Ürün Ekle →
                </a>
              }
            </div>
          </div>

          <!-- Yayın Durumu -->
          <div
            class="flex items-start gap-3 p-3 rounded-2xl border transition"
            [class]="business()?.isPublished
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-slate-50 border-slate-200'"
          >
            <div
              class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              [class]="business()?.isPublished ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'"
            >
              <i class="fa-solid" [class]="business()?.isPublished ? 'fa-check text-xs' : 'fa-rocket text-xs'"></i>
            </div>
            <div>
              <p class="text-sm font-bold" [class]="business()?.isPublished ? 'text-emerald-800' : 'text-slate-700'">Menü Yayında</p>
              @if (business()?.isPublished) {
                <p class="text-xs text-emerald-600">Müşteriler görebilir!</p>
              } @else {
                <a routerLink="/dashboard/qr" class="text-xs text-[#F97316] font-semibold hover:underline">
                  Yayınla →
                </a>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Görüntülenme</p>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1F4E79] flex items-center justify-center">
              <i class="fa-solid fa-eye text-sm"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-[#1F4E79]">{{ business()?.totalViews || 0 }}</h3>
          <p class="text-[11px] text-emerald-600 font-semibold mt-1">Toplam ziyaret</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ürünler</p>
            <div class="w-9 h-9 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
              <i class="fa-solid fa-utensils text-sm"></i>
            </div>
          </div>
          <h3 class="text-3xl font-black text-[#1F4E79]">{{ products().length }}</h3>
          <p class="text-[11px] text-slate-500 font-semibold mt-1">{{ categories().length }} kategoride</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Durum</p>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center"
              [class]="business()?.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'">
              <i class="fa-solid fa-globe text-sm"></i>
            </div>
          </div>
          <h3 class="text-xl font-black mt-1" [class]="business()?.isPublished ? 'text-emerald-600' : 'text-amber-600'">
            {{ business()?.isPublished ? 'Yayında' : 'Taslak' }}
          </h3>
          <p class="text-[11px] text-slate-500 font-semibold mt-1">Menü durumu</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tema</p>
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <i class="fa-solid fa-palette text-sm"></i>
            </div>
          </div>
          <h3 class="text-xl font-black text-[#1F4E79] mt-1 truncate">{{ business()?.theme?.name || 'Minimal' }}</h3>
          <a routerLink="/dashboard/themes" class="text-[11px] font-semibold text-[#F97316] mt-1 inline-block hover:underline">
            Değiştir →
          </a>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-gradient-to-br from-[#1F4E79] to-[#0f2235] p-6 rounded-3xl text-white">
        <h2 class="text-base font-black mb-4">Hızlı İşlemler</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            routerLink="/dashboard/products"
            class="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition text-center"
          >
            <i class="fa-solid fa-plus text-[#F97316] text-xl"></i>
            <span class="text-xs font-bold">Ürün Ekle</span>
          </a>
          <a
            routerLink="/dashboard/categories"
            class="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition text-center"
          >
            <i class="fa-solid fa-folder-plus text-[#F97316] text-xl"></i>
            <span class="text-xs font-bold">Kategori Ekle</span>
          </a>
          <a
            routerLink="/dashboard/qr"
            class="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition text-center"
          >
            <i class="fa-solid fa-qrcode text-[#F97316] text-xl"></i>
            <span class="text-xs font-bold">QR Kod İndir</span>
          </a>
          <a
            routerLink="/dashboard/themes"
            class="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition text-center"
          >
            <i class="fa-solid fa-palette text-[#F97316] text-xl"></i>
            <span class="text-xs font-bold">Tema Seç</span>
          </a>
        </div>
      </div>

    </div>
  `,
})
export class OverviewComponent {
  private restaurantService = inject(RestaurantService);

  business = this.restaurantService.currentBusiness;
  categories = this.restaurantService.categories;
  products = this.restaurantService.products;

  completionPercent = computed(() => {
    const steps = [
      true,                              // Hesap her zaman tamamlandı
      !!this.business()?.name,           // İşletme bilgileri
      !!this.business()?.logo,           // Logo
      this.categories().length > 0,      // Kategoriler
      this.products().length > 0,        // Ürünler
      !!this.business()?.isPublished,    // Yayın
    ];
    const done = steps.filter(Boolean).length;
    return Math.round((done / steps.length) * 100);
  });

  ngOnInit() {
    this.restaurantService.getMyBusiness().subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data?._id) {
          this.restaurantService.getCategories(data._id).subscribe();
          this.restaurantService.getMyProducts(data._id).subscribe();
        }
      },
      error: () => {},
    });
  }
}
