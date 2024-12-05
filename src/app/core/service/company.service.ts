import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompany(userId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/company/user/${userId}`);
  }

  addCompany(req:any) {
    return this.http.post<any>(`${this.BASE_URL}/company/add`, req);
  }

  getLatestInternships(companyId:any){
    return this.http.get<any>(`${this.BASE_URL}/company/${companyId}/latest-internships`);
  }

  updateCompany(req:any,id:any) {
    return this.http.put<any>(`${this.BASE_URL}/company/${id}`, req);
  }


}
