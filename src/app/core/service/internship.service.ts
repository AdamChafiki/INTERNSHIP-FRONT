import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InternshipService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllInternships(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/internship/all`);
  }

  getInternshipById(id: any): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/internship/${id}`);
  }

  getInternshipsByCompany(id: any): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/internship/company/${id}`);
  }
  getInternshipsByLocation(location: any): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}/internship/location?location=${location}`
    );
  }

  addInternship(req: any) {
    return this.http.post<any>(`${this.BASE_URL}/internship/add`, req);
  }

  searchInternship(q: string) {
    return this.http.get<any>(`${this.BASE_URL}/internship?q=${q}`);
  }

  updateInternship(req: any, id: any) {
    return this.http.put<any>(`${this.BASE_URL}/internship/update/${id}`, req);
  }

  deleteInternship(id: string) {
    return this.http.delete<any>(`${this.BASE_URL}/internship/delete/${id}`);
  }
}
