import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';

@Component({
  selector: 'app-sighting-creation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sighting-creation.html',
  styleUrl: './sighting-creation.scss',
  standalone: true,
})
export class SightingCreation {
  sightingForm: FormGroup;
  lat: string | null = null;
  lng: string | null = null;
  previewImage: string | ArrayBuffer | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restService: RestBackendService,
    private toastr: ToastrService
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
      const sightingData = {
        title: this.sightingForm.value.title,
        description: this.sightingForm.value.description,
        photo: this.sightingForm.value.photo,
        latitude: parseFloat(this.lat),
        longitude: parseFloat(this.lng)
      };
      
      this.restService.postCatSighting(sightingData).subscribe({
        next: () => {
          this.toastr.success('Avvistamento registrato con successo!', 'Successo');
          this.router.navigate(['/homepage']); // Naviga verso la homepage
        },
        error: (err) => {
          this.toastr.error(err.message || 'Errore durante la registrazione dell\'avvistamento', 'Errore');
        }
      });
    }
  }
}
