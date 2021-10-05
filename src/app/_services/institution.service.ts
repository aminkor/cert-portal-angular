import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Certificate, Institution} from '../_models';
import {Student} from '../_models/student';



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

  getInstructorInstitutions(userId) {
    return this.http.get<Institution[]>(`${environment.apiUrl}/institutions/instructors/${userId}`);
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
    return this.http.delete(`${environment.apiUrl}/institutions/${id}`)
      .pipe(map(x => {
          return x;
      }));
  }

  // institution students methods

  getStudents(institution: Institution) {
    return this.http.get<Student []>(`${environment.apiUrl}/institutions/students/${institution.id}`);
  }

  addStudent(student: Student, institution: Institution) {
    return this.http.post(`${environment.apiUrl}/institutions/students`, {
      studentId: student.id,
      institutionId: institution.id
    });

  }

  removeStudent(student: Student, institution: Institution) {
    return this.http.post(`${environment.apiUrl}/institutions/students/remove`,{
      studentId: student.id,
      institutionId: institution.id
    });

  }
}
