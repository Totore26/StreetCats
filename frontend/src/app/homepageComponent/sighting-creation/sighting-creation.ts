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
export class SightingCreation implements OnInit, OnDestroy {
  sightingForm: FormGroup;
  lat: string | null = null;
  lng: string | null = null;
  previewImage: string | ArrayBuffer | null = null;
  markdownPreview: string = '';
  showMarkdownPreview: boolean = false;
  
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

  /*-----------------------------------------------------*
  * FUNZIONI PER LA GESTIONE DELL'INSERIMENTO IMMAGINE 
  *------------------------------------------------------*/

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
        // Resetta posizione e zoom quando viene caricata una nuova immagine
        this.resetImagePosition();
      };
      reader.readAsDataURL(file);
    }
  }

  resetImagePosition() {
    this.imageScale = 1;
    this.imageX = 0;
    this.imageY = 0;
  }
  
  adjustZoom(amount: number) {
    this.imageScale = Math.max(1, Math.min(3, this.imageScale + amount));
  }
  
  onZoomChange(event: Event) {
    this.imageScale = parseFloat((event.target as HTMLInputElement).value);
  }
  
  startDrag(event: MouseEvent | TouchEvent, isTouch: boolean = false) {
    event.preventDefault();
    this.isDragging = true;
    
    if (isTouch && event instanceof TouchEvent) {
      this.lastPointerX = event.touches[0].clientX;
      this.lastPointerY = event.touches[0].clientY;
    } else if (event instanceof MouseEvent) {
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;
    }
    
    // Aggiungo gli event listener per il drag
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('touchmove', this.onDragTouch, { passive: false });
    document.addEventListener('touchend', this.stopDrag);
  }
  
  onDrag = (event: MouseEvent) => {
    if (!this.isDragging) return;
    
    const deltaX = (event.clientX - this.lastPointerX) / this.imageScale;
    const deltaY = (event.clientY - this.lastPointerY) / this.imageScale;
    
    this.imageX += deltaX;
    this.imageY += deltaY;
    
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }
  
  onDragTouch = (event: TouchEvent) => {
    if (!this.isDragging) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    const deltaX = (touch.clientX - this.lastPointerX) / this.imageScale;
    const deltaY = (touch.clientY - this.lastPointerY) / this.imageScale;
    
    this.imageX += deltaX;
    this.imageY += deltaY;
    
    this.lastPointerX = touch.clientX;
    this.lastPointerY = touch.clientY;
  }
  
  stopDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.onDragTouch);
    document.removeEventListener('touchend', this.stopDrag);
  }
  
  ngOnDestroy() {
    // Rimuovo gli event listener quando il componente viene distrutto
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.onDragTouch);
    document.removeEventListener('touchend', this.stopDrag);
  }


}
