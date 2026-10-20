import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">Kategori Yönetimi</h1>
          <p class="text-sm text-slate-500 mt-1">
            Menünüzün bölümlerini oluşturun (Örn: Çorbalar, Ana Yemekler, Tatlılar, İçecekler).
          </p>
        </div>

        <button
          (click)="openModal()"
          class="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
        >
          <i class="fa-solid fa-plus"></i> Yeni Kategori Ekle
        </button>
      </div>

      <!-- Toast Notification -->
      @if (toast()) {
        <div
          class="flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-semibold shadow-lg transition animate-fade-in"
          [class]="toast()!.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'"
        >
          <i [class]="toast()!.type === 'success' ? 'fa-solid fa-circle-check text-emerald-500' : 'fa-solid fa-circle-xmark text-red-500'"></i>
          {{ toast()!.message }}
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
          <i class="fa-solid fa-spinner fa-spin text-3xl mb-3 text-[#1F4E79]"></i>
          <p class="text-sm font-semibold">Kategoriler yükleniyor...</p>
        </div>
      }

      <!-- Categories List -->
      @if (!loading()) {
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          @if (categories().length === 0) {
            <div class="p-16 text-center text-slate-400 space-y-3">
              <div class="w-16 h-16 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto text-2xl">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <h3 class="text-base font-bold text-slate-700">Henüz hiç kategori eklenmemiş</h3>
              <p class="text-xs text-slate-400 max-w-sm mx-auto">
                Müşterilerinize ürünlerinizi düzenli sunabilmek için ilk kategorinizi yukarıdaki butondan ekleyin.
              </p>
              <button
                (click)="openModal()"
                class="mt-2 px-5 py-2.5 bg-[#1F4E79] hover:bg-[#153654] text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-2"
              >
                <i class="fa-solid fa-plus"></i> İlk Kategoriyi Ekle
              </button>
            </div>
          } @else {
            <div class="divide-y divide-slate-100">
              @for (cat of categories(); track cat._id; let i = $index) {
                <div class="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition group">
                  <div class="flex items-center space-x-4">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                      {{ i + 1 }}
                    </span>
                    <div>
                      <h4 class="font-bold text-sm text-slate-800 flex items-center gap-2">
                        {{ cat.name }}
                        @if (!cat.isActive) {
                          <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">Pasif</span>
                        }
                      </h4>
                      @if (cat.description) {
                        <p class="text-xs text-slate-400 mt-0.5">{{ cat.description }}</p>
                      }
                    </div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      (click)="edit(cat)"
                      class="p-2.5 text-slate-400 hover:text-[#1F4E79] hover:bg-blue-50 rounded-xl transition"
                      title="Düzenle"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      (click)="delete(cat._id)"
                      class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Sil"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-in">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="text-lg font-black text-[#1F4E79]">
                {{ editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600">Kategori Adı *</label>
                <input
                  type="text"
                  [(ngModel)]="modalForm.name"
                  placeholder="Örn: Başlangıçlar, Ana Yemekler, Tatlılar..."
                  (keyup.enter)="saveModal()"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-600">Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  [(ngModel)]="modalForm.description"
                  placeholder="Örn: Taş fırından taze çıkan lezzetler..."
                  (keyup.enter)="saveModal()"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                (click)="closeModal()"
                [disabled]="saving()"
                class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Vazgeç
              </button>
              <button
                (click)="saveModal()"
                [disabled]="saving() || !modalForm.name.trim()"
                class="px-6 py-2.5 text-xs font-bold bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
              >
                @if (saving()) {
                  <i class="fa-solid fa-spinner fa-spin"></i>
                }
                {{ saving() ? 'Kaydediliyor...' : 'Kaydet' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CategoriesComponent {
  private restaurantService = inject(RestaurantService);

  categories = this.restaurantService.categories;
  business = this.restaurantService.currentBusiness;

  loading = signal(false);
  saving = signal(false);
  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  showModal = false;
  editingId: string | null = null;
  modalForm: { name: string; description: string } = { name: '', description: '' };

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.loading.set(true);
    // If business is not yet loaded into signal, fetch it first
    if (!this.business()?._id) {
      this.restaurantService.getMyBusiness().subscribe({
        next: (b) => {
          const businessId = b?._id || b?.data?._id;
          if (businessId) {
            this.loadCategories(businessId);
          } else {
            this.loading.set(false);
          }
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loadCategories(this.business()!._id);
    }
  }

  loadCategories(businessId: string) {
    this.restaurantService.getCategories(businessId).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  openModal() {
    this.editingId = null;
    this.modalForm = { name: '', description: '' };
    this.showModal = true;
  }

  edit(cat: any) {
    this.editingId = cat._id;
    this.modalForm = { name: cat.name, description: cat.description || '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.saving.set(false);
  }

  saveModal() {
    if (!this.modalForm.name.trim()) {
      this.showToast('error', 'Kategori adı zorunludur.');
      return;
    }

    this.saving.set(true);
    const bId = this.business()?._id;

    if (this.editingId) {
      this.restaurantService.updateCategory(this.editingId, this.modalForm).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.showToast('success', 'Kategori güncellendi!');
        },
        error: (err) => {
          this.saving.set(false);
          this.showToast('error', err?.error?.message || 'Güncelleme başarısız.');
        },
      });
    } else {
      const payload: any = { ...this.modalForm };
      if (bId) payload.businessId = bId;

      this.restaurantService.createCategory(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.showToast('success', 'Kategori başarıyla eklendi!');
        },
        error: (err) => {
          this.saving.set(false);
          this.showToast('error', err?.error?.message || 'Kategori eklenemedi.');
        },
      });
    }
  }

  delete(id: string) {
    if (confirm('Bu kategoriyi silmek istediğinize emin misiniz? Altındaki ürünler kategorisiz kalabilir.')) {
      this.restaurantService.deleteCategory(id).subscribe({
        next: () => this.showToast('success', 'Kategori silindi.'),
        error: () => this.showToast('error', 'Kategori silinirken hata oluştu.'),
      });
    }
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
