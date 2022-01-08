import { Component, OnInit } from '@angular/core';
import {User} from '../../_models';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService, BreadcrumbService} from '../../_services';
import { Subscription } from 'rxjs';

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
  userRole: any;
  currentRootPageTitle:string;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private breadcrumbService: BreadcrumbService
    ) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.username = this.authenticatedUser.firstName + this.authenticatedUser.lastName;
          this.initials = this.getInitials(this.username);
          this.usermail = this.authenticatedUser.email;
          this.userRole = this.authenticatedUser.userRole;
        }
        else {
          this.loggedIn = false
        }
      }
    );

  }

  ngOnInit() {
    this.subscription = this.breadcrumbService.currentRootPageTitle.subscribe(rootPageTitle => this.currentRootPageTitle = rootPageTitle)
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
