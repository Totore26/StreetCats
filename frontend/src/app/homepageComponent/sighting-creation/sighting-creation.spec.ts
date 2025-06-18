import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SightingCreation } from './sighting-creation';
import { MarkdownService } from '../../_services/markdown/markdown-service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../../_services/backend/rest-backend-service';
import { Router } from '@angular/router';

describe('SightingCreation', () => {
  let component: SightingCreation;
  let fixture: ComponentFixture<SightingCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingCreation],
      providers: [
        { 
          provide: MarkdownService, 
          useValue: { convertToHtml: (text: string) => Promise.resolve(`<p>${text}</p>`) } 
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }
        },
        {
          provide: ToastrService,
          useValue: { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') }
        },
        {
          provide: RestBackendService,
          useValue: { postCatSighting: () => of({}) }
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process line breaks correctly in markdown preview', async () => {
    const mockMarkdownService = TestBed.inject(MarkdownService);
    spyOn(mockMarkdownService, 'convertToHtml').and.callThrough();
    
    // Testo con ritorno a capo singolo
    await component.updateMarkdownPreview('Riga 1\nRiga 2');
    
    // Verifica che il servizio markdown sia stato chiamato con il testo pre-processato
    expect(mockMarkdownService.convertToHtml).toHaveBeenCalledWith('Riga 1  \nRiga 2');
  });
});
