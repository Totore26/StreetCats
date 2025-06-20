import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatSightingItem, CommentItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { ToastrService } from 'ngx-toastr';
import { Comments } from '../commentsComponent/comments';
import { restApiURL } from '../../_services/backend/rest-backend-service'

@Component({
  selector: 'app-cat-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,Comments],
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
    // prendo l id dall'URL
      this.route.queryParamMap.subscribe(queryParams => {
        const queryId = queryParams.get('id');
        this.sightingId = queryId;
        this.fetchData();
      });
  }

  fetchData() {
    if (!this.sightingId) return;
    
    this.restBackendService.getCatSightingDetails(Number(this.sightingId)).subscribe({
      next: (data) => {
        if (data) {
          this.currentSighting = data;
          // se non ci sono commenti, inizializzo l'array
          if (!this.currentSighting.Comments) this.currentSighting.Comments = [];
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

  getImageUrl(): string {
    return this.currentSighting.image ? `${restApiURL}${this.currentSighting.image}` : './defaultCatImage.png';
  }
}
