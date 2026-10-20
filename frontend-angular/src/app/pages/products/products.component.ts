import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-black text-[#1F4E79] tracking-tight">Ürün Yönetimi</h1>
          <p class="text-sm text-slate-500 mt-1">
            Yemek, içecek ve tatlılarınızı listeleyin, fiyat ve stok durumlarını kontrol edin.
          </p>
        </div>

        <button
          (click)="openModal()"
          class="px-5 py-2.5 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2"
        >
          <i class="fa-solid fa-plus"></i> Yeni Ürün Ekle
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
          <p class="text-sm font-semibold">Ürünler yükleniyor...</p>
        </div>
      }

      <!-- Products Grid -->
      @if (!loading()) {
        @if (products().length === 0) {
          <div class="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <div class="w-16 h-16 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center mx-auto text-2xl">
              <i class="fa-solid fa-utensils"></i>
            </div>
            <h3 class="text-base font-bold text-slate-700">Henüz hiç ürün eklenmemiş</h3>
            <p class="text-xs text-slate-400 max-w-sm mx-auto">
              Menünüzde sergilenecek lezzetleri ekleyerek başlayın.
            </p>
            <button
              (click)="openModal()"
              class="mt-2 px-5 py-2.5 bg-[#1F4E79] hover:bg-[#153654] text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-2"
            >
              <i class="fa-solid fa-plus"></i> İlk Ürünü Ekle
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (p of products(); track p._id) {
              <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                <div class="p-5 space-y-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {{ getCategoryName(p.category) }}
                      </span>
                      <h4 class="font-extrabold text-base text-slate-800">{{ p.name }}</h4>
                    </div>
                    <span class="text-sm font-black text-[#1F4E79] bg-slate-100 px-2.5 py-1 rounded-xl">
                      {{ p.price }} {{ business()?.currencySymbol || '₺' }}
                    </span>
                  </div>

                  @if (p.description) {
                    <p class="text-xs text-slate-500 line-clamp-2">{{ p.description }}</p>
                  }

                  <div class="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                    @if (p.isVegetarian) {
                      <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                        Vejetaryen
                      </span>
                    }
                    @if (p.isSpicy) {
                      <span class="px-2 py-0.5 rounded-md bg-red-50 text-red-600 font-semibold border border-red-200">
                        Acılı
                      </span>
                    }
                    @if (p.calories) {
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                        {{ p.calories }}
                      </span>
                    }
                  </div>
                </div>

                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    (click)="toggleStock(p._id)"
                    class="text-xs font-bold px-2.5 py-1 rounded-lg border transition"
                    [ngClass]="p.inStock ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                  >
                    {{ p.inStock ? 'Stokta Var' : 'Tükendi' }}
                  </button>

                  <div class="flex items-center space-x-2">
                    <button
                      (click)="edit(p)"
                      class="p-2 text-slate-400 hover:text-[#1F4E79] hover:bg-slate-200/60 rounded-lg transition"
                      title="Düzenle"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      (click)="delete(p._id)"
                      class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Sil"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }

      <!-- Modal -->
      @if (showModal) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="text-lg font-black text-[#1F4E79]">
                {{ editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div class="space-y-3">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">Ürün Adı *</label>
                <input
                  type="text"
                  [(ngModel)]="modalForm.name"
                  placeholder="Örn: Pizza Margherita"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">Kategori *</label>
                <select
                  [(ngModel)]="modalForm.categoryId"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                >
                  <option value="" disabled>Kategori Seçin</option>
                  @for (c of categories(); track c._id) {
                    <option [value]="c._id">{{ c.name }}</option>
                  }
                </select>
                @if (categories().length === 0) {
                  <p class="text-xs text-amber-600 mt-1">
                    Henüz kategori eklemediniz. Lütfen önce "Kategoriler" bölümünden en az bir kategori ekleyin.
                  </p>
                }
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-600">Fiyat (₺) *</label>
                  <input
                    type="number"
                    [(ngModel)]="modalForm.price"
                    placeholder="240"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>

                <div class="space-y-1">
                  <label class="text-xs font-bold text-slate-600">Hazırlık Süresi</label>
                  <input
                    type="text"
                    [(ngModel)]="modalForm.preparationTime"
                    placeholder="15 dk"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">Açıklama & İçindekiler</label>
                <textarea
                  [(ngModel)]="modalForm.description"
                  rows="2"
                  placeholder="Domates sosu, mozzarella, fesleğen..."
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                ></textarea>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-600">Kalori</label>
                <input
                  type="text"
                  [(ngModel)]="modalForm.calories"
                  placeholder="750 kcal"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E79]"
                />
              </div>

              <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="modalForm.isVegetarian" class="rounded text-[#1F4E79]" />
                  Vejetaryen
                </label>
                <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="modalForm.isSpicy" class="rounded text-[#1F4E79]" />
                  Acılı
                </label>
                <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="modalForm.isGlutenFree" class="rounded text-[#1F4E79]" />
                  Glutensiz
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                (click)="closeModal()"
                [disabled]="saving()"
                class="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Vazgeç
              </button>
              <button
                (click)="saveModal()"
                [disabled]="saving() || !modalForm.name.trim() || !modalForm.categoryId"
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
export class ProductsComponent {
  private restaurantService = inject(RestaurantService);

  products = this.restaurantService.products;
  categories = this.restaurantService.categories;
  business = this.restaurantService.currentBusiness;

  loading = signal(false);
  saving = signal(false);
  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  showModal = false;
  editingId: string | null = null;
  modalForm: any = {
    name: '',
    categoryId: '',
    price: 100,
    description: '',
    calories: '',
    preparationTime: '',
    isVegetarian: false,
    isSpicy: false,
    isGlutenFree: false,
  };

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.loading.set(true);
    if (!this.business()?._id) {
      this.restaurantService.getMyBusiness().subscribe({
        next: (b) => {
          const businessId = b?._id || b?.data?._id;
          if (businessId) {
            this.loadData(businessId);
          } else {
            this.loading.set(false);
          }
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loadData(this.business()!._id);
    }
  }

  loadData(businessId: string) {
    this.restaurantService.getMyProducts(businessId).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
    this.restaurantService.getCategories(businessId).subscribe();
  }

  getCategoryName(cat: any): string {
    if (!cat) return 'Genel';
    if (typeof cat === 'object' && cat.name) return cat.name;
    const found = this.categories().find((c) => c._id === cat);
    return found ? found.name : 'Genel';
  }

  openModal() {
    this.editingId = null;
    this.modalForm = {
      name: '',
      categoryId: this.categories()[0]?._id || '',
      price: 100,
      description: '',
      calories: '',
      preparationTime: '',
      isVegetarian: false,
      isSpicy: false,
      isGlutenFree: false,
    };
    this.showModal = true;
  }

  edit(p: any) {
    this.editingId = p._id;
    this.modalForm = {
      name: p.name,
      categoryId: p.category?._id || p.category || '',
      price: p.price,
      description: p.description || '',
      calories: p.calories || '',
      preparationTime: p.preparationTime || '',
      isVegetarian: p.isVegetarian || false,
      isSpicy: p.isSpicy || false,
      isGlutenFree: p.isGlutenFree || false,
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.saving.set(false);
  }

  saveModal() {
    if (!this.modalForm.name?.trim()) {
      this.showToast('error', 'Ürün adı zorunludur.');
      return;
    }
    if (!this.modalForm.categoryId) {
      this.showToast('error', 'Lütfen bir kategori seçin.');
      return;
    }

    this.saving.set(true);
    const bId = this.business()?._id;

    if (this.editingId) {
      this.restaurantService.updateProduct(this.editingId, this.modalForm).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.showToast('success', 'Ürün başarıyla güncellendi!');
        },
        error: (err) => {
          this.saving.set(false);
          this.showToast('error', err?.error?.message || 'Güncelleme başarısız.');
        },
      });
    } else {
      const fd = new FormData();
      Object.keys(this.modalForm).forEach((k) => {
        if (this.modalForm[k] !== undefined && this.modalForm[k] !== null) {
          fd.append(k, this.modalForm[k]);
        }
      });
      if (bId) {
        fd.append('businessId', bId);
      }

      this.restaurantService.createProduct(fd).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.showToast('success', 'Ürün başarıyla eklendi!');
        },
        error: (err) => {
          this.saving.set(false);
          this.showToast('error', err?.error?.message || 'Ürün eklenemedi.');
        },
      });
    }
  }

  delete(id: string) {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.restaurantService.deleteProduct(id).subscribe({
        next: () => this.showToast('success', 'Ürün silindi.'),
        error: () => this.showToast('error', 'Ürün silinirken hata oluştu.'),
      });
    }
  }

  toggleStock(id: string) {
    this.restaurantService.toggleProductStock(id).subscribe({
      next: () => this.showToast('success', 'Stok durumu güncellendi.'),
      error: () => this.showToast('error', 'Stok durumu güncellenemedi.'),
    });
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
