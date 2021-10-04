import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Certificate} from '../_models';



@Injectable({ providedIn: 'root' })
export class CertificateService {


  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }


  create(certificate: Certificate, file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('name', certificate.name)
    formData.append('description', certificate.description)

    return this.http.post(`${environment.apiUrl}/certificates`, formData);
  }

  getAll() {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates`);
  }

  getUserCertificates(userId) {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates/users/${userId}`);
  }

  getById(id: string) {
    return this.http.get<Certificate>(`${environment.apiUrl}/certificates/${id}`);
  }

  update(id, params,  file: File) {
    let formToSend = null;
    const formData: FormData = new FormData();

    if (file != null) {
      formData.append('file', file);
    }
    formData.append('name', params.name)
    formData.append('description', params.description)

    formToSend = formData;


    return this.http.put(`${environment.apiUrl}/certificates/${id}`, formToSend)
      .pipe(map(x => {
         return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/certificates/${id}`)
      .pipe(map(x => {
          return x;
      }));
  }
}
