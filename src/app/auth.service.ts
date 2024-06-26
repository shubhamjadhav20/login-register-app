import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient,private router: Router, private localStorageService:LocalStorageService) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  getBooks(page: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/books?page=${page}`, { headers });
  }
  

  signup(email: string, password: string, role:string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { email, password,role });
  }
  getToken(): string | null {
    return this.localStorageService.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token ? token : '');
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = atob(token.split('.')[1]);
      const parsedPayload = JSON.parse(payload);
      return parsedPayload.role;
    }
    return null;
  }
}
