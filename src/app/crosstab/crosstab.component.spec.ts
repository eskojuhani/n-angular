import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosstabComponent } from './crosstab.component';

describe('CrosstabComponent', () => {
  let component: CrosstabComponent;
  let fixture: ComponentFixture<CrosstabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrosstabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrosstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
