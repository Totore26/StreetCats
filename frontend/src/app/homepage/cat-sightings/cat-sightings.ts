import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Geolocalization } from '../../_services/geolocalization/geolocalization-service';
import { CatSightingItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet';
import { catIcon, userIcon, addIcon } from './markerIcon';

@Component({
  selector: 'app-cat-sightings',
  imports: [MatTabsModule, CommonModule, MatPaginatorModule, RouterLink],
  templateUrl: './cat-sightings.html',
  styleUrl: './cat-sightings.scss'
})
export class CatSightings {
  
  router = inject(Router);
  geoLoc = inject(Geolocalization)
  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);

  catSightings: CatSightingItem[] = []; // Array per memorizzare gli avvistamenti dei gatti
  displayedSightings: CatSightingItem[] = []; // Array per memorizzare gli avvistamenti visualizzati nella pagina corrente
  lat: number = 45.4642; // Milano latitudine
  lon: number = 9.1900; // Milano longitudine
  map: any;
  tempMarker: L.Marker | null = null;

  // Proprietà per la paginazione
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  ngAfterViewInit() {
    this.fetchData();
    this.initMap();
    this.setUserPosition();
  }

  /*---------------------------------------------*
  * FUNZIONI PER LA GESTIONE DEI DATI
  *----------------------------------------------*/

  fetchData() {
    this.restBackendService.getCatSightings().subscribe({
      next: (data) => { 
        this.catSightings = data; 
        this.setMarkersOnMap();
        this.updateDisplayedSightings();
        if (data.length === 0)
          this.toastr.info("Nessun avvistamento trovato", "Info:", { progressBar: true });
      },
      error: (err) => { console.error('Errore nel recupero degli avvistamenti dei gatti:', err); }, 
      complete: () => { console.log('Recupero avvistamenti gatti completato'); }
    });
  }

  /*---------------------------------------------*
  * FUNZIONI PER LA GESTIONE DELLA PAGINAZIONE
  *----------------------------------------------*/

  // Metodo per gestire il cambio pagina
  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedSightings();
  }

  // Aggiorna gli avvistamenti visualizzati in base alle impostazioni di paginazione
  updateDisplayedSightings() {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedSightings = this.catSightings.slice(startIndex, startIndex + this.pageSize);
  }

  /*---------------------------------------------*
  * FUNZIONI PER LA GESTIONE DELLA  MAPPA
  *----------------------------------------------*/

  // Inizializza la mappa con Leaflet
  initMap() {
    this.map = L.map('map').setView([this.lat, this.lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
        minZoom: 3,
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => { this.handleMapClick(e);}); //listener per il click sulla mappa

  } 

  // per richiedere e applicare la geolocalizzazione
  setUserPosition() {
    let position = this.geoLoc.getUserPosition()
      .then(pos => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;
        
        this.map.setView([this.lat, this.lon], 15); // imposto le coordinate
        this.map.invalidateSize(); // aggiorna la posizione della mappa
        L.marker([this.lat, this.lon], { icon: userIcon } ).addTo(this.map).bindPopup('La tua posizione!') // aggiungo il marker
      })
      .catch(error => { console.error('Errore nella geolocalizzazione:', error); });
  }

  // marker per ogni avvistamento scaricato
  setMarkersOnMap() {
    
    this.catSightings.forEach(sighting => {
        const popupContent = `
          <b>${sighting.title}</b><br>
          Segnalato da: ${sighting.UserUsername}<br>
          <div style="text-align: center; margin-top: 8px;">
            <button class="details-btn" data-sighting-id="${sighting.id}" style="background-color: #f97316; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;">Vedi dettagli</button>
          </div>`;

        const marker = L.marker([sighting.latitude, sighting.longitude], { icon: catIcon })
          .addTo(this.map)
          .bindPopup(popupContent);
          
        // event listener quando il popup viene aperto
        marker.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.querySelector(`.details-btn[data-sighting-id="${sighting.id}"]`);
            console.log("Button found:", btn);
            if (btn) {
              btn.addEventListener('click', () => { 
                // Sintassi corretta per navigare con queryParams
                this.router.navigate(['/catDetails'], { queryParams: { id: sighting.id } });
              });
            }
          }, 50); // Piccolo ritardo per assicurarsi che il DOM sia aggiornato
        });
      });
  }

  handleMapClick(e: L.LeafletMouseEvent) {
    // Se esiste già un marker temporaneo, lo rimuovo
      if (this.tempMarker) {
        this.map.removeLayer(this.tempMarker);
        this.tempMarker = null;
        return;
      }
      
      // nuovo marker temporaneo
      this.tempMarker = L.marker(e.latlng, { icon: addIcon }).addTo(this.map);
      
      // popup informativo con bottone
      const popupContent = `
        <div style="text-align: center; margin: 5px;">
          <button class="add-sighting-btn" style="background-color: #f97316; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">aggiungi un nuovo<br>avvistamento qui</button>
        </div>`;
        
      this.tempMarker.bindPopup(popupContent)
        .openPopup();
                    
      // event listener per il click sul bottone nel popup
      this.tempMarker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.querySelector('.add-sighting-btn');
          console.log("Add button found:", btn);
          if (btn) {
            btn.addEventListener('click', () => { 
              this.router.navigate(
                ['/sightingCreation'], 
                { queryParams: { lat: e.latlng.lat, lng: e.latlng.lng }}
              );
            });
          }
        }, 50);
      });
  }
}



