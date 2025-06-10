import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDetails } from './cat-details';

describe('Details', () => {
  let component: CatDetails;
  let fixture: ComponentFixture<CatDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
