import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">Abonelik & iyzico Ödeme</h1>
        <p class="text-sm text-slate-500 mt-1">
          QR menünüzün yayında kalması için aktif abonelik paketinizi yönetin.
        </p>
      </div>

      <!-- Payment Status Alert if redirected from iyzico -->
      <div
        *ngIf="statusMessage"
        class="p-4 rounded-2xl border text-sm font-bold flex items-center gap-3"
        [ngClass]="statusSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'"
      >
        <i class="fa-solid" [ngClass]="statusSuccess ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-rose-500'"></i>
        {{ statusMessage }}
      </div>

      <!-- Current Plan Status Card -->
      <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Mevcut Durum</span>
          <div class="flex items-center gap-3">
            <h3 class="text-2xl font-black text-[#1F4E79]">Profesyonel Plan</h3>
            <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700">
              Aktif
            </span>
          </div>
          <p class="text-xs text-slate-500">
            iyzico korumalı aylık otomatik yenileme. İstediğiniz zaman iptal edebilirsiniz.
          </p>
        </div>

        <div class="text-right flex flex-col items-start md:items-end gap-2">
          <span class="text-3xl font-black text-[#1F4E79]">399 ₺ <span class="text-xs font-normal text-slate-400">/ ay</span></span>
          <button
            class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
          >
            Faturayı İndir
          </button>
        </div>
      </div>

      <!-- Plan Features Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <i class="fa-solid fa-infinity text-xl text-[#F97316]"></i>
          <h4 class="font-bold text-sm text-slate-800">Sınırsız Ürün & Kategori</h4>
          <p class="text-xs text-slate-500">Menünüze dilediğiniz kadar ürün ve kategori ekleyin.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <i class="fa-solid fa-wand-magic-sparkles text-xl text-[#1F4E79]"></i>
          <h4 class="font-bold text-sm text-slate-800">5 Özel Lüks Tema</h4>
          <p class="text-xs text-slate-500">Minimal, Klasik, Dark, Renkli ve Elegant temalar açık.</p>
        </div>

        <div class="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <i class="fa-solid fa-shield-halved text-xl text-emerald-600"></i>
          <h4 class="font-bold text-sm text-slate-800">iyzico Güvencesi</h4>
          <p class="text-xs text-slate-500">BDDK lisanslı ve 256-bit SSL şifrelemeli ödeme altyapısı.</p>
        </div>
      </div>
    </div>
  `,
})
export class SubscriptionComponent {
  private route = inject(ActivatedRoute);

  statusMessage: string | null = null;
  statusSuccess = false;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['status'] === 'success') {
        this.statusSuccess = true;
        this.statusMessage = 'Ödemeniz başarıyla tamamlandı ve menünüz yayına alındı!';
      } else if (params['status'] === 'failed') {
        this.statusSuccess = false;
        this.statusMessage = 'Ödeme işlemi tamamlanamadı veya iptal edildi.';
      }
    });
  }
}
