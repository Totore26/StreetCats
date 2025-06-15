import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  standalone: true
})
export class Signup {
  toastr = inject(ToastrService);  
  router = inject(Router);  
  restService = inject(RestBackendService);
  
  submittedFlag = false;

  // Definizione del form con Reactive Forms
  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required]),  // Campo per l'utente con validazione
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(4),  
      Validators.maxLength(16)  
    ]),
    terms: new FormControl(false, [Validators.requiredTrue]) // Aggiungiamo il controllo per i termini
  });

  // Metodo che gestisce la registrazione
  doSignUp() {
    this.submittedFlag = true;  // Imposta il form come inviato

    // Se il form non è valido, mostra un errore
    if (this.signupForm.invalid) {
      this.toastr.error("I dati forniti non sono validi!", "Errore nei dati!");
      return;
    }

    // Chiamata al servizio REST per la registrazione
    this.restService.signup({
      usr: this.signupForm.value.user as string,  
      pwd: this.signupForm.value.password as string
    }).subscribe({
      error: (err) => {
        console.error('Errore di registrazione:', err);
        this.toastr.error("Il nome utente scelto è già stato utilizzato", "Errore nella creazione dell'account");
      },
      complete: () => {
        this.router.navigateByUrl("/login");  // Reindirizza alla pagina di login
        this.toastr.success(`Registrazione completata. Sei stato reindirizzato alla pagina di login`, `Complimenti ${this.signupForm.value.user}!`, { progressBar: true });
      }
    });
  }
}
