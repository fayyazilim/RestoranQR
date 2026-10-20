import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Business, Category, Product, Theme } from '../models/api.models';

function extractData<T = any>(res: any): T {
  if (res && res.data !== undefined) {
    return res.data;
  }
  return res;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'http://localhost:3001/api';

  currentBusiness = signal<Business | null>(null);
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  themes = signal<Theme[]>([]);

  constructor(private http: HttpClient) {}

  // Business
  getMyBusiness(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/business/me`).pipe(
      tap((res) => {
        const data = extractData<Business>(res);
        if (data && data._id) {
          this.currentBusiness.set(data);
        }
      }),
    );
  }

  createBusiness(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/business`, data).pipe(
      tap((res) => {
        const data = extractData<Business>(res);
        if (data && data._id) {
          this.currentBusiness.set(data);
        }
      }),
    );
  }

  updateBusiness(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/business`, data).pipe(
      tap((res) => {
        const data = extractData<Business>(res);
        if (data && data._id) {
          this.currentBusiness.set(data);
        }
      }),
    );
  }

  uploadLogo(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/business/logo`, formData).pipe(
      tap((res) => {
        const data = extractData<Business>(res);
        if (data && data._id) {
          this.currentBusiness.set(data);
        }
      }),
    );
  }

  publishMenu(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/business/publish`, {}).pipe(
      tap((res) => {
        const data = extractData<Business>(res);
        if (data && data._id) {
          this.currentBusiness.set(data);
        }
      }),
    );
  }

  // Categories
  getCategories(businessId?: string): Observable<any> {
    const bId = businessId || this.currentBusiness()?._id;
    const url = bId ? `${this.apiUrl}/categories/${bId}` : `${this.apiUrl}/categories`;
    return this.http.get<any>(url).pipe(
      tap((res) => {
        const data = extractData<Category[]>(res);
        if (Array.isArray(data)) {
          this.categories.set(data);
        }
      }),
    );
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories`, data).pipe(
      tap((res) => {
        const newCat = extractData<Category>(res);
        if (newCat && newCat._id) {
          this.categories.update((prev) => [...prev, newCat]);
        }
      }),
    );
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/categories/${id}`, data).pipe(
      tap((res) => {
        const updatedCat = extractData<Category>(res);
        if (updatedCat && updatedCat._id) {
          this.categories.update((prev) =>
            prev.map((c) => (c._id === id ? { ...c, ...updatedCat } : c)),
          );
        }
      }),
    );
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${id}`).pipe(
      tap(() => {
        this.categories.update((prev) => prev.filter((c) => c._id !== id));
      }),
    );
  }

  reorderCategories(items: { id: string; order: number }[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories/reorder`, { items });
  }

  // Products
  getMyProducts(businessId?: string): Observable<any> {
    const bId = businessId || this.currentBusiness()?._id;
    const params = bId ? `?businessId=${bId}` : '';
    return this.http.get<any>(`${this.apiUrl}/products/my${params}`).pipe(
      tap((res) => {
        const data = extractData<Product[]>(res);
        if (Array.isArray(data)) {
          this.products.set(data);
        }
      }),
    );
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, formData).pipe(
      tap((res) => {
        const newProd = extractData<Product>(res);
        if (newProd && newProd._id) {
          this.products.update((prev) => [newProd, ...prev]);
        }
      }),
    );
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/products/${id}`, data).pipe(
      tap((res) => {
        const updated = extractData<Product>(res);
        if (updated && updated._id) {
          this.products.update((prev) =>
            prev.map((p) => (p._id === id ? { ...p, ...updated } : p)),
          );
        }
      }),
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => {
        this.products.update((prev) => prev.filter((p) => p._id !== id));
      }),
    );
  }

  toggleProductStock(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/products/${id}/toggle-stock`, {}).pipe(
      tap((res) => {
        const updated = extractData<Product>(res);
        if (updated && updated._id) {
          this.products.update((prev) =>
            prev.map((p) => (p._id === id ? { ...p, inStock: updated.inStock } : p)),
          );
        }
      }),
    );
  }

  // Themes
  getThemes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/themes`).pipe(
      tap((res) => {
        const data = extractData<Theme[]>(res);
        if (Array.isArray(data)) {
          this.themes.set(data);
        }
      }),
    );
  }

  // QR
  generateQr(businessId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/qr/generate/${businessId}`, {});
  }

  getQrData(businessId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/qr/data/${businessId}`);
  }

  // Admin
  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  getAdminUsers(page = 1, limit = 10, search?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/users?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get<any>(url);
  }

  getAdminBusinesses(page = 1, limit = 10, search?: string): Observable<any> {
    let url = `${this.apiUrl}/admin/businesses?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return this.http.get<any>(url);
  }
}
