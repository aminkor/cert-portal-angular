import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstitutionsDialogComponent } from './edit-institutions-dialog.component';

describe('EditInstitutionsDialogComponent', () => {
  let component: EditInstitutionsDialogComponent;
  let fixture: ComponentFixture<EditInstitutionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInstitutionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstitutionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
