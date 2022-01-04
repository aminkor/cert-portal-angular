import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AccountService} from '../_services';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this.accountService.userValue) {
        // auto logout if token expired
        this.accountService.user.subscribe(
          (usr) => {
            if (usr) {
              if (this.tokenExpired(usr.jwtToken)) {
                this.accountService.logout();

              }
            }
            else {

            }
          }
        );

        // else navigate to front page
        this.router.navigate(['/'])
      }

      const error = err.error?.message || err.statusText;
      console.error(err);
      return throwError(error);
    }))
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
