import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CatSightingItem, CommentItem } from '../../_services/backend/rest-backend-models';
import { RestBackendService } from '../../_services/backend/rest-backend-service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.scss'
})
export class Comments {
  @Input() catSighting?: CatSightingItem;
  @Input() showAllComments = false;
  @Input() maxCommentsToShow = 2;
  
  @Output() showAllCommentsClicked = new EventEmitter<void>();
  @Output() commentAdded = new EventEmitter<CommentItem>();
  
  commentForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private restBackendService: RestBackendService,
    private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    });
  }
  
  get comments(): CommentItem[] {
    return this.catSighting?.Comments || [];
  }
  
  get displayedComments(): CommentItem[] {
    if (this.showAllComments) {
      return this.comments;
    } else {
      return this.comments.slice(0, this.maxCommentsToShow);
    }
  }
  
  formatDateItalian(dateString: string | Date | undefined): string {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome'
    };
    
    return new Intl.DateTimeFormat('it-IT', options).format(date);
  }
  
  onSubmitComment(): void {
    if (this.commentForm.valid && this.catSighting?.id) {
      const content = this.commentForm.value.text;
      
      this.restBackendService.postComment(this.catSighting.id, content).subscribe({
        next: (newComment) => {
          const commentItem = newComment as CommentItem;
          
          // Emetti l'evento per notificare il componente padre
          this.commentAdded.emit(commentItem);
          
          // Reset form
          this.commentForm.reset();
          
          this.toastr.success("Commento aggiunto con successo", "Successo:", { progressBar: true });
        },
        error: (err) => {
          console.error('Errore durante l\'aggiunta del commento:', err);
          this.toastr.error("Si è verificato un errore durante l'aggiunta del commento", "Errore:");
        }
      });
    }
  }
  
  onShowAllComments(): void {
    this.showAllCommentsClicked.emit();
  }
}
