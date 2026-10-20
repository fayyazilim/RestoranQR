import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';

  currentUser = signal<User | null>(null);
  accessToken = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.accessToken());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('current_user');
    if (token) {
      this.accessToken.set(token);
    }
    if (userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch {}
    }
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        if (res.data?.accessToken) {
          this.setSession(res.data.accessToken, res.data.user);
        }
      }),
    );
  }

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        if (res.data?.accessToken) {
          this.setSession(res.data.accessToken, res.data.user);
        }
      }),
    );
  }

  getMe() {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
          localStorage.setItem('current_user', JSON.stringify(res.data));
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(token: string, user: User) {
    this.accessToken.set(token);
    this.currentUser.set(user);
    localStorage.setItem('access_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }
}
