import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../core/service/company.service';
import { AuthService } from '../../../core/service/auth-service.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './company.component.html',
})
export class CompanyComponent implements OnInit {
  data: any;
  isLoading = true;
  isSubmitting = false;
  updateForm = new FormGroup({
    name: new FormControl(''),
    sector: new FormControl(''),
    address: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    urlWebsite: new FormControl(''),
  });

  companyForm = new FormGroup({
    name: new FormControl(''),
    sector: new FormControl(''),
    address: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    urlWebsite: new FormControl(''),
  });

  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore
    if (decodedToken?.userId) {
      // @ts-ignore
      this.companyService.getCompany(decodedToken.userId).subscribe({
        next: (response) => {
          this.data = response;
          this.updateForm.patchValue(this.data);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching company data:', err);
        },
      });
    } else {
      console.error('Invalid or missing token.');
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      console.warn('Form is invalid. Please correct the errors.');
      return;
    }

    this.isSubmitting = true;
    const updateData = this.updateForm.value;
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    // @ts-ignore

    if (decodedToken?.userId) {
      // @ts-ignore

      this.companyService.updateCompany(updateData, this.data.id).subscribe({
        next: (response) => {
          console.log('Company updated successfully:', response);
          this.closeModal1();
          this.toastr.success(`Updated Sucessfully`, 'Success', {
            positionClass: 'toast-bottom-right',
            closeButton: true,
          });
          this.data = { ...this.data, ...updateData };
        },
        error: (err) => {
          console.error('Error updating company:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      console.error('Invalid or missing token.');
      this.isSubmitting = false;
    }
  }

  openModal1(): void {
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal element not found.');
    }
  }

  closeModal1(): void {
    let modal = document.getElementById('my_modal_1') as HTMLDialogElement;
    if (modal) {
      modal.close();
    } else {
      console.error('Modal element not found.');
    }
  }

  openModal2(): void {
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    if (modal) {
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

  addCompany() {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);

    // @ts-ignore
    const userId = decodedToken.userId;
    const companyForm = { ...this.companyForm.value, userId };
    console.log(companyForm);
    this.companyService.addCompany(companyForm).subscribe({
      next: (response) => {
        this.data = response;
        this.closeModal2();
        this.isLoading = false;
        this.toastr.success(`Created Sucessfully`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      error: (err) => {
        this.closeModal2();
        this.isLoading = false;
        console.error('Error fetching company data:', err);
      },
    });
  }
}
