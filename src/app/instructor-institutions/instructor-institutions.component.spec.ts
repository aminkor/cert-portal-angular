import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorInstitutionsComponent } from './instructor-institutions.component';

describe('InstructorInstitutionsComponent', () => {
  let component: InstructorInstitutionsComponent;
  let fixture: ComponentFixture<InstructorInstitutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorInstitutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
