import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-qr-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">QR Kod & İndirme</h1>
        <p class="text-sm text-slate-500 mt-1">
          Müşterilerinizin telefon kamerasıyla okutup menünüze ulaşacağı benzersiz QR kodunuz.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <!-- QR Display Card -->
        <div class="md:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center space-y-5">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-inner">
            <img
              *ngIf="qrUrl()"
              [src]="qrUrl()"
              alt="Masa Menü QR Kodu"
              class="w-52 h-52 object-contain"
            />
            <div
              *ngIf="!qrUrl()"
              class="w-52 h-52 flex flex-col items-center justify-center text-slate-400 gap-2"
            >
              <i class="fa-solid fa-qrcode text-5xl"></i>
              <span class="text-xs font-semibold">QR Kod Üretilmedi</span>
            </div>
          </div>

          <div>
            <h3 class="font-extrabold text-base text-slate-800">{{ business()?.name }}</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ menuLink() }}</p>
          </div>

          <button
            (click)="generateQr()"
            class="w-full py-3 bg-[#1F4E79] hover:bg-[#153654] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-arrows-rotate"></i> Yeniden QR Kod Üret
          </button>
        </div>

        <!-- Download & Print Actions -->
        <div class="md:col-span-7 space-y-4">
          <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 class="text-base font-extrabold text-[#1F4E79]">Baskı & İndirme Seçenekleri</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Masalarınıza, stantlarınıza veya sosyal medya hesaplarınıza eklemek için yüksek çözünürlüklü formatlarda indirin.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                [href]="pngDownloadUrl()"
                target="_blank"
                class="p-4 rounded-2xl border border-slate-200 hover:border-[#1F4E79] transition flex flex-col justify-between space-y-3 bg-slate-50 hover:bg-white"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-10 h-10 rounded-xl bg-blue-100 text-[#1F4E79] flex items-center justify-center font-bold text-sm">
                    PNG
                  </span>
                  <div>
                    <h4 class="font-bold text-xs text-slate-800">Şeffaf / Yüksek Kalite</h4>
                    <span class="text-[10px] text-slate-400">Tasarımcılar için</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-[#1F4E79]">PNG İndir →</span>
              </a>

              <a
                [href]="pdfDownloadUrl()"
                target="_blank"
                class="p-4 rounded-2xl border border-slate-200 hover:border-[#F97316] transition flex flex-col justify-between space-y-3 bg-slate-50 hover:bg-white"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-10 h-10 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center font-bold text-sm">
                    PDF
                  </span>
                  <div>
                    <h4 class="font-bold text-xs text-slate-800">A4 Yazdırılabilir Şablon</h4>
                    <span class="text-[10px] text-slate-400">Masa Standı</span>
                  </div>
                </div>
                <span class="text-xs font-bold text-[#F97316]">PDF İndir →</span>
              </a>
            </div>
          </div>

          <!-- Instructions Card -->
          <div class="bg-blue-50/70 border border-blue-200/60 p-6 rounded-3xl space-y-2">
            <h4 class="text-xs font-extrabold text-[#1F4E79] uppercase tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-lightbulb text-amber-500"></i> İpucu:
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              QR kodunuz sabittir. Ürün veya fiyat değiştirdiğinizde QR kodunu tekrar bastırmanıza gerek yoktur; masadaki QR kodu okutan müşterileriniz her zaman en güncel menünüzü görür.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class QrManagementComponent {
  private restaurantService = inject(RestaurantService);

  business = this.restaurantService.currentBusiness;
  qrUrl = signal<string | null>(null);

  menuLink() {
    const slug = this.business()?.slug;
    return slug ? `http://localhost:3000/m/${slug}` : '';
  }

  pngDownloadUrl() {
    const bId = this.business()?._id;
    return bId ? `http://localhost:3001/api/qr/download/png/${bId}` : '#';
  }

  pdfDownloadUrl() {
    const bId = this.business()?._id;
    return bId ? `http://localhost:3001/api/qr/download/pdf/${bId}` : '#';
  }

  ngOnInit() {
    const b = this.business();
    if (b?._id) {
      if (b.qrCodeUrl) {
        this.qrUrl.set(b.qrCodeUrl);
      } else {
        this.generateQr();
      }
    }
  }

  generateQr() {
    const b = this.business();
    if (!b?._id) return;

    this.restaurantService.generateQr(b._id).subscribe({
      next: (res) => {
        if (res.data?.qrCodeUrl) {
          this.qrUrl.set(res.data.qrCodeUrl);
        }
      },
      error: (err) => alert(err?.error?.message || 'QR kod üretilemedi'),
    });
  }
}
