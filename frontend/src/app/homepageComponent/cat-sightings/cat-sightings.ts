import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Geolocalization } from '../../_services/geolocalization/geolocalization-service';
import { CatSightingItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet';
import { catIcon, userIcon, addIcon } from './markerIcon';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-cat-sightings',
  imports: [MatTabsModule, CommonModule, MatPaginatorModule, RouterLink],
  templateUrl: './cat-sightings.html',
  styleUrl: './cat-sightings.scss',
  standalone: true
})
export class CatSightings {
  
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  router = inject(Router);
  route = inject(ActivatedRoute);
  geoLoc = inject(Geolocalization)
  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);

  catSightings: CatSightingItem[] = []; // Array per memorizzare gli avvistamenti dei gatti
  displayedSightings: CatSightingItem[] = []; // Array per memorizzare gli avvistamenti visualizzati nella pagina corrente
lat: number = 40.8300; // Napoli Mergellina latitudine
lon: number = 14.2169; // Napoli Mergellina longitudine
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
    
    // Controllo se ci sono parametri di navigazione per centrare la mappa
    this.route.queryParamMap.subscribe(params => {
      if (params.get('showOnMap') === 'true' && params.get('lat') && params.get('lng')) {
        const lat = Number(params.get('lat'));
        const lng = Number(params.get('lng'));
        if (!isNaN(lat) && !isNaN(lng)) {
          // Attendiamo che la mappa sia completamente caricata
          setTimeout(() => {
            this.goToMapLocation(lat, lng);
          }, 200);
        }
      }
    });
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

  // Formatta le date nel fuso orario italiano (dd/mm/yyyy hh:mm)
  formatDateItalian(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Opzioni per formattare la data nel fuso orario italiano
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

    this.map.on('click', (e: L.LeafletMouseEvent) => { this.setCreationMarker(e);}); //listener per il click sulla mappa

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
        // Formatto la data per il popup
        const formattedDate = this.formatDateItalian(sighting.updatedAt ? sighting.updatedAt.toString() : '');
        
        const popupContent = `
          <b>${sighting.title}</b><br>
          Segnalato da: ${sighting.UserUsername}<br>
          Data: ${formattedDate}<br>
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

  setCreationMarker(e: L.LeafletMouseEvent) {
    // Se esiste già un marker temporaneo, lo rimuovo
      if (this.tempMarker) {
        this.map.removeLayer(this.tempMarker);
        this.tempMarker = null;
        return;
      }
      
      // nuovo marker temporaneo
      this.tempMarker = L.marker(e.latlng, { icon: addIcon }).addTo(this.map);
      
      // popup informativo con solo un messaggio
      const popupContent = `
        <div style="text-align: center; margin: 5px;">
          <p>Clicca su questo gattino per aggiungere<br>un nuovo avvistamento qui</p>
        </div>`;
        
      // Apro subito il popup
      this.tempMarker.bindPopup(popupContent).openPopup();
      
      // Aggiungo l'event listener direttamente sul marker
      this.tempMarker.on('click', () => { 
        this.router.navigate(
          ['/sightingCreation'], 
          { queryParams: { lat: e.latlng.lat, lng: e.latlng.lng }}
        );
      });
  }

  // Metodo per navigare alla posizione sulla mappa
  goToMapLocation(latitude: number, longitude: number) {
    // Imposta l'indice della tab della mappa (0)
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
      
      // Aggiorniamo la vista della mappa dopo che la tab è stata cambiata
      setTimeout(() => {
        if (this.map) {
          this.map.setView([latitude, longitude], 17);
          
          // Cerca e apre il popup del marker corrispondente
          this.map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker && 
                Math.abs(layer.getLatLng().lat - latitude) < 0.0001 && 
                Math.abs(layer.getLatLng().lng - longitude) < 0.0001) {
              layer.openPopup();
            }
          });
        }
      }, 100);
    }
  }

}




