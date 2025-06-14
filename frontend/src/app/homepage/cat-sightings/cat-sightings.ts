import { Component, inject } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { Geolocalization } from '../../_services/geolocalization/geolocalization-service';
import * as L from 'leaflet';


@Component({
  selector: 'app-cat-sightings',
  imports: [MatTabsModule],
  templateUrl: './cat-sightings.html',
  styleUrl: './cat-sightings.scss'
})
export class CatSightings {
  
  GeoLoc = inject(Geolocalization)
  
  // Variabili per la mappa e i marker
  lat: number = 45.4642; // Milano latitudine
  lon: number = 9.1900; // Milano longitudine
  map: any;

  ngAfterViewInit() {
    this.initMap();
    this.setUserPosition();
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
    let position = this.GeoLoc.getUserPosition()
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


