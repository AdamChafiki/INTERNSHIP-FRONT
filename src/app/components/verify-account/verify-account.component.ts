import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/service/auth-service.component';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  imports: [ReactiveFormsModule, NgIf],
  standalone: true,
})
export class VerifyAccountComponent implements OnInit {
  verifyForm = new FormGroup({
    verificationCode: new FormControl(''),
  });
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  // i need to get here email from router bcs there is no token and after that verify user
  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token);
    console.log(decodedToken)
  }

  onSubmit() {
    this.isLoading = true;
    const verifyReq = {};

    // this.authService.doVerifyAccount(verifyReq).subscribe({
    //   next: (response) => {
    //     this.toastr.success('Verification successful', 'Success', {
    //       positionClass: 'toast-bottom-right',
    //       closeButton: true,
    //     });
    //     this.router.navigate(['/login']);
    //   },
    //   error: (err) => {
    //     this.toastr.error('Verification failed. Please try again.', 'Error', {
    //       positionClass: 'toast-bottom-right',
    //       closeButton: true,
    //     });
    //     console.error('Registration error:', err);
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //   },
    // });
  }
}
