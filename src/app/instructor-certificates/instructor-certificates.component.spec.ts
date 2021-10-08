import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCertificatesComponent } from './instructor-certificates.component';

describe('InstructorCertificatesComponent', () => {
  let component: InstructorCertificatesComponent;
  let fixture: ComponentFixture<InstructorCertificatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCertificatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
