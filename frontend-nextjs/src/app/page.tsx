'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Smartphone,
  Palette,
  Zap,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Menu as MenuIcon,
  X,
  CreditCard,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1F4E79] flex items-center justify-center text-white shadow-lg shadow-[#1F4E79]/20">
              <QrCode className="w-6 h-6 text-[#F97316]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1F4E79]">
              Restoran<span className="text-[#F97316]">QR</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#1F4E79] transition">Özellikler</a>
            <a href="#themes" className="hover:text-[#1F4E79] transition">Temalar</a>
            <a href="#pricing" className="hover:text-[#1F4E79] transition">Fiyatlandırma</a>
            <a href="http://localhost:3000/m/bella-italia" target="_blank" className="hover:text-[#F97316] transition flex items-center gap-1 font-bold text-[#1F4E79]">
              Örnek Menü <Sparkles className="w-4 h-4 text-[#F97316]" />
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="http://localhost:4200/auth/login"
              className="text-sm font-bold text-[#1F4E79] px-4 py-2 hover:bg-slate-100 rounded-xl transition"
            >
              Giriş Yap
            </a>
            <a
              href="http://localhost:4200/auth/register"
              className="text-sm font-bold bg-[#F97316] hover:bg-[#ea580c] text-white px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
            >
              Ücretsiz Başla
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-white border-b border-slate-200 flex flex-col space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700 font-medium">Özellikler</a>
            <a href="#themes" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700 font-medium">Temalar</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700 font-medium">Fiyatlandırma</a>
            <a href="http://localhost:3000/m/bella-italia" target="_blank" className="py-2 text-[#1F4E79] font-bold">Örnek Menü</a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="http://localhost:4200/auth/login"
                className="w-full text-center py-2.5 text-sm font-bold text-[#1F4E79] border border-slate-200 rounded-xl"
              >
                Giriş Yap
              </a>
              <a
                href="http://localhost:4200/auth/register"
                className="w-full text-center py-2.5 text-sm font-bold bg-[#F97316] text-white rounded-xl shadow-md"
              >
                Ücretsiz Başla
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,#e0f2fe,white)] opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-bold text-[#F97316]">
                <Sparkles className="w-4 h-4" /> Yeni Nesil Çok Temalı Menü Sistemi
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F4E79] tracking-tight leading-tight">
                Restoranınız İçin <span className="text-[#F97316]">Akıllı & Şık</span> Dijital QR Menü
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Baskı maliyetlerine son verin! Fiyatları, ürünleri ve görselleri tek tıkla anında güncelleyin.
                5 farklı lüks tema seçeneği ve iyzico güvencesiyle 5 dakikada yayına alın.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="http://localhost:4200/auth/register"
                  className="w-full sm:w-auto px-8 py-4 bg-[#F97316] hover:bg-[#ea580c] text-white font-extrabold rounded-2xl shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 text-base"
                >
                  14 Gün Ücretsiz Dene
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="http://localhost:3000/m/bella-italia"
                  target="_blank"
                  className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-[#1F4E79] font-bold rounded-2xl shadow-sm hover:shadow transition text-center flex items-center justify-center gap-2 text-base"
                >
                  Canlı Menüyü Gör
                </a>
              </div>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kredi Kartı Gerekmez</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Anında QR Kod</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sınırsız Güncelleme</span>
              </div>
            </div>

            {/* Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] sm:w-[320px] rounded-[40px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-900/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                <div className="overflow-hidden rounded-[32px] bg-white h-[580px] flex flex-col">
                  {/* Phone Screen Mock */}
                  <div className="h-40 bg-[#1F4E79] p-4 text-white flex flex-col justify-end relative">
                    <div className="absolute top-6 right-4 px-2 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold">
                      Açık 09:00 - 23:00
                    </div>
                    <h3 className="font-extrabold text-xl">Bella Italia Cafe</h3>
                    <p className="text-xs text-blue-200">İtalyan Mutfağı & Özel Kahveler</p>
                  </div>
                  <div className="flex border-b border-slate-100 overflow-x-auto px-3 py-2 gap-2 text-xs font-bold text-slate-600 bg-slate-50">
                    <span className="px-3 py-1 bg-[#F97316] text-white rounded-lg">Pizzalar</span>
                    <span className="px-3 py-1 bg-white border rounded-lg">Makarnalar</span>
                    <span className="px-3 py-1 bg-white border rounded-lg">Tatlılar</span>
                  </div>
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Pizza Margherita</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">Domates sos, manda mozzarella, taze fesleğen</p>
                        <span className="text-xs font-black text-[#1F4E79] mt-1 inline-block">240 ₺</span>
                      </div>
                      <div className="w-14 h-14 rounded-lg bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#F97316]">
                        🍕
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Quattro Formaggi</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">Gorgonzola, parmesan, mozzarella, ricotta</p>
                        <span className="text-xs font-black text-[#1F4E79] mt-1 inline-block">290 ₺</span>
                      </div>
                      <div className="w-14 h-14 rounded-lg bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#F97316]">
                        🧀
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Tiramisu Classico</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">Savoiardi bisküvi, espresso, mascarpone</p>
                        <span className="text-xs font-black text-[#1F4E79] mt-1 inline-block">160 ₺</span>
                      </div>
                      <div className="w-14 h-14 rounded-lg bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#F97316]">
                        🍰
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-extrabold text-[#F97316] uppercase tracking-wider">
              Neden RestoranQR?
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1F4E79] tracking-tight">
              Restoranınızı Dijital Çağa Taşıyan Güçlü Özellikler
            </p>
            <p className="text-slate-600">
              Hem işletme sahibine pratik yönetim hem de müşterilere mükemmel bir sipariş deneyimi sunun.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1F4E79] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">Ultra Hızlı & Mobil Uyumlu</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Next.js 14 altyapısı sayesinde menüleriniz ışık hızında açılır, uygulama indirme zorunluluğu yoktur.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">5 Özel Tasarım Teması</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Minimal, Klasik, Dark Mode, Renkli ve Elegant temalar arasından mekanınıza en yakışanı seçin.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">Anlık Menü & Fiyat Değişimi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Bitmiş ürünleri anında gizleyin, güncel fiyatları kaydedin; tüm masalardaki QR menüler canlı güncellensin.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">Baskıya Hazır PDF QR Çıktısı</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tek tıkla masalarınıza koyabileceğiniz şık, yüksek çözünürlüklü A4 PDF ve PNG QR şablonları indirin.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">iyzico Güvenli Ödeme</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Aboneliğinizi Türkiye'nin lider ödeme altyapısı iyzico ile güvenle başlatın ve otomatik yenileyin.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1F4E79]">Detaylı İstatistikler</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hangi ürünlerin ne kadar görüntülendiğini, menünüzün toplam ziyaretçi sayısını admin panelinden takip edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-extrabold text-[#F97316] uppercase tracking-wider">
              Şeffaf Fiyatlandırma
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-[#1F4E79] tracking-tight">
              Her Boyuttaki İşletmeye Uygun Paketler
            </p>
            <p className="text-slate-600">
              Gizli ücret yok, taahhüt yok. İstediğiniz zaman iptal edebilirsiniz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Başlangıç</h3>
                <p className="text-sm text-slate-500">Küçük kafeler ve butik işletmeler için ideal</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1F4E79]">199 ₺</span>
                  <span className="text-sm text-slate-500 font-semibold">/ ay</span>
                </div>
                <ul className="space-y-3 pt-4 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100 Ürüne Kadar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 10 Kategori</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Otomatik QR Kod İndirme</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Temel Temalar</li>
                </ul>
              </div>
              <a
                href="http://localhost:4200/auth/register"
                className="w-full py-3 text-center text-sm font-bold border border-slate-300 hover:border-slate-400 rounded-xl transition text-[#1F4E79]"
              >
                Hemen Başla
              </a>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-white border-2 border-[#F97316] shadow-xl relative flex flex-col justify-between space-y-6">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F97316] text-white px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                En Popüler
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1F4E79]">Profesyonel</h3>
                <p className="text-sm text-slate-500">Büyüyen restoranlar ve yoğun işletmeler için</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1F4E79]">399 ₺</span>
                  <span className="text-sm text-slate-500 font-semibold">/ ay</span>
                </div>
                <ul className="space-y-3 pt-4 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Sınırsız Ürün & Kategori</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Tüm 5 Premium Tema</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Ziyaretçi İstatistikleri</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Alerjen & Besin Bilgisi</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Yüksek Çözünürlüklü PDF Baskı</li>
                </ul>
              </div>
              <a
                href="http://localhost:4200/auth/register"
                className="w-full py-3 text-center text-sm font-bold bg-[#F97316] hover:bg-[#ea580c] text-white rounded-xl shadow-md shadow-orange-500/20 transition"
              >
                Hemen Başla
              </a>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Kurumsal</h3>
                <p className="text-sm text-slate-500">Zincir restoranlar ve oteller için</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1F4E79]">799 ₺</span>
                  <span className="text-sm text-slate-500 font-semibold">/ ay</span>
                </div>
                <ul className="space-y-3 pt-4 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Çoklu Şube Yönetimi</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Özel Domain Desteği</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Özel Marka Renk Paleti</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 7/24 Öncelikli Destek</li>
                </ul>
              </div>
              <a
                href="http://localhost:4200/auth/register"
                className="w-full py-3 text-center text-sm font-bold border border-slate-300 hover:border-slate-400 rounded-xl transition text-[#1F4E79]"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#1F4E79] text-white py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5 text-[#F97316]" />
            </div>
            <span className="font-extrabold text-xl">
              Restoran<span className="text-[#F97316]">QR</span>
            </span>
          </div>
          <p className="text-xs text-slate-300">
            © 2026 RestoranQR Platformu. Tüm hakları saklıdır. Multi-tenant SaaS dijital menü altyapısı.
          </p>
          <div className="flex items-center space-x-6 text-xs text-slate-300 font-medium">
            <a href="http://localhost:4200/auth/login" className="hover:text-white transition">Kullanıcı Paneli</a>
            <a href="http://localhost:4200/admin" className="hover:text-white transition">Admin Girişi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
