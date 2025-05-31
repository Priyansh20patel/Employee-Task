import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordRegx } from 'src/app/shared/models/passwordpattern';
import { matchPassword } from 'src/app/shared/models/passwordMatchValidator';
import { ageValidator } from 'src/app/shared/models/age.validator';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserDto } from 'src/app/shared/models/userDto';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  genderList: string[] = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(5)]],
        lastName: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [Validators.pattern('^[0-9]{10}$'), Validators.maxLength(10)],
        ],
        dob: ['', [Validators.required, ageValidator]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.minLength(10)]],
        password: ['', [Validators.required, Validators.pattern(PasswordRegx)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: matchPassword }
    );
  }

  get ctrl() {
    return this.registerForm.controls;
  }

  getpasswordMismatch() {
    return this.registerForm.hasError('passwordMismatch');
  }

  // Submit
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Check if email is already taken
    const email = this.registerForm.get('email')?.value;

    this.authService.checkEmail(email).subscribe((exist) => {
      if (exist) {
        this.registerForm.get('email')?.setErrors({ emailTaken: true });
        this.toastr.error('Email is already registered.');
        return;
      }

      // If email not taken
      const newUser: UserDto = { ...this.registerForm.value,selectedstatus: 'Active',
      };

      this.authService.register(newUser).subscribe({
        next: () => {
          this.toastr.success('Registration successful', 'Success');
          this.registerForm.reset();
          this.router.navigate(['./login']);
        },
        error: () => {
          this.toastr.error('Failed to register. Please try again.');
        },
      });
    });
  }
}
