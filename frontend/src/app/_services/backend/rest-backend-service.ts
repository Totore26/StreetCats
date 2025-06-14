import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { CatSightingItem } from './rest-backend-models';
import { AuthRequest } from './rest-backend-models';

@Injectable({
  providedIn: 'root'
})

export class RestBackendService {

  url = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest){
    const url = `${this.url}/login`; 
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: AuthRequest){
    const url = `${this.url}/signup`; 
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  // Avvistamenti gatti

  getCatSightings() {
    const url = `${this.url}/catsightings`;
    return this.http.get<CatSightingItem[]>(url, this.httpOptions);
  }

  getCatSightingDetails(id: number) {
    const url = `${this.url}/catsightings/${id}`;
    return this.http.get<CatSightingItem>(url, this.httpOptions);
  }

  postCatSighting(catSighting: CatSightingItem) {
    const url = `${this.url}/catsightings`;
    return this.http.post<CatSightingItem>(url, catSighting, this.httpOptions);
  }

  // Commenti
  postComment(id: number, content: string) {
    const url = `${this.url}/comments/${id}`;
    return this.http.post(url, { content }, this.httpOptions);
  }

}
