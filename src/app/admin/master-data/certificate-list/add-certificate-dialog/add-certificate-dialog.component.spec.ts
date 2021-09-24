import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCertificateDialogComponent } from './add-certificate-dialog.component';

describe('AddCertificateDialogComponent', () => {
  let component: AddCertificateDialogComponent;
  let fixture: ComponentFixture<AddCertificateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCertificateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCertificateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
