import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sighting-creation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sighting-creation.html',
  styleUrl: './sighting-creation.scss',
  standalone: true
})
export class SightingCreation implements OnInit {
  sightingForm: FormGroup;
  lat: string | null = null;
  lng: string | null = null;
  previewImage: string | ArrayBuffer | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.sightingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      photo: [null, Validators.required]
    });
  }
  
  ngOnInit() {
    // Recupera le coordinate dai query params
    this.route.queryParams.subscribe(params => {
      this.lat = params['lat'];
      this.lng = params['lng'];
    });
  }
  
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    
    if (file) {
      this.sightingForm.patchValue({
        photo: file
      });
      
      // Mostra l'anteprima dell'immagine
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  onSubmit() {
    if (this.sightingForm.valid && this.lat && this.lng) {
      const formData = {
        ...this.sightingForm.value,
        lat: this.lat,
        lng: this.lng
      };
      
      console.log('Form submitted:', formData);
      // Qui andrà la logica per inviare i dati al backend
    }
  }
}
