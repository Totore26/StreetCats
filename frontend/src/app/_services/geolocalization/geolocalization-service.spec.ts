import { TestBed } from '@angular/core/testing';

import { Geolocalization } from './geolocalization-service';

describe('Geolocalization', () => {
  let service: Geolocalization;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geolocalization);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
