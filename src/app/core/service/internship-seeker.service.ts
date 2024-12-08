import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternshipSeekerService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInternshipSeeker(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}/internshipSeeker/user/${userId}`
    );
  }

  

  addInternship(req: any) {
    return this.http.post<any>(`${this.BASE_URL}/internshipSeeker/add`, req);
  }
  updateInternship(req:any){
    return this.http.put<any>(`${this.BASE_URL}/internshipSeeker/update`, req);
  }
}
