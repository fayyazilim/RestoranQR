import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">Tema Seçimi</h1>
        <p class="text-sm text-slate-500 mt-1">
          Müşterilerinizin göreceği menü arayüz stilini seçin. En az 5 modern tema hazırdır.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let t of themes()"
          class="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md"
          [ngClass]="isSelected(t._id) ? 'border-2 border-[#F97316] ring-2 ring-orange-500/20' : 'border-slate-200/80'"
        >
          <div class="p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-base text-slate-800">{{ t.name }}</h3>
              <span
                *ngIf="isSelected(t._id)"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#F97316]"
              >
                Aktif Tema
              </span>
            </div>

            <p class="text-xs text-slate-500 leading-relaxed">{{ t.description }}</p>

            <!-- Color Palette Preview -->
            <div class="space-y-1.5 pt-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Renk Paleti</span>
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full border shadow-xs" [style.backgroundColor]="t.colors?.light?.primary"></span>
                <span class="w-6 h-6 rounded-full border shadow-xs" [style.backgroundColor]="t.colors?.light?.secondary"></span>
                <span class="w-6 h-6 rounded-full border shadow-xs" [style.backgroundColor]="t.colors?.light?.background"></span>
                <span class="w-6 h-6 rounded-full border shadow-xs" [style.backgroundColor]="t.colors?.dark?.background"></span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <a
              *ngIf="business()?.slug"
              [href]="'http://localhost:3000/m/' + business()?.slug"
              target="_blank"
              class="text-xs font-bold text-slate-500 hover:text-[#1F4E79]"
            >
              Önizle ↗
            </a>

            <button
              (click)="selectTheme(t._id)"
              [disabled]="isSelected(t._id)"
              class="px-4 py-2 text-xs font-bold rounded-xl transition"
              [ngClass]="isSelected(t._id) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#1F4E79] hover:bg-[#153654] text-white shadow-sm'"
            >
              {{ isSelected(t._id) ? 'Seçildi' : 'Temayı Uygula' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ThemesComponent {
  private restaurantService = inject(RestaurantService);

  themes = this.restaurantService.themes;
  business = this.restaurantService.currentBusiness;

  ngOnInit() {
    this.restaurantService.getThemes().subscribe();
  }

  isSelected(themeId: string): boolean {
    const bTheme = this.business()?.theme;
    if (!bTheme) return false;
    return (bTheme._id || bTheme) === themeId;
  }

  selectTheme(themeId: string) {
    this.restaurantService.updateBusiness({ themeId }).subscribe({
      next: () => {
        alert('Tema başarıyla güncellendi!');
        this.restaurantService.getMyBusiness().subscribe();
      },
      error: (err) => alert(err?.error?.message || 'Tema güncellenemedi'),
    });
  }
}
