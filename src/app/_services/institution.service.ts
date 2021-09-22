import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Institution} from '../_models';



@Injectable({ providedIn: 'root' })
export class InstitutionService {


  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }


  create(institution: Institution) {
    return this.http.post(`${environment.apiUrl}/institutions`, institution);
  }

  getAll() {
    return this.http.get<Institution[]>(`${environment.apiUrl}/institutions`);
  }

  getById(id: string) {
    return this.http.get<Institution>(`${environment.apiUrl}/institutions/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/institutions/${id}`, params)
      .pipe(map(x => {
         return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/accounts/${id}`)
      .pipe(map(x => {
          return x;
      }));
  }
}
