import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div class="text-center space-y-2">
          <div class="inline-flex w-12 h-12 rounded-2xl bg-[#1F4E79] items-center justify-center text-[#F97316] text-2xl shadow-md">
            <i class="fa-solid fa-qrcode"></i>
          </div>
          <h2 class="text-2xl font-black text-[#1F4E79]">Ücretsiz Hesap Oluştur</h2>
          <p class="text-xs text-slate-500">Dijital QR menünüzü 5 dakikada yayına alın.</p>
        </div>

        <form (ngSubmit)="submit()" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-600">Adınız Soyadınız</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="Ahmet Yılmaz"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-600">E-Posta Adresi</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="ahmet@restoran.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-600">Şifre</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1F4E79] text-sm"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            Hesap Oluştur ve Başla
          </button>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Zaten hesabınız var mı?
          <a routerLink="/auth/login" class="font-bold text-[#1F4E79] hover:underline ml-1">
            Giriş Yapın
          </a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  submit() {
    this.authService
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => alert(err?.error?.message || 'Kayıt başarısız'),
      });
  }
}
