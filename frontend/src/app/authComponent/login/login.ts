import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  
  submittedFlag = false;

  // Definizione del form con Reactive Forms
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)
    ])
  });

  // Metodo per gestire il login
  doLogin() {
    console.log('Form values:', this.loginForm.value);
    console.log('Form valid:', this.loginForm.valid);

    this.submittedFlag = true;

    // Se il form non è valido, mostra un errore
    if (this.loginForm.invalid) {
      this.toastr.error("completa i campi obbligatori e verifica che siano validi", "Attenzione", { progressBar: true });
      return;
    }

    // Chiamata al servizio REST per il login
    this.restService.login({
      usr: this.loginForm.value.user as string,
      pwd: this.loginForm.value.password as string,
    }).subscribe({
      next: (token) => {
        this.authService.updateToken(token); // Aggiorna il token di autenticazione
      },
      error: (err) => {
        this.toastr.error("Per favore, inserisci un nome utente e una password validi", "Oops! Credenziali non valide");
      },
      complete: () => {
        this.toastr.success(`Ora puoi segnalare nuovi avvistamenti e commentare!`, `Benvenuto ${this.loginForm.value.user}!`, { progressBar: true });
        this.router.navigateByUrl("/"); 
      }
    });
  }

}
