import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service.component';
import { ToastrService } from 'ngx-toastr';
import { InternshipService } from '../../../core/service/internship.service';
import { DatePipe, SlicePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CompanyService } from '../../../core/service/company.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-internship',
  standalone: true,
  imports: [DatePipe, FormsModule, ReactiveFormsModule, SlicePipe, RouterLink],
  templateUrl: './internship.component.html',
})
export class InternshipEmployerComponent implements OnInit {
  data: any = [];
  isLoading = true;
  companyId: any;
  internshipForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    location: new FormControl(''),
    duration: new FormControl(''),
    presence: new FormControl(''),
  });

  updateInternshipForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    location: new FormControl(''),
    duration: new FormControl(''),
    presence: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private internshipService: InternshipService,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);

    // Ensure userId is available and valid
    // @ts-ignore
    if (decodedToken?.userId) {
      // @ts-ignore
      this.companyService.getCompany(decodedToken.userId).subscribe({
        next: (response) => {
          this.data = response;
          this.companyId = this.data.id; // Set the companyId
          this.isLoading = false;

          // After setting companyId, fetch internships for that company
          this.loadInternships();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching company data1:', err);
        },
      });
    }
  }

  // Function to load internships after the companyId is set
  loadInternships(): void {
    if (this.companyId) {
      this.internshipService.getInternshipsByCompany(this.companyId).subscribe({
        next: (response) => {
          this.data = response;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching company data2:', err);
        },
      });
    } else {
      console.error('Company ID is not set');
      this.isLoading = false;
    }
  }

  //
  addInternship() {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);

    // @ts-ignore
    const userId = decodedToken.userId;
    const internshipForm = {
      ...this.internshipForm.value,
      companyId: this.companyId,
    };
    console.log(internshipForm);
    this.internshipService.addInternship(internshipForm).subscribe({
      next: (response) => {
        this.data = [response, ...this.data];
        this.internshipForm.reset();
        this.isLoading = false;
        this.closeModal();
        this.toastr.success(`Added Sucessfully`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.closeModal();
        this.toastr.warning(`Create Company First`, 'Warning', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
          timeOut: 2000,
        });
        console.error('Error fetching company data:', err);
      },
    });
  }

  updateInternship(id: string) {
    console.log(id);
    
    const updateInternshipForm = this.updateInternshipForm.value;
    console.log("from updateIternshipform");
    
    console.log(updateInternshipForm);
    
    this.internshipService
      .updateInternship(updateInternshipForm, id)
      .subscribe({
        next: (response) => {
          console.log('Company updated successfully:', response);
          this.closeModal2();
          this.toastr.success(`Updated Sucessfully`, 'Success', {
            positionClass: 'toast-bottom-right',
            closeButton: true,
          });
          this.data = this.data.map((internship: any) =>
            internship.id === id
              ? { ...internship, ...updateInternshipForm }
              : internship
          );
        },
        error: (err) => {
          console.error('Error updating company:', err);
        },
      });
  }

  deleteInternship(id: string) {
    this.internshipService.deleteInternship(id).subscribe({
      next: (response) => {
        this.data = this.data.filter(
          (internship: { id: string }) => internship.id !== id
        );
        this.isLoading = false;
        this.toastr.success(`Deleted Sucessfully`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      error: (err) => {
        this.closeModal();
        this.isLoading = false;
        console.error('Error fetching company data:', err);
      },
    });
  }

  openModal() {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  closeModal() {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  openModal2(id: any): void {
    console.log(id);
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
      this.updateInternshipForm.patchValue(
        this.data.find((internship: { id: string }) => internship.id === id)
      );
      modal.showModal();
    } else {
      console.error('Modal element not found.');
    }
  }

  closeModal2(): void {
    let modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
      modal.close();
    } else {
      console.error('Modal element not found.');
    }
  }
}
