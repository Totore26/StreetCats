import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { MarkdownService } from '../../_services/markdown/markdown-service';
import DOMPurify from 'dompurify';

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
  markdownPreview: string = '';
  showMarkdownPreview: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restService: RestBackendService,
    private toastr: ToastrService,
    private markdownService: MarkdownService
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

    // Monitora i cambiamenti nella descrizione per aggiornare l'anteprima
    this.sightingForm.get('description')?.valueChanges.subscribe(value => {
      if (this.showMarkdownPreview && value) {
        this.updateMarkdownPreview(value);
      }
    });
  }
  
  async updateMarkdownPreview(text: string) {
    // Pre-processa il testo per gestire correttamente i ritorni a capo
    // Sostituisce un singolo ritorno a capo con due spazi seguiti da un ritorno a capo
    // che è la sintassi Markdown per una nuova riga
    const processedText = text.replace(/(?<!\n)\n(?!\n)/g, "  \n");
    const htmlContent = await this.markdownService.convertToHtml(processedText);
    this.markdownPreview = htmlContent;
  }
  
  toggleMarkdownPreview() {
    this.showMarkdownPreview = !this.showMarkdownPreview;
    if (this.showMarkdownPreview) {
      const description = this.sightingForm.get('description')?.value;
      if (description) {
        this.updateMarkdownPreview(description);
      }
    }
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
  
  async onSubmit() {
    if (this.sightingForm.valid && this.lat && this.lng) {
      try {
        // Converto la descrizione da markdown a HTML sanitizzato
        const markdownText = this.sightingForm.value.description;
        const processedText = markdownText.replace(/(?<!\n)\n(?!\n)/g, "  \n");
        const htmlDescription = await this.markdownService.convertToHtml(processedText);
        
        const sightingData = {
          title: this.sightingForm.value.title,
          description: htmlDescription, // Usa l'HTML sanitizzato invece del markdown
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
      } catch (error) {
        this.toastr.error('Si è verificato un errore nella conversione della descrizione', 'Errore');
      }
    }
  }
  
}
