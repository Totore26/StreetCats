import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbarComponent/navbar';
import { Footer } from './footerComponent/footer';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    Navbar, 
    Footer, 
    MatSliderModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'streetCat';
}
