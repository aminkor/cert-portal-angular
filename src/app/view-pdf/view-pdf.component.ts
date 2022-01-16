import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent implements OnInit {
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  constructor(
    public dialogRef: MatDialogRef<ViewPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewPdfModel,
  ) {
    this.pdfSrc = data.pdfUrl
    // TODO something wrong with cors, need to configure, if using the above 
   }

  ngOnInit(): void {
  }

}

export class ViewPdfModel {
  constructor(
    public pdfUrl: string,

  ) {
  }
}
