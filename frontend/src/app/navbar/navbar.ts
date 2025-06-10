import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  router = inject(Router);
  appTitle = 'StreetCats';
  
  navLinks = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/cats', label: 'Gatti', icon: 'pets' },
    { path: '/about', label: 'Chi siamo', icon: 'info' },
    { path: '/contact', label: 'Contatti', icon: 'mail' }
  ];
  
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
