import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// interface Book {
//   id: number;
//   title: string;
//   author: string;
  
// }

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient, private authService:AuthService) {}
  searchBooksByTitle(title: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('title', title);

    return this.http.get<any>(`${this.apiUrl}/search`, { headers, params });
  }

  getBooks(page: number): Observable<any> {
    const token = this.authService.getToken(); // Assuming authService.getToken() retrieves the JWT token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { page: page.toString() };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
  addBook(book: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post<any>(this.apiUrl, book, { headers });
  }

  deleteBook(bookId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.delete<any>(`${this.apiUrl}/${bookId}`, { headers });
  }
  updateBook(book: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.put<any>(`${this.apiUrl}/${book._id}`, book, { headers });
  }
  }

