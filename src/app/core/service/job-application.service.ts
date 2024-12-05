import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobApplicationService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  apply(internshipId: any, internshipSeekerId: any) {
    const applicationData = {
      internshipId: internshipId,
      internshipSeekerId: internshipSeekerId,
    };

    return this.http.post(`${this.BASE_URL}/job-application`, applicationData);
  }

  getApplications(internshipSeekerId: any) {
    return this.http.get(
      `${this.BASE_URL}/job-application/internshipSeeker/${internshipSeekerId}`
    );
  }

  deleteApplication(internshipSeekerId: any) {
    return this.http.delete(
      `${this.BASE_URL}/job-application/internshipSeeker/${internshipSeekerId}`
    );
  }
}
