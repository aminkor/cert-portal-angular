import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Certificate, Institution} from '../_models';



@Injectable({ providedIn: 'root' })
export class CertificateService {


  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }


  create(certificate: Certificate, file: File) {
    const formData: FormData = new FormData();

    if (certificate.name === undefined) {
      certificate.name = null;
    }
    else {
      formData.append('name', certificate.name)

    }
    if (certificate.description === undefined) {
      certificate.description = null;

    }
    else {
      formData.append('description', certificate.description)

    }
    if (certificate.institutionId === undefined) {
      certificate.institutionId = 0;

    }
    else {
      formData.append('institutionId', certificate.institutionId)

    }
    if (certificate.accountId === undefined) {
      certificate.accountId = 0;

    }
    else {
      formData.append('accountId', certificate.accountId)

    }
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/certificates`, formData);
  }

  getAll() {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates`);
  }

  getAllByInstitution(institution: Institution) {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates/institutions/${institution.id}`);
  }

  getUserCertificates(userId) {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates/users/${userId}`);
  }

  getInstructorCertificates(instructorId) {
    return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates/instructors/${instructorId}`);
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
    if (params.name === undefined) {
      params.name = null;
    }
    else {
      formData.append('name', params.name)

    }
    if (params.description === undefined) {
      params.description = null;

    }
    else {
      formData.append('description', params.description)

    }
    if (params.institutionId === undefined) {
      params.institutionId = 0;

    }
    else {
      formData.append('institutionId', params.institutionId)

    }
    if (params.accountId === undefined) {
      params.accountId = 0;

    }
    else {
      formData.append('accountId', params.accountId)

    }

    if (params.actionType !== undefined) {
      formData.append('actionType', params.actionType)

    }

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
