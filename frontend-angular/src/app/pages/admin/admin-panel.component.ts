import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">
      <div>
        <span class="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
          Süper Yetkili
        </span>
        <h1 class="text-3xl font-black text-[#1F4E79] tracking-tight mt-2">Platform Admin Paneli</h1>
        <p class="text-sm text-slate-500 mt-1">
          Sisteme kayıtlı tüm restoranlar, kullanıcılar ve toplam abonelik gelirleri.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Restoran</p>
          <h3 class="text-3xl font-black text-[#1F4E79] mt-2">{{ stats()?.totalBusinesses || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kayıtlı Kullanıcı</p>
          <h3 class="text-3xl font-black text-[#1F4E79] mt-2">{{ stats()?.totalUsers || 0 }}</h3>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Gelir</p>
          <h3 class="text-3xl font-black text-emerald-600 mt-2">{{ stats()?.totalRevenue || 0 }} ₺</h3>
        </div>
      </div>

      <!-- Businesses List -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-base font-black text-[#1F4E79]">Kayıtlı İşletmeler</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-[11px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th class="p-4 pl-6">İşletme Adı</th>
                <th class="p-4">Slug</th>
                <th class="p-4">Yayın Durumu</th>
                <th class="p-4">Görüntülenme</th>
                <th class="p-4 pr-6">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let b of businesses()" class="hover:bg-slate-50 transition">
                <td class="p-4 pl-6 font-bold text-slate-800">{{ b.name }}</td>
                <td class="p-4 text-xs text-slate-500 font-mono">/m/{{ b.slug }}</td>
                <td class="p-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    [ngClass]="b.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ b.isPublished ? 'Yayında' : 'Taslak' }}
                  </span>
                </td>
                <td class="p-4 font-bold text-[#1F4E79]">{{ b.totalViews || 0 }}</td>
                <td class="p-4 pr-6">
                  <a
                    [href]="'http://localhost:3000/m/' + b.slug"
                    target="_blank"
                    class="text-xs font-bold text-[#F97316] hover:underline"
                  >
                    Menüyü Gör ↗
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminPanelComponent {
  private restaurantService = inject(RestaurantService);

  stats = signal<any>(null);
  businesses = signal<any[]>([]);

  ngOnInit() {
    this.restaurantService.getAdminStats().subscribe((res) => {
      if (res.data) this.stats.set(res.data);
    });

    this.restaurantService.getAdminBusinesses().subscribe((res) => {
      if (res.data?.businesses) this.businesses.set(res.data.businesses);
    });
  }
}
