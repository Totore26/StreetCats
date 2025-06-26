import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Geolocalization {

  constructor() { }

  getUserPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {

      if (!navigator.geolocation)
        reject(new Error('Geolocalizzazione non supportata dal browser'));

      // utilizzo l'API del browser per ottenere la posizione
      navigator.geolocation.getCurrentPosition( 
        position => { resolve(position); },
        error => { reject(error); },
        {
          enableHighAccuracy: true, // Per una maggiore precisione
          timeout: 10000,            // Timeout dopo 10 secondi
          maximumAge: 0             // Non uso posizioni in cache
        }
      );
    });
  }

}
