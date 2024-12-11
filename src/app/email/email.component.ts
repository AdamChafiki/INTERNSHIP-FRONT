import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { EmailService } from '../core/service/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-internship-request',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './email.component.html',
  providers: [EmailService, ToastrService],
})
export class EmailComponent {
  internshipForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private toastr: ToastrService
  ) {
    this.internshipForm = this.fb.group({
      companyEmail: ['', [Validators.required, Validators.email]],
      seekerName: ['', Validators.required],
      seekerEmail: ['', [Validators.required, Validators.email]],
      seekerMessage: ['', Validators.required],
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
