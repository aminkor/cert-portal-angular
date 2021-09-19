import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from './_services';
import {User} from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cert-portal-angular';
  userObject: any;
  initials: any;
  username: any;
  usermail: any;
  loggedIn = false;
  authenticatedUser: User;

   constructor(
     private route: ActivatedRoute,
     private router: Router,
     private accountService: AccountService) {
      this.accountService.user.subscribe(
        (usr) => {
          if (usr) {
            this.loggedIn = true;
            this.authenticatedUser = usr;
            this.initials = 'TI';
            this.username = this.authenticatedUser.firstName + this.authenticatedUser.lastName;
            this.usermail = this.authenticatedUser.email;
          }
          else {
            this.loggedIn = false
          }
        }
      );

   }


  logoutUser() {
    this.accountService.logout();
  }
}
