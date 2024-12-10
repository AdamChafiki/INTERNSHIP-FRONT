import { Component } from '@angular/core';
import { JobApplicationService } from '../../../core/service/job-application.service';
import { AuthService } from '../../../core/service/auth-service.component';
import { InternshipSeekerService } from '../../../core/service/internship-seeker.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './job-application.component.html',
})
export class JobApplicationComponent {
  data: any = null; // User profile data
  isLoading = true;
  userId: any;
  applications: any = [];

  constructor(
    private internshipApplicationService: JobApplicationService,
    private authService: AuthService,
    private internshipSeekerService: InternshipSeekerService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    this.userId = decodedToken?.userId;

    // Fetch Internship Seeker data
    this.internshipSeekerService.getInternshipSeeker(this.userId).subscribe({
      next: (response) => {
        this.data = response;

        // If the profile exists, fetch applications
        if (this.data) {
          this.fetchApplications();
        } else {
          this.isLoading = false; // Stop the loader if no profile exists
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching Internship Seeker data:', err);
      },
    });
  }

  fetchApplications() {
    this.internshipApplicationService.getApplications(this.data.id).subscribe({
      next: (response) => {
        console.log(response);
        
        this.applications = response;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
      },
    });
  }

  sortByDate(ascending: boolean): void {
    this.applications.sort((a: any, b: any) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.sortByDate(selectedValue === 'asc');
  }

  deleteApplication(applicationId: any) {
    this.isLoading = true;
    this.internshipApplicationService
      .deleteApplication(applicationId)
      .subscribe({
        next: () => {
          this.fetchApplications();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting application:', err);
        },
      });
  }
}
