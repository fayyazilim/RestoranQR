import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="h-screen flex overflow-hidden bg-slate-100 font-sans">

      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-10 lg:hidden"
          (click)="sidebarOpen.set(false)"
        ></div>
      }

      <!-- Sidebar -->
      <aside
        class="w-64 bg-[#0f2235] text-slate-300 flex flex-col justify-between flex-shrink-0 z-20 transition-transform duration-300"
        [class.hidden]="false"
      >
        <div class="flex flex-col h-full overflow-hidden">
          <!-- Logo / Brand -->
          <div class="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <i class="fa-solid fa-qrcode text-base"></i>
              </div>
              <span class="font-extrabold text-xl text-white tracking-tight">
                QR<span class="text-[#F97316]">Dijital</span>
              </span>
            </div>
          </div>

          <!-- Restaurant Badge -->
          <div class="px-4 py-3 border-b border-white/10 flex-shrink-0">
            <div class="bg-white/5 hover:bg-white/8 rounded-2xl p-3 border border-white/10 flex items-center space-x-3 transition">
              @if (business()?.logo) {
                <img [src]="business()!.logo" class="w-10 h-10 rounded-xl object-cover" alt="logo" />
              } @else {
                <div class="w-10 h-10 rounded-xl bg-[#F97316]/20 text-[#F97316] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {{ restaurantInitial() }}
                </div>
              }
              <div class="min-w-0">
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Aktif İşletme</p>
                <h4 class="text-xs font-bold text-white truncate">
                  {{ business()?.name || 'İşletme Belirtilmedi' }}
                </h4>
                @if (business()?.isPublished) {
                  <span class="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Yayında
                  </span>
                } @else {
                  <span class="text-[10px] text-amber-400 font-semibold">Taslak</span>
                }
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

            <!-- Menü Yönetimi Section -->
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2">Menü Yönetimi</p>

            <a
              routerLink="/dashboard"
              routerLinkActive="bg-[#1F4E79] text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
            >
              <i class="fa-solid fa-chart-pie w-4 text-center text-slate-400"></i>
              <span>Genel Bakış</span>
            </a>

            <a
              routerLink="/dashboard/business"
              routerLinkActive="bg-[#1F4E79] text-white"
              class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold group"
            >
              <div class="flex items-center space-x-3">
                <i class="fa-solid fa-store w-4 text-center text-slate-400"></i>
                <span>İşletme Bilgileri</span>
              </div>
              @if (!business()?.name) {
                <span class="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">!</span>
              }
            </a>

            <a
              routerLink="/dashboard/categories"
              routerLinkActive="bg-[#1F4E79] text-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
            >
              <i class="fa-solid fa-layer-group w-4 text-center text-slate-400"></i>
              <span>Kategoriler</span>
            </a>

            <a
              routerLink="/dashboard/products"
              routerLinkActive="bg-[#1F4E79] text-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
            >
              <i class="fa-solid fa-utensils w-4 text-center text-slate-400"></i>
              <span>Ürün Yönetimi</span>
            </a>

            <!-- Özelleştirme Section -->
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2 pt-4">Özelleştirme</p>

            <a
              routerLink="/dashboard/themes"
              routerLinkActive="bg-[#1F4E79] text-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
            >
              <i class="fa-solid fa-palette w-4 text-center text-slate-400"></i>
              <span>Tema Seçimi</span>
            </a>

            <!-- Yayın Section -->
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2 pt-4">Yayın</p>

            <a
              routerLink="/dashboard/qr"
              routerLinkActive="bg-[#F97316] text-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-[#F97316]/20 hover:text-[#F97316] transition text-sm font-semibold"
            >
              <i class="fa-solid fa-qrcode w-4 text-center text-[#F97316]"></i>
              <span>QR Kod & İndir</span>
            </a>

            <a
              routerLink="/dashboard/subscription"
              routerLinkActive="bg-[#1F4E79] text-white"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
            >
              <i class="fa-solid fa-credit-card w-4 text-center text-slate-400"></i>
              <span>Abonelik & Ödeme</span>
            </a>

            <!-- Admin Section -->
            @if (isAdmin()) {
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-2 pt-4">Admin</p>
              <a
                routerLink="/admin"
                routerLinkActive="bg-amber-500/20 text-amber-400"
                class="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/10 hover:text-white transition text-sm font-semibold"
              >
                <i class="fa-solid fa-shield-halved w-4 text-center text-amber-400"></i>
                <span>Süper Admin Paneli</span>
              </a>
            }
          </nav>

          <!-- Sidebar Footer — User Info -->
          <div class="px-4 py-3 border-t border-white/10 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-[#1F4E79] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {{ userInitial() }}
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-white truncate">{{ user()?.name }}</p>
                  <p class="text-[10px] text-slate-400 truncate">{{ user()?.email }}</p>
                </div>
              </div>
              <button
                (click)="logout()"
                title="Çıkış Yap"
                class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition flex-shrink-0"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

        <!-- Top Bar -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-slate-400 hidden sm:block">Yönetim Paneli</span>
            @if (business()?.isPublished) {
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Yayında
              </span>
            } @else {
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Taslak
              </span>
            }
          </div>

          <div class="flex items-center gap-2">
            <!-- Canlı Menüyü Aç -->
            @if (business()?.slug) {
              <a
                [href]="'http://localhost:3000/m/' + business()?.slug"
                target="_blank"
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F4E79] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span class="hidden sm:inline">Canlı Menüyü Aç</span>
              </a>
            }

            <!-- Menüyü Yayınla -->
            @if (!business()?.isPublished && business()?.name) {
              <button
                (click)="publish()"
                [disabled]="publishing()"
                class="px-4 py-2 bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm shadow-orange-500/20 transition flex items-center gap-1.5"
              >
                <i class="fa-solid" [class]="publishing() ? 'fa-spinner fa-spin' : 'fa-rocket'"></i>
                {{ publishing() ? 'Yayınlanıyor...' : 'Menüyü Yayınla' }}
              </button>
            }
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private restaurantService = inject(RestaurantService);

  user = this.authService.currentUser;
  business = this.restaurantService.currentBusiness;
  isAdmin = this.authService.isAdmin;
  sidebarOpen = signal(false);
  publishing = signal(false);

  userInitial = computed(() => this.user()?.name?.charAt(0).toUpperCase() || 'U');
  restaurantInitial = computed(() => this.business()?.name?.charAt(0).toUpperCase() || 'R');

  ngOnInit() {
    this.restaurantService.getMyBusiness().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  publish() {
    this.publishing.set(true);
    this.restaurantService.publishMenu().subscribe({
      next: () => {
        this.publishing.set(false);
      },
      error: (err: any) => {
        this.publishing.set(false);
        alert(err?.error?.message || 'Yayınlama başarısız');
      },
    });
  }
}
