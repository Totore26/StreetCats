import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CatSightingItem } from './rest-backend-models';
import { AuthRequest } from './rest-backend-models';

export const restApiURL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest){
    const endpoint = `${restApiURL}/login`; 
    return this.http.post<string>(endpoint, loginRequest, this.httpOptions);
  }

  logout() {
    const endpoint = `${restApiURL}/logout`;
    return this.http.post(endpoint, {} ,this.httpOptions);
  }

  signup(signupRequest: AuthRequest){
    const endpoint = `${restApiURL}/signup`; 
    console.log(signupRequest);
    return this.http.post(endpoint, signupRequest, this.httpOptions);
  }

  // Avvistamenti gatti

  getCatSightings() {
    const endpoint = `${restApiURL}/catsightings`;
    return this.http.get<CatSightingItem[]>(endpoint, this.httpOptions);
  }

  getCatSightingDetails(id: number) {
    const endpoint = `${restApiURL}/catsightings/${id}`;
    return this.http.get<CatSightingItem>(endpoint, this.httpOptions);
  }

  postCatSighting(catSighting: FormData) {
    const endpoint = `${restApiURL}/catsightings`;
    return this.http.post<FormData>(endpoint, catSighting);
  }

  // Commenti
  postComment(id: number, content: string) {
    const endpoint = `${restApiURL}/comments/${id}`;
    return this.http.post(endpoint, { content }, this.httpOptions);
  }

}
