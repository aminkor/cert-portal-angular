import { Component, OnInit } from '@angular/core';
import {AccountService, BreadcrumbService} from '../_services';
import {User} from '../_models';
import { CertificateService } from '../_services/certificate.service';
import { ViewPdfComponent, ViewPdfModel } from '../view-pdf/view-pdf.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;
  authenticatedUser: User;
  userFullName;
  userCertificates = [];
  constructor(
    private accountService: AccountService,
    private breadcrumbService: BreadcrumbService,
    private certificateService: CertificateService,
    private dialog: MatDialog,

  ) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.userFullName = this.authenticatedUser.firstName + ' ' + this.authenticatedUser.lastName;
          this.getUserCertificates();
        }
        else {
          this.loggedIn = false
        }
      }
    );
    this.breadcrumbService.changeRootPage('Home');
  }

    ngOnInit(): void {
  }
  
  getUserCertificates() {
    this.certificateService.getUserCertificates(this.authenticatedUser.id).subscribe(
      data => {
        console.log(data)
        this.userCertificates = data;
      },
      error => {
        console.log(error)
      }
    )
  }

  viewPdf(url) {
    const title = `Assign Student`,
    dialogData = new ViewPdfModel(url),
    dialogRef = this.dialog.open(ViewPdfComponent, {
      height: '650px',
      width: '750px',
      data: dialogData,
      disableClose: false
    })
  }

}
