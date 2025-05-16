import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  ngOnInit() {}

  getPublicKey() {
    return this.http.post<any>(`${this.apiUrl}/getPublicKey`, {});
  }

  login(email: string, password: string) {
    var encrypt$ = new JSEncrypt();
    const publicKey = sessionStorage.getItem('publicKey');
    if (publicKey) {
      encrypt$.setPublicKey(publicKey);
    } else {
      throw new Error('Public key not found in sessionStorage.');
    }
    const encryptedPassword = encrypt$.encrypt(password);
    
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, encryptedPassword })
      .pipe(
        tap((response) => {
          // console.log('Login response:', JSON.stringify(response.token));
          localStorage.setItem('currentUser', JSON.stringify(response.token));
          this.currentUserSubject.next(response);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  get token() {
    return this.currentUserValue?.token;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
