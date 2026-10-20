'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Clock,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Flame,
  Wheat,
  Leaf,
  Moon,
  Sun,
  Info,
  ChevronRight,
} from 'lucide-react';
import { MenuResponse, Product, Category } from '@/types/menu';

// Fallback demo menu if backend is offline during preview
const DEMO_MENU: MenuResponse = {
  business: {
    _id: 'demo1',
    name: 'Bella Italia Cafe & Trattoria',
    slug: 'bella-italia',
    description: 'Otantik taş fırın İtalyan pizzaları, el açması makarnalar ve taze çekilmiş espresso lezzetleri.',
    address: 'Bağdat Caddesi No: 142, Kadıköy, İstanbul',
    phone: '+90 (216) 455 12 34',
    email: 'info@bellaitalia.com',
    currencySymbol: '₺',
    workingHours: [
      { day: 'Pazartesi - Cuma', open: '09:00', close: '23:00', isOpen: true },
      { day: 'Cumartesi - Pazar', open: '10:00', close: '00:00', isOpen: true },
    ],
  },
  theme: {
    _id: 'theme1',
    name: 'Minimal',
    slug: 'minimal',
    colors: {
      light: {
        primary: '#1F4E79',
        secondary: '#F97316',
        accent: '#0284C7',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        border: '#E2E8F0',
      },
      dark: {
        primary: '#38BDF8',
        secondary: '#FB923C',
        accent: '#0EA5E9',
        background: '#0B0F19',
        surface: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#334155',
      },
    },
  },
  categories: [
    {
      _id: 'c1',
      name: 'Taş Fırın Pizzalar',
      products: [
        {
          _id: 'p1',
          name: 'Pizza Margherita',
          description: 'San Marzano domates sosu, taze manda mozzarella, sızma zeytinyağı ve taze fesleğen yaprakları.',
          price: 240,
          inStock: true,
          isVegetarian: true,
          calories: '780 kcal',
          preparationTime: '15 dk',
          allergens: ['gluten', 'dairy'],
        },
        {
          _id: 'p2',
          name: 'Pizza Diavola',
          description: 'Acılı İtalyan sucuğu (Spianata Piccante), mozzarella, acı biber yağı ve kekik.',
          price: 285,
          inStock: true,
          isSpicy: true,
          calories: '890 kcal',
          preparationTime: '15 dk',
          allergens: ['gluten', 'dairy'],
        },
        {
          _id: 'p3',
          name: 'Quattro Formaggi',
          description: 'Gorgonzola, parmesan dilimleri, taze mozzarella ve ricotta peyniri karışımı.',
          price: 295,
          inStock: true,
          isVegetarian: true,
          calories: '920 kcal',
          preparationTime: '18 dk',
          allergens: ['gluten', 'dairy'],
        },
      ],
    },
    {
      _id: 'c2',
      name: 'El Açması Makarnalar',
      products: [
        {
          _id: 'p4',
          name: 'Tagliatelle al Tartufo',
          description: 'Trüf mantarı ezmesi, tereyağı sosu, parmesan rendesi ve taze çekilmiş karabiber.',
          price: 320,
          inStock: true,
          isVegetarian: true,
          calories: '650 kcal',
          preparationTime: '20 dk',
          allergens: ['gluten', 'dairy'],
        },
        {
          _id: 'p5',
          name: 'Spaghetti Alla Carbonara',
          description: 'Geleneksel dana yanağı (guanciale), taze yumurta sarısı, pecorino romano peyniri.',
          price: 275,
          inStock: true,
          calories: '710 kcal',
          preparationTime: '18 dk',
          allergens: ['gluten', 'dairy', 'eggs'],
        },
      ],
    },
    {
      _id: 'c3',
      name: 'Tatlılar & Kahveler',
      products: [
        {
          _id: 'p6',
          name: 'Tiramisu Classico',
          description: 'Savoiardi bisküvi, sert espresso, mascarpone kreması ve kakao tozu.',
          price: 160,
          inStock: true,
          calories: '420 kcal',
          allergens: ['gluten', 'dairy', 'eggs'],
        },
        {
          _id: 'p7',
          name: 'Espresso Doppio',
          description: 'Özel harman %100 Arabica çekirdeklerinden çift shot espresso.',
          price: 75,
          inStock: true,
          calories: '5 kcal',
        },
      ],
    },
  ],
};

