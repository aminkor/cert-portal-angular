import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import {environment} from 'src/environments/environment';
import {Certificate, Institution, UserRole} from '../_models';
import {Student} from '../_models/student';



@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email, password) {
    return this.http.post<User>(`${environment.apiUrl}/accounts/authenticate`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  updateUser(user: any){
    user.jwtToken = this.userSubject.value.jwtToken;
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/accounts/register`, user);
  }

  create(user: User) {
    return this.http.post(`${environment.apiUrl}/accounts`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/accounts`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/accounts/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/accounts/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/accounts/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id === this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }

  searchStudents(institution: Institution, certificate: Certificate = null)  {
    let forCertId = 0;
    if (certificate != null) {
      forCertId = certificate.id;
    }
    return this.http.get<Student []>(`${environment.apiUrl}/accounts/students/${institution.id}?forCert=${forCertId}`);
  }

  getUserRoles(userId) {
    return this.http.get<UserRole []>(`${environment.apiUrl}/accounts/roles/${userId}`);

  }

  updateRoleInstitutions(payload) {
    return this.http.put(`${environment.apiUrl}/accounts/roles/institutions`, payload);

  }

  getInstructorStudents(instructorId)  {
    return this.http.get<Student []>(`${environment.apiUrl}/accounts/instructors/${instructorId}`);
  }

  getAllStudents() {
    return this.http.get<User[]>(`${environment.apiUrl}/accounts?filter=student`);

  }
}
