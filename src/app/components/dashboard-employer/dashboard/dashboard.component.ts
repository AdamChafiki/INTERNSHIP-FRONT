import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../core/service/company.service';
import { AuthService } from '../../../core/service/auth-service.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  companyId: number | null = null;
  latestInternships: any[] = [];

  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);


    // @ts-ignore
    if (decodedToken?.userId) {
      // @ts-ignore
      this.companyService.getCompany(decodedToken.userId).subscribe({
        next: (response) => {
          this.companyId = response.id; // Assuming `id` is the company ID in the response
          this.fetchLatestInternships(); // Call to fetch internships after fetching company ID
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching company data:', err);
        },
      });
    } else {
      this.isLoading = false;
      this.toastr.error('Invalid or missing token.', 'Error');
      console.error('Invalid or missing token.');
    }
  }
  fetchLatestInternships(): void {
    if (this.companyId) {
      this.companyService.getLatestInternships(this.companyId).subscribe({
        next: (response) => {
          console.log(response)
          this.latestInternships = response;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('Failed to fetch internships.', 'Error');
          console.error('Error fetching internships:', err);
        },
      });
    }
  }
}
