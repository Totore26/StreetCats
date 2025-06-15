import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatSightingItem } from '../../_services/backend/rest-backend-models';

// Interfaccia per i commenti
interface Comment {
  id: string;
  author: string;
  text: string;
  date: Date;
}

@Component({
  selector: 'app-cat-details',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink
  ],
  templateUrl: './cat-details.html',
  styleUrl: './cat-details.scss'
})
export class CatDetails implements OnInit {

  @Input() currentSighting: CatSightingItem = {
    title: '',
    description: '',
    latitude: 0,
    longitude: 0
  };

  commentForm: FormGroup;
  
  // Array dei commenti (per esempio)
  comments: Comment[] = [];
  
  // Numero massimo di commenti da mostrare nella visualizzazione ridotta
  maxCommentsToShow = 2;

  constructor(private fb: FormBuilder, private router: Router) {
    this.commentForm = this.fb.group({
      author: ['', Validators.required],
      text: ['', Validators.required]
    });
    
    // Dati di esempio - in produzione questi verrebbero caricati da un servizio
    this.comments = [
      { id: '1', author: 'Marco Rossi', text: 'Ho visto lo stesso gatto ieri nella stessa zona!', date: new Date(2023, 6, 15) },
      { id: '2', author: 'Laura Bianchi', text: 'Questo gatto sembra essere quello che si aggira spesso vicino al parco.', date: new Date(2023, 6, 14) },
      { id: '3', author: 'Giovanni Verdi', text: 'Potrebbe essere il gatto del signor Mario, quello che abita all\'angolo.', date: new Date(2023, 6, 13) },
      { id: '4', author: 'Anna Neri', text: 'L\'ho visto mangiare vicino al ristorante in via Roma.', date: new Date(2023, 6, 12) }
    ];
  }

  ngOnInit(): void {
    // Inizializzazione del componente
  }

  onSubmitComment(): void {
    if (this.commentForm.valid) {
      // Crea un nuovo commento
      const newComment: Comment = {
        id: Date.now().toString(),
        author: this.commentForm.value.author,
        text: this.commentForm.value.text,
        date: new Date()
      };
      
      // Aggiungi il commento all'inizio dell'array
      this.comments.unshift(newComment);
      
      // Reset form
      this.commentForm.reset();
    }
  }
  
  showAllComments(): void {
    // In un'applicazione reale, questo potrebbe navigare a una vista separata
    // o espandere la vista corrente
    // Per ora, navighiamo a una pagina ipotetica di commenti
    this.router.navigate(['/cat-comments', this.currentSighting.id || 0]);
    
    // Alternativa: se vuoi solo espandere la vista corrente
    // this.maxCommentsToShow = this.comments.length;
  }
}
