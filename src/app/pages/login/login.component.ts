import { AuthService } from 'src/app/shared/services/auth.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            this.toastr.success('Login successful!', 'Success');
            this.router.navigate(['./user-list']);
          } else {
            this.toastr.error('Invalid email or password', 'Login Failed');
          }
        },

        error: () => {
          this.toastr.error('Login failed. Please try again.');
        },
      });
    }
  }
}
