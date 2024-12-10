import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {routes} from '../../app.routes';
import {AuthService} from '../../core/service/auth-service.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true
})
export class RegisterComponent {
  //ToDo Valid Form

  isLoading = false;

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    role: new FormControl('', [Validators.required]),
  });


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  onSubmit() {
    this.isLoading = true;
    const registerForm = this.registerForm.value;

    this.authService.doRegister(registerForm).subscribe({
      next: (response) => {
        this.toastr.success(`${response.message}`, 'Success', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });

        this.router.navigate(["/login"])

      },
      error: (err) => {
        this.toastr.error(`error`, 'Error', {
          positionClass: 'toast-bottom-right',
          closeButton: true,
        });
        console.error('Registration error:', err);
      },
      complete: () => {
        this.isLoading = false;
        this.registerForm.reset()
      },
    });
  }
}
