import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { MarkdownService } from '../../_services/markdown/markdown-service';

@Component({
  selector: 'app-sighting-creation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sighting-creation.html',
  styleUrl: './sighting-creation.scss',
  standalone: true,
})
export class SightingCreation implements OnInit {
  sightingForm: FormGroup;
  lat: string | null = null;
  lng: string | null = null;
  previewImage: string | ArrayBuffer | null = null;
  markdownPreview: string = '';
  showMarkdownPreview: boolean = false;
  
  // proprietà per controllare la dimensione dell'immagine
  isFileTooLarge: boolean = false;
  readonly MAX_FILE_SIZE_MB: number = 10; // Dimensione massima in MB
  readonly MAX_FILE_SIZE_BYTES: number = 10 * 1024 * 1024; // Conversione in bytes
  
  // Proprietà per il controllo dell'immagine
  imageScale: number = 1;
  imageX: number = 0;
  imageY: number = 0;
  isDragging: boolean = false;
  lastPointerX: number = 0;
  lastPointerY: number = 0;
  
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
      photo: [null]
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
  
  /**
   * Gestisce il caricamento dell'immagine e mostra l'anteprima
   */
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    
    // Controllo sulla dimensione del file
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      this.isFileTooLarge = true;
      this.previewImage = null;
      this.sightingForm.get('photo')?.setValue(null);
      return;
    }
    
    this.isFileTooLarge = false;
    this.sightingForm.get('photo')?.setValue(file);
    
    // Creazione anteprima
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
  
  /**
   * Rimuove l'immagine caricata
   */
  removeImage() {
    this.previewImage = null;
    this.sightingForm.get('photo')?.setValue(null);
    
    // Reset anche dell'input file (opzionale)
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  async onSubmit() {
    if (this.sightingForm.valid && this.lat && this.lng) {
      // Converto la descrizione da markdown a HTML sanitizzato
      const markdownText = this.sightingForm.value.description;
      const processedText = markdownText.replace(/(?<!\n)\n(?!\n)/g, "  \n");
      const htmlDescription = await this.markdownService.convertToHtml(processedText);
      
      // Creo un FormData per l'invio dei dati multipart con il file
      const formData = new FormData();
      formData.append('title', this.sightingForm.value.title);
      formData.append('description', htmlDescription);
      formData.append('latitude', this.lat);
      formData.append('longitude', this.lng);
      
      // Aggiungo il file se presente
      if (this.sightingForm.value.photo) {
        formData.append('image', this.sightingForm.value.photo);
      }
      
      this.restService.postCatSighting(formData).subscribe({
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

  /*-----------------------------------------*
  * FUNZIONI PER LA GESTIONE DEL MARKDOWN 
  *------------------------------------------*/

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


}
