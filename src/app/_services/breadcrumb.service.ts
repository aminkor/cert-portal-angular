import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BreadcrumbService {

  private rootPageTitle = new BehaviorSubject('Home');
  currentRootPageTitle = this.rootPageTitle.asObservable();

  constructor() { }

  changeRootPage(message: string) {
    this.rootPageTitle.next(message)
  }

}