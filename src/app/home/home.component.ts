import { Component, OnInit } from '@angular/core';
import {AccountService} from '../_services';
import {User} from '../_models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: boolean;
  authenticatedUser: User;
  userFullName;
  constructor(
    private accountService: AccountService
  ) {
    this.accountService.user.subscribe(
      (usr) => {
        if (usr) {
          this.loggedIn = true;
          this.authenticatedUser = usr;
          this.userFullName = this.authenticatedUser.firstName + ' ' + this.authenticatedUser.lastName;
        }
        else {
          this.loggedIn = false
        }
      }
    );
  }

  ngOnInit(): void {
  }

}
