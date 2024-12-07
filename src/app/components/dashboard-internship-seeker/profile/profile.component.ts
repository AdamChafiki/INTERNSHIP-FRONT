import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth-service.component';
import { InternshipSeekerService } from '../../../core/service/internship-seeker.service';
import { RouterLink } from '@angular/router';
import { FileService } from '../../../core/service/file.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  data: any;
  userId: any;
  isLoading = true;
  selectedFile: File | null = null;
  cvLoading = false;

  internshipSeekerForm = new FormGroup({
    schoolName: new FormControl(''),
    level: new FormControl(''),
    specialty: new FormControl(''),
    description: new FormControl(''),
    duration: new FormControl(''),
    startDate: new FormControl(''),
  });

  updateInternshipSeekerForm = new FormGroup({
    schoolName: new FormControl(''),
    level: new FormControl(''),
    specialty: new FormControl(''),
    description: new FormControl(''),
    duration: new FormControl(''),
    startDate: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private internshipSeekerService: InternshipSeekerService,
    private file: FileService
  ) {}
  ngOnInit(): void {

    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    this.userId = decodedToken?.userId;
    this.internshipSeekerService.getInternshipSeeker(this.userId).subscribe({
      next: (response) => {
        this.data = response;
        console.log('data', this.data);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error :', err);
      },
    });
  }

  addInternshipSeeker() {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    const form = {
      ...this.internshipSeekerForm.value,
      userId: this.userId,
    };
    // http
    this.internshipSeekerService.addInternship(form).subscribe({
      next: (response) => {
        this.data = response;
        this.internshipSeekerForm.reset();
        this.isLoading = false;
        this.closeModal();
        this.toastr.success(`Added Sucessfully`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error :', err);
      },
    });
    //
  }

  updateInternshipSeeker() {
    const form = {
      ...this.updateInternshipSeekerForm.value,
      userId: this.userId,
    };
    console.log(form);
    console.log('form');

    // http
    this.internshipSeekerService.updateInternship(form).subscribe({
      next: (response) => {
        this.ngOnInit();
        this.updateInternshipSeekerForm.reset();
        this.isLoading = false;
        this.closeModal2();
        this.toastr.success(`Updated Sucessfully`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCvName(filePath: string): string {
    return filePath.split('\\').pop() || 'Unknown CV';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      alert('No file selected!');
    }
  }

  getCv(userId: any) {
    this.file.getCv(userId).subscribe({
      next: (response) => {
        console.log(response);
        const url = window.URL.createObjectURL(response);
        window.open(url);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  uploadCv() {
    this.cvLoading = true;
    if (!this.selectedFile) {
      alert('Please select a file before uploading!');
      return;
    }

    this.file.updateCv(this.selectedFile, this.userId).subscribe({
      next: (response) => {
        // Handle success
        console.log('File uploaded successfully:', response);
        this.cvLoading = false;
        this.ngOnInit();
        this.toastr.success('File uploaded successfully', 'Success',{
          positionClass: 'toast-bottom-right',
          closeButton: true,
          timeOut: 1000
        });
      },
      error: (err) => {
        // Handle error
        console.error('Error uploading file:', err);
        alert('Error uploading file. Please try again.');
      },
    });
  }

  openModal() {
    this.updateInternshipSeekerForm.patchValue(this.data);
    const modal: any = document.getElementById('my_modal_1');
    modal?.showModal();
  }

  closeModal() {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  openModal2() {
    this.updateInternshipSeekerForm.patchValue(this.data);
    const modal: any = document.getElementById('my_modal_2');
    modal?.showModal();
  }

  closeModal2() {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }
}
