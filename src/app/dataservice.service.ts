import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PatientModel } from './models/PatientModel';
import { catchError } from 'rxjs/operators';

const patientUrl: string = 'http://localhost:8080/api/patient/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DataserviceService {
  constructor(private http: HttpClient) {}

  public getPatients(): Observable<PatientModel[]> {
    console.log('getPatients called');
    return this.http
      .get<PatientModel[]>(patientUrl)
      .pipe(catchError(this.handleError('getPatients', [])));
  }
  public getPatient(id: string): Observable<PatientModel> {
    return this.http
      .get<PatientModel>(patientUrl + id)
      .pipe(catchError(this.handleError('getPatientDetail', null)));
  }

  public deletePatient(id: string): Observable<{}> {
    return this.http
      .delete(patientUrl + id, httpOptions)
      .pipe(catchError(this.handleError('delete Patient')));
  }

  public addPatient(Patient: PatientModel): Observable<PatientModel> {
    return this.http
      .post<PatientModel>(patientUrl, Patient, httpOptions)
      .pipe(catchError(this.handleError('addPatient', Patient)));
  }

  public updatePatient(Patient: PatientModel): Observable<PatientModel> {
    return this.http
      .put<PatientModel>(patientUrl + Patient.id, Patient, httpOptions)
      .pipe(catchError(this.handleError('updatePatient', Patient)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
