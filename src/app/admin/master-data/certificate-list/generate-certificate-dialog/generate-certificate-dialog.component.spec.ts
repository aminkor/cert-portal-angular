import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCertificateDialogComponent } from './generate-certificate-dialog.component';

describe('GenerateCertificateDialogComponent', () => {
  let component: GenerateCertificateDialogComponent;
  let fixture: ComponentFixture<GenerateCertificateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCertificateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCertificateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
