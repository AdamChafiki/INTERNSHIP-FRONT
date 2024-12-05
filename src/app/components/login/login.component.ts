import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../core/service/auth-service.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true
})
export class LoginComponent {
  //ToDo Valid Form

  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  onSubmit() {
    this.isLoading = true;
    const loginForm = this.loginForm.value;

    this.authService.doLogin(loginForm).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.toastr.success(`Login Success!`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginForm.reset();
        console.error('Login error:', err);
        this.toastr.error(`Login failed. Please try again.`, 'Error', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
      },
      complete: () => {
        this.isLoading = false;
        this.loginForm.reset();
      },
    });
  }
}
