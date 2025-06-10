import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, MatSliderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'streetCat';
}
