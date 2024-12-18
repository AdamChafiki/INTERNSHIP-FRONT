import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../../core/service/email.service';
import { AuthService } from '../../../core/service/auth-service.component';
import { InternshipSeekerService } from '../../../core/service/internship-seeker.service';

@Component({
  selector: 'app-internship-request',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './email.component.html',
  providers: [
    EmailService,
    ToastrService,
    AuthService,
    InternshipSeekerService,
  ],
})
export class EmailComponent {
  internshipForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;
  data: any;
  userId: any;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private authService: AuthService,
    private internshipSeekerService: InternshipSeekerService,

    private toastr: ToastrService
  ) {
    this.internshipForm = this.fb.group({
      companyEmail: ['', [Validators.required, Validators.email]],
      seekerName: ['', Validators.required],
      seekerEmail: ['', [Validators.required, Validators.email]],
      seekerMessage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    this.userId = decodedToken?.userId;
    console.log(this.userId);

    this.internshipSeekerService.getInternshipSeeker(this.userId).subscribe({
      next: (response) => {
        this.data = response;
        console.log('data', this.data);

        if (response) {
          this.internshipForm.patchValue({
            seekerName: this.data.user.firstName, // Update form control
            seekerEmail: this.data.user.email, // Example: auto-fill email too
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.data = null;
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  sendInternshipRequest(): void {
    if (!this.selectedFile) {
      alert('Please upload a CV.');
      return;
    }
    this.isLoading = true;

    const formData = new FormData();
    formData.append(
      'companyEmail',
      this.internshipForm.get('companyEmail')?.value
    );
    formData.append('seekerName', this.internshipForm.get('seekerName')?.value);
    formData.append(
      'seekerEmail',
      this.internshipForm.get('seekerEmail')?.value
    );
    formData.append(
      'seekerMessage',
      this.internshipForm.get('seekerMessage')?.value
    );
    formData.append('cv', this.selectedFile);

    this.emailService.sendInternshipRequest(formData).subscribe({
      next: (response) => {
        // Handle successful response
        alert('Email sent successfully!');
        this.internshipForm.reset();
        this.selectedFile = null;
      },
      error: (error) => {
        // Even on error, confirm if the response was a success
        if (error.status === 200 || error.ok) {
          this.isLoading = false;
          this.internshipForm.reset();
          this.toastr.success(`Email was sent !`, 'Success', {
            positionClass: 'toast-bottom-right',
            closeButton: true,
            timeOut: 1000,
          });
        } else {
          alert('Failed to send email. Please try again later.');
          console.error('Error:', error);
        }
      },
    });
  }
}
