import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCertStudentComponent } from './assign-cert-student.component';

describe('AssignCertStudentComponent', () => {
  let component: AssignCertStudentComponent;
  let fixture: ComponentFixture<AssignCertStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCertStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCertStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
