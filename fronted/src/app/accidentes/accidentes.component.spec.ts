import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentesComponent } from './accidentes.component';

describe('AccidentesComponent', () => {
  let component: AccidentesComponent;
  let fixture: ComponentFixture<AccidentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccidentesComponent]
    });
    fixture = TestBed.createComponent(AccidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
