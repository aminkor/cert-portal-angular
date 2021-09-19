import { Component, OnInit } from '@angular/core';
import {User} from '../../_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../_services';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  title = 'cert-portal-angular';
  userObject: any;
  initials: any;
  username: any;
  usermail: any;
  loggedIn = false;
  authenticatedUser: User;
  showChild = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.username = this.authenticatedUser.firstName + this.authenticatedUser.lastName;
          this.initials = this.getInitials(this.username);
          this.usermail = this.authenticatedUser.email;
        }
        else {
          this.loggedIn = false
        }
      }
    );

  }

  getInitials(name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(char => char[0])
      .join('')
  }

  toggleAdmin() {
    this.showChild = !this.showChild
  }


  logoutUser() {
    this.accountService.logout();
  }
}
