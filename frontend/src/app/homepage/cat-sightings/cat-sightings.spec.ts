import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatSightings } from './cat-sightings';

describe('CatSightings', () => {
  let component: CatSightings;
  let fixture: ComponentFixture<CatSightings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatSightings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatSightings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
