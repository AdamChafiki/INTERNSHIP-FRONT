import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InternshipService } from '../../core/service/internship.service';
import { AuthService } from '../../core/service/auth-service.component';
import { JobApplicationService } from '../../core/service/job-application.service';
import { InternshipSeekerService } from '../../core/service/internship-seeker.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-single-internship',
  standalone: true,
  imports:  [RouterLink],
  templateUrl: './single-internship.component.html',
})
export class SingleInternshipComponent implements OnInit {
  internshipId: string | null = null; // Holds the internship ID from the route
  internshipSeekerId: string | null = null; // Holds the internship seeker ID
  userId: string | null = null;
  data: any; // Holds the internship data
  isLoading = true; // Flag for loading state

  constructor(
    private route: ActivatedRoute,
    private internshipService: InternshipService,
    private internshipApplicationService: JobApplicationService,
    private internshipSeekerService: InternshipSeekerService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.internshipId = params.get('id'); // Get internship ID from the route
      if (this.internshipId) {
        this.fetchInternshipData(); // Fetch internship details
        this.scrollToTop(); // Scroll to top
      }
    });

    // Fetch the InternshipSeeker ID based on the logged-in user
    this.fetchInternshipSeeker();
  }

  private fetchInternshipSeeker(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    this.userId = decodedToken?.userId;
    if (this.userId) {
      this.internshipSeekerService.getInternshipSeeker(this.userId).subscribe({
        next: (response) => {
          this.internshipSeekerId = response?.id; // Set the internship seeker ID
          console.log('Internship Seeker ID:', this.internshipSeekerId);
        },
        error: (err) => {
          console.error('Error fetching Internship Seeker:', err);
        },
      });
    }
  }

  applyToInternship(): void {
    if (this.internshipId && this.internshipSeekerId) {
      this.internshipApplicationService
        .apply(this.internshipId, this.internshipSeekerId)
        .subscribe({
          next: (response) => {
            console.log('Application successful:', response);
            this.toastr.success(`Application successful!`, 'Success', {
              positionClass: 'toast-bottom-right',
              closeButton: true,
            });
          },
          error: (err) => {
            console.error('Error applying for internship:', err);
            this.toastr.warning(`You already applied.`, 'Warning', {
              positionClass: 'toast-bottom-right',
              closeButton: true,
            });
          },
        });
    } else {
      console.error('Internship ID or Internship Seeker ID is missing.');
      alert('Unable to apply. Please try again.');
    }
  }

  private fetchInternshipData(): void {
    this.isLoading = true;
    this.internshipService.getInternshipById(this.internshipId).subscribe({
      next: (response) => {
        this.data = response; // Set the internship data
        this.isLoading = false; // Stop loading spinner
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching internship data:', err);
      },
    });
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }
}
