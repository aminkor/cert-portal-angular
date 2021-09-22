import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstitutionDialogComponent } from './add-institution-dialog.component';

describe('AddInstitutionDialogComponent', () => {
  let component: AddInstitutionDialogComponent;
  let fixture: ComponentFixture<AddInstitutionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInstitutionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstitutionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
