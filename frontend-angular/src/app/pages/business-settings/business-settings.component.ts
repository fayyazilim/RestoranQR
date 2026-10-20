import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-business-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">İşletme Bilgileri</h1>
        <p class="text-sm text-slate-500 mt-1">
          Müşterilerinizin menü başlığında ve QR kodlarında göreceği temel restoran profili.
        </p>
      </div>

      <!-- Toast Notification -->
      @if (toast()) {
        <div
          class="flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold shadow-lg animate-fade-in"
          [class]="toast()!.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'"
        >
          <i [class]="toast()!.type === 'success' ? 'fa-solid fa-circle-check text-emerald-500' : 'fa-solid fa-circle-xmark text-red-500'"></i>
          {{ toast()!.message }}
        </div>
      }

      <!-- Logo Upload Card -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 class="text-sm font-black text-slate-700 mb-4">İşletme Logosu</h2>
        <div class="flex items-center gap-6">
          <!-- Logo Preview -->
          <div class="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center bg-slate-50 flex-shrink-0">
            @if (logoPreview() || business()?.logo) {
              <img
                [src]="logoPreview() || business()?.logo"
                alt="Logo"
                class="w-full h-full object-cover"
              />
            } @else {
              <i class="fa-solid fa-store text-3xl text-slate-300"></i>
            }
          </div>
          <!-- Upload Area -->
          <div class="flex-1">
            <label class="cursor-pointer">
              <div class="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition text-sm font-semibold text-slate-700 flex items-center gap-2 w-fit">
                <i class="fa-solid fa-upload text-[#1F4E79]"></i>
                {{ logoUploading() ? 'Yükleniyor...' : 'Logo Yükle' }}
              </div>
              <input
                type="file"
                accept="image/*"
                (change)="onLogoSelected($event)"
                [disabled]="logoUploading()"
                class="hidden"
              />
            </label>
            <p class="text-xs text-slate-400 mt-2">PNG, JPG veya WebP. Maks 5 MB.</p>
            @if (business()?.logo) {
              <p class="text-xs text-emerald-600 mt-1 font-semibold">
                <i class="fa-solid fa-check-circle"></i> Logo yüklü
              </p>
            }
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Restoran Adı -->
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">Restoran / Kafe Adı *</label>
            <input
              type="text"
              [(ngModel)]="form.name"
              placeholder="Örn: Bella Italia Cafe"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <!-- Açıklama -->
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">Kısa Açıklama & Slogan</label>
            <textarea
              [(ngModel)]="form.description"
              rows="2"
              placeholder="Örn: Taş fırın pizzalar, el açması makarnalar ve taze kahveler..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            ></textarea>
          </div>

          <!-- Telefon -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600">Telefon Numarası</label>
            <input
              type="text"
              [(ngModel)]="form.phone"
              placeholder="+90 (212) 000 00 00"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <!-- E-Posta -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600">İletişim E-Posta</label>
            <input
              type="email"
              [(ngModel)]="form.email"
              placeholder="info@restoran.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <!-- Adres -->
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600">Açık Adres</label>
            <input
              type="text"
              [(ngModel)]="form.address"
              placeholder="Örn: Kadıköy Moda Cad. No: 12, İstanbul"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <!-- Para Birimi -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600">Para Birimi</label>
            <select
              [(ngModel)]="form.currency"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm bg-white"
            >
              <option value="TRY">₺ (Türk Lirası)</option>
              <option value="USD">$ (Dolar)</option>
              <option value="EUR">€ (Euro)</option>
            </select>
          </div>

          <!-- Menü Linki (readonly) -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600">Menü Linki (Slug)</label>
            <div class="flex items-center">
              <span class="px-3 py-2.5 rounded-l-xl bg-slate-100 border border-r-0 border-slate-300 text-xs text-slate-500">
                .../m/
              </span>
              <input
                type="text"
                [value]="business()?.slug || '(işletme kaydedilince oluşur)'"
                disabled
                class="w-full px-4 py-2.5 rounded-r-xl border border-slate-300 bg-slate-50 text-slate-500 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
          @if (saving()) {
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <i class="fa-solid fa-spinner fa-spin"></i> Kaydediliyor...
            </div>
          }
          <button
            (click)="save()"
            [disabled]="saving() || !form.name"
            class="px-6 py-3 bg-[#1F4E79] hover:bg-[#153654] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
          >
            <i class="fa-solid fa-check"></i> Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BusinessSettingsComponent {
  private restaurantService = inject(RestaurantService);

  business = this.restaurantService.currentBusiness;
  saving = signal(false);
  logoUploading = signal(false);
  logoPreview = signal<string | null>(null);
  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  form: any = {
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    currency: 'TRY',
  };

  ngOnInit() {
    this.restaurantService.getMyBusiness().subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data && data.name) {
          this.form = {
            name: data.name || '',
            description: data.description || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            currency: data.currency || 'TRY',
          };
        }
      },
      error: () => {
        // İşletme henüz yok — form boş bırakılır
      },
    });
  }

  save() {
    if (!this.form.name?.trim()) {
      this.showToast('error', 'Restoran adı zorunludur.');
      return;
    }

    this.saving.set(true);

    // Her zaman PATCH (upsert) kullan — backend oluşturur veya günceller
    this.restaurantService.updateBusiness(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.showToast('success', 'İşletme bilgileri başarıyla kaydedildi!');
      },
      error: (err: any) => {
        this.saving.set(false);
        const msg = err?.error?.message || 'Kayıt sırasında hata oluştu.';
        this.showToast('error', Array.isArray(msg) ? msg.join(', ') : msg);
      },
    });
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Önizleme
    const reader = new FileReader();
    reader.onload = (e) => this.logoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    // Cloudinary'ye yükle
    this.logoUploading.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.restaurantService.uploadLogo(formData).subscribe({
      next: () => {
        this.logoUploading.set(false);
        this.showToast('success', 'Logo başarıyla yüklendi!');
      },
      error: (err: any) => {
        this.logoUploading.set(false);
        const msg = err?.error?.message || 'Logo yüklenirken hata oluştu.';
        this.showToast('error', msg);
      },
    });
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
