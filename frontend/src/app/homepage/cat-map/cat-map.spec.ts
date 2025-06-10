import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatMap } from './cat-map';

describe('CatMap', () => {
  let component: CatMap;
  let fixture: ComponentFixture<CatMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
