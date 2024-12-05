import { Component } from '@angular/core';
import { JobApplicationService } from '../../../core/service/job-application.service';
import { AuthService } from '../../../core/service/auth-service.component';
import { InternshipSeekerService } from '../../../core/service/internship-seeker.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './job-application.component.html',
})
export class JobApplicationComponent {
  data: any;
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
        console.log('Internship Seeker Data:', this.data);

        // Fetch applications for the internship seeker
        this.fetchApplications();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching Internship Seeker data:', err);
      },
    });
  }

  // Fetch applications for the internship seeker
  fetchApplications() {
    this.internshipApplicationService.getApplications(this.data.id).subscribe({
      next: (response) => {
        this.applications = response;
        console.log('Applications:', this.applications);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching applications:', err);
      },
    });
  }


  deleteApplication(internshipSeekerId: any) {
    console.log(internshipSeekerId);
    this.isLoading = true;
    this.internshipApplicationService
      .deleteApplication(internshipSeekerId)
      .subscribe({
        next: (res) => {          
          this.fetchApplications();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting application:', err);
        },
      });
  }
}
