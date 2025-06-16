import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CatSightingItem, CommentItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { ToastrService } from 'ngx-toastr';
import { Comments } from '../commentsComponent/comments';

@Component({
  selector: 'app-cat-details',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    Comments
  ],
  templateUrl: './cat-details.html',
  styleUrl: './cat-details.scss'
})
export class CatDetails implements OnInit {
  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  @Input() currentSighting: CatSightingItem = {
    title: '',
    description: '',
    latitude: 0,
    longitude: 0
  };

  sightingId: string | null = null;
  showAllComments = false;

  constructor() {}
  
  ngOnInit(): void {
    // Verifica se c'è un ID nei parametri del percorso
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.sightingId = paramId;
        this.fetchData();
        return;
      }
      
      // Se non presente nei parametri del percorso, cerca nei query parameters
      this.route.queryParamMap.subscribe(queryParams => {
        const queryId = queryParams.get('id');
        if (queryId) {
          this.sightingId = queryId;
          this.fetchData();
          return;
        }
        
        this.toastr.error("ID avvistamento non trovato", "Errore:");
      });
    });
  }

  fetchData() {
    if (!this.sightingId) return;
    
    this.restBackendService.getCatSightingDetails(Number(this.sightingId)).subscribe({
      next: (data) => { 
        if (data) {
          this.currentSighting = data;
          
          // Assicuriamo che ci sia sempre un array Comments anche se non è presente nella risposta
          if (!this.currentSighting.Comments) {
            this.currentSighting.Comments = [];
          }
        } else {
          this.toastr.info("Nessun avvistamento trovato", "Info:", { progressBar: true });
        }
      },
      error: (err) => { 
        console.error('Errore nel recupero dei dettagli dell\'avvistamento:', err);
        this.toastr.error("Si è verificato un errore durante il caricamento dei dati", "Errore:");
      }
    });
  }

  formatDateItalian(dateString: string | Date | undefined): string {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome'
    };
    
    return new Intl.DateTimeFormat('it-IT', options).format(date);
  }

  onCommentAdded(newComment: CommentItem): void {
    if (!this.currentSighting.Comments) {
      this.currentSighting.Comments = [];
    }
    this.currentSighting.Comments.unshift(newComment);
  }
  
  onShowAllComments(): void {
    this.showAllComments = true;
  }
  
  // Nuova funzione per navigare alla mappa e visualizzare la posizione
  goToMapLocation() {
    if (this.currentSighting && this.currentSighting.latitude && this.currentSighting.longitude) {
      this.router.navigate(['/cat-sightings'], { 
        queryParams: { 
          showOnMap: 'true',
          lat: this.currentSighting.latitude, 
          lng: this.currentSighting.longitude 
        }
      });
    } else {
      this.toastr.error("Coordinate non disponibili per questo avvistamento", "Errore:");
    }
  }
}
