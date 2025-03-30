import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StrongPasswordRegx } from 'src/app/shared/models/passwordpattern';
import { passwordMatchValidator } from 'src/app/shared/models/passwordMatchValidator';
import { ageValidator } from 'src/app/shared/models/age.validator';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  genderList: string[] = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(5)]],
        lastName: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^(0|[1-9][0-9]*)$')]],
        dob: ['', [Validators.required, ageValidator]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.minLength(10)]],
        password: [
          '',
          [Validators.required, Validators.pattern(StrongPasswordRegx)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  getpasswordMismatch() {
    return this.registerForm.hasError('passwordMismatch');
  }

  //   Submit
  onSubmit() {
    if (this.registerForm.valid) {
      const newUser: User = this.registerForm.value;

      this.authService.register(newUser).subscribe({
        next: (res) => {
          this.toastr.success('Registration successfull', 'Success');
          this.registerForm.reset();
          this.router.navigate(['./login']);
        },

        error: (err) => {
          this.toastr.error('failed to register. Please try again');
        },
      });
    }
  }
}
