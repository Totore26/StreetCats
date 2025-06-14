import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { Geolocalization } from '../../_services/geolocalization/geolocalization-service';
import { CatSightingItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { ToastrService } from 'ngx-toastr';
import * as L from 'leaflet';

@Component({
  selector: 'app-cat-sightings',
  imports: [MatTabsModule, CommonModule],
  templateUrl: './cat-sightings.html',
  styleUrl: './cat-sightings.scss'
})
export class CatSightings {
viewDetails(sightings: CatSightingItem) {
throw new Error('Method not implemented.');
}
  
  router = inject(Router);
  geoLoc = inject(Geolocalization)
  restBackendService = inject(RestBackendService);
  toastr = inject(ToastrService);

  catSightings: CatSightingItem[] = []; // Array per memorizzare gli avvistamenti dei gatti
  lat: number = 45.4642; // Milano latitudine
  lon: number = 9.1900; // Milano longitudine
  map: any;

  ngAfterViewInit() {
    this.fetchData();
    this.initMap();
    this.setUserPosition();
  }

  fetchData() {
    this.restBackendService.getCatSightings().subscribe({
      next: (data) => { 
        this.catSightings = data; 
        if (data.length === 0)
          this.toastr.info("Nessun avvistamento trovato", "Info:", { progressBar: true });
      },
      error: (err) => { console.error('Errore nel recupero degli avvistamenti dei gatti:', err); }, 
      complete: () => { console.log('Recupero avvistamenti gatti completato'); }
    });
  }

  // Inizializza la mappa con Leaflet
  initMap() {
    this.map = L.map('map').setView([this.lat, this.lon], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
        minZoom: 3,
    }).addTo(this.map);

  } 

  // per richiedere e applicare la geolocalizzazione
  setUserPosition() {
    let position = this.geoLoc.getUserPosition()
      .then(pos => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;
        
        this.map.setView([this.lat, this.lon], 15); // imposto le coordinate
        this.map.invalidateSize(); // aggiorna la posizione della mappa
        L.marker([this.lat, this.lon]).addTo(this.map).bindPopup('La tua posizione!') // aggiungo il marker
      })
      .catch(error => { console.error('Errore nella geolocalizzazione:', error); });
  }

}


