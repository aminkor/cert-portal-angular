import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCertInstitutionComponent } from './assign-cert-institution.component';

describe('AssignCertInstitutionComponent', () => {
  let component: AssignCertInstitutionComponent;
  let fixture: ComponentFixture<AssignCertInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCertInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCertInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
