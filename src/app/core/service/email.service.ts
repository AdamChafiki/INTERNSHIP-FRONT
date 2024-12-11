import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class EmailService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendInternshipRequest(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/internship/send-internship-request`,
      formData,
      {
        observe: 'response',
      }
    );
  }
}
