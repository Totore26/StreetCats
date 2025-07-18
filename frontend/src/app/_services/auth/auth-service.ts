import { Injectable, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../backend/rest-backend-service';

interface AuthState {
  user: string | null,
  token: string | null,
  isAuthenticated: boolean
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  restBackendService = inject(RestBackendService);
  
  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), // get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getToken()) // verify it's not expired
  });

  isAuthenticated$ = computed(() => this.authState().isAuthenticated);

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(private toastr: ToastrService) {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().user;
      if (typeof localStorage !== 'undefined') {
        if (token !== null) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        if (user !== null) {
          localStorage.setItem("user", user);
        } else {
          localStorage.removeItem("user");
        }
      }
    });
  }
  
  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000)
          return false; // expiration time is undefined or token is expired
        else
          return true; // valid token
      } catch (error) {  // invalid token
        return false;
      }
    } else return false;
  }

  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    });
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
  }

  getUser(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem("user") : null;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.restBackendService.logout().subscribe({
      next: () => {},
      error: (err) => {
        this.toastr.error("Si è verificato un errore durante il logout", "Errore", { progressBar: true });
      },
      complete: () => {
        this.clearAuthState();
      }
    });
  }

  clearAuthState() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    this.toastr.success("Sei stato disconnesso con successo", "Logout effettuato",{ progressBar: true });
  }
}
