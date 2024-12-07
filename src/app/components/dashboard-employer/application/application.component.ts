import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service.component';
import { CompanyService } from '../../../core/service/company.service';
import { JobApplicationService } from '../../../core/service/job-application.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [RouterLink,NgFor,NgIf], // Add necessary imports (e.g., HttpClientModule, ReactiveFormsModule, CommonModule)
  templateUrl: './application.component.html',
})
export class ApplicationComponent implements OnInit {
  data: any; // To store company details
  applications: any = []; // To store the list of applications
  isLoading = true; // Loading state

  constructor(
    private companyService: CompanyService,
    private internshipApplicationService: JobApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);

    // Check if userId exists in the token
        // @ts-ignore
    if (decodedToken?.userId) {
          // @ts-ignore

      this.fetchCompany(decodedToken.userId);
    } else {
      console.error('Invalid or missing token.');
      this.isLoading = false;
    }
  }

  // Fetch company details using userId
  fetchCompany(userId: any): void {
    this.companyService.getCompany(userId).subscribe({
      next: (companyResponse) => {
        this.data = companyResponse;
        this.fetchApplications(this.data.id);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching company data:', err);
        this.isLoading = false;
      },
    });
  }

  // Fetch applications for the company by company ID
  fetchApplications(companyId: number): void {
    this.internshipApplicationService
      .getApplicationsByCompanyId(companyId)
      .subscribe({
        next: (applications) => {
          this.applications = applications; 
          console.log('Applications:', applications);
        },
        error: (err) => {
          console.error('Error fetching applications:', err);
        },
      });
  }
}
