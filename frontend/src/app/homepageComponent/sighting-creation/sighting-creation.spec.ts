import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingCreation } from './sighting-creation';

describe('SightingCreation', () => {
  let component: SightingCreation;
  let fixture: ComponentFixture<SightingCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
