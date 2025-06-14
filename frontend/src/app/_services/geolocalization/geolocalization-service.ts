import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Geolocalization {

  constructor() { }

  // per ottenere la posizione corrente dell'utente
  getUserPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {

      if (!navigator.geolocation)
        reject(new Error('Geolocalizzazione non supportata dal browser'));

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        },
        {
          enableHighAccuracy: true, // Per una maggiore precisione
          timeout: 5000,            // Timeout dopo 5 secondi
          maximumAge: 0             // Non usare posizioni in cache
        }
      );
    });
  }

}
