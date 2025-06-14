import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../_services/auth/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule, RouterLink, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  router = inject(Router);
  authService = inject(AuthService);
  appTitle = 'StreetCats';
  
  navLinks = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/cats', label: 'Gatti', icon: 'pets' },
    { path: '/about', label: 'Chi siamo', icon: 'info' },
    { path: '/contact', label: 'Contatti', icon: 'mail' }
  ];

  logout() {
    this.authService.logout();
  }

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