export default function CustomerMenuPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`http://localhost:3001/api/menu/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.business) {
            setMenuData(json.data);
            if (json.data.categories?.length > 0) {
              setActiveCategory(json.data.categories[0]._id);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('API error, falling back to demo data:', err);
      }

      // Fallback
      setMenuData(DEMO_MENU);
      if (DEMO_MENU.categories.length > 0) {
        setActiveCategory(DEMO_MENU.categories[0]._id);
      }
      setLoading(false);
    }

    if (slug) {
      fetchMenu().finally(() => setLoading(false));
    }
  }, [slug]);

  const colors = useMemo(() => {
    if (!menuData?.theme?.colors) {
      return {
        bg: isDarkMode ? '#0F172A' : '#F8FAFC',
        surface: isDarkMode ? '#1E293B' : '#FFFFFF',
        text: isDarkMode ? '#F8FAFC' : '#0F172A',
        textSec: isDarkMode ? '#94A3B8' : '#64748B',
        primary: '#1F4E79',
        accent: '#F97316',
        border: isDarkMode ? '#334155' : '#E2E8F0',
      };
    }
    const palette = isDarkMode ? menuData.theme.colors.dark : menuData.theme.colors.light;
    return {
      bg: palette.background,
      surface: palette.surface,
      text: palette.text,
      textSec: palette.textSecondary,
      primary: palette.primary,
      accent: palette.accent || palette.secondary,
      border: palette.border,
    };
  }, [menuData, isDarkMode]);

  // Filtered products
  const displayedCategories = useMemo(() => {
    if (!menuData) return [];
    if (!searchQuery.trim()) return menuData.categories;

    const q = searchQuery.toLowerCase();
    return menuData.categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)),
        ),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [menuData, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1F4E79] border-t-[#F97316] rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Menü Bulunamadı</h2>
          <p className="text-sm text-slate-500 mt-1">İşletme henüz menüsünü yayına almamış olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Top Banner / Restaurant Header */}
      <div
        className="relative shadow-md overflow-hidden"
        style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="max-w-md mx-auto p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Açık
              </span>
              <h1 className="text-2xl font-black tracking-tight" style={{ color: colors.text }}>
                {menuData.business.name}
              </h1>
              {menuData.business.description && (
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: colors.textSec }}>
                  {menuData.business.description}
                </p>
              )}
            </div>

            {/* Dark mode switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border transition shadow-sm"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.textSec,
              }}
              aria-label="Tema Değiştir"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick info tags */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t text-xs" style={{ borderColor: colors.border }}>
            {menuData.business.phone && (
              <a
                href={`tel:${menuData.business.phone}`}
                className="flex items-center gap-1.5 font-medium hover:underline"
                style={{ color: colors.textSec }}
              >
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                {menuData.business.phone}
              </a>
            )}
            {menuData.business.address && (
              <span className="flex items-center gap-1.5 font-medium truncate" style={{ color: colors.textSec }}>
                <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">{menuData.business.address}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Search & Category Navigation */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md shadow-sm border-b"
        style={{
          backgroundColor: isDarkMode ? `${colors.surface}E6` : `${colors.surface}F2`,
          borderColor: colors.border,
        }}
      >
        <div className="max-w-md mx-auto px-4 py-2.5 space-y-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Menüde ara (pizza, tiramisu, kahve...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </div>

          {/* Categories Tab Bar */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {menuData.categories.map((cat) => {
                const isActive = activeCategory === cat._id;
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setActiveCategory(cat._id);
                      const el = document.getElementById(`cat-${cat._id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0"
                    style={{
                      backgroundColor: isActive ? colors.accent : colors.bg,
                      color: isActive ? '#FFFFFF' : colors.textSec,
                      border: `1px solid ${isActive ? colors.accent : colors.border}`,
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Menu Products List */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-24">
        {displayedCategories.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-semibold" style={{ color: colors.textSec }}>
              Aramanıza uygun ürün bulunamadı.
            </p>
          </div>
        ) : (
          displayedCategories.map((category) => (
            <section key={category._id} id={`cat-${category._id}`} className="space-y-3">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2" style={{ color: colors.text }}>
                <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                {category.name}
              </h2>

              <div className="space-y-3">
                {category.products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProduct(product)}
                    className="p-3.5 rounded-2xl border transition shadow-sm hover:shadow-md cursor-pointer flex gap-3.5 items-center justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="space-y-1.5 flex-1 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-sm" style={{ color: colors.text }}>
                          {product.name}
                        </h3>
                        {product.isSpicy && (
                          <span className="p-0.5 rounded bg-red-100 text-red-600" title="Acılı">
                            <Flame className="w-3 h-3" />
                          </span>
                        )}
                        {product.isVegetarian && (
                          <span className="p-0.5 rounded bg-emerald-100 text-emerald-600" title="Vejetaryen">
                            <Leaf className="w-3 h-3" />
                          </span>
                        )}
                        {product.isGlutenFree && (
                          <span className="p-0.5 rounded bg-amber-100 text-amber-600" title="Glutensiz">
                            <Wheat className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: colors.textSec }}>
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-sm font-black" style={{ color: colors.primary }}>
                          {product.price} {menuData.business.currencySymbol || '₺'}
                        </span>
                        {product.calories && (
                          <span className="text-[11px] font-medium" style={{ color: colors.textSec }}>
                            • {product.calories}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Thumbnail / Icon */}
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xl border overflow-hidden"
                      style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Sparkles className="w-5 h-5 text-orange-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom"
            style={{ backgroundColor: colors.surface, color: colors.text }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black">{selectedProduct.name}</h3>
                <span className="text-base font-extrabold" style={{ color: colors.primary }}>
                  {selectedProduct.price} {menuData.business.currencySymbol || '₺'}
                </span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            {selectedProduct.description && (
              <p className="text-sm leading-relaxed" style={{ color: colors.textSec }}>
                {selectedProduct.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedProduct.calories && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800">
                  Kalori: {selectedProduct.calories}
                </span>
              )}
              {selectedProduct.preparationTime && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedProduct.preparationTime}
                </span>
              )}
              {selectedProduct.isVegetarian && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Vejetaryen
                </span>
              )}
              {selectedProduct.isSpicy && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  Acılı
                </span>
              )}
            </div>

            {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Info className="w-3.5 h-3.5" /> Alerjen Uyarısı:
                </span>
                {selectedProduct.allergens.join(', ')} içerir.
              </div>
            )}

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-3 rounded-xl font-bold text-white shadow-md transition"
              style={{ backgroundColor: colors.accent }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
