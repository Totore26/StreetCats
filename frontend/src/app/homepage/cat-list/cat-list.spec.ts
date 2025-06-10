import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatList } from './cat-list';

describe('CatList', () => {
  let component: CatList;
  let fixture: ComponentFixture<CatList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
