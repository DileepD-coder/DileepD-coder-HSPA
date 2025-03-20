import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../Services/user-service';
import { AlertfyService } from '../../Services/alertfy.service';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertify: AlertfyService,
    private router: Router,
    private authService: AuthService
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const isAuthenticated = this.userService.login(email, password);
      if (isAuthenticated) {
        const username = localStorage.getItem('username');
        this.authService.setUsername(username);
        console.log('Login successful:', this.loginForm.value);
        this.alertify.success('Login successful');
        this.router.navigate(['/']); // Redirect to homepage after login
      } else {
        console.log('Invalid credentials');
        this.alertify.error('Invalid email or password');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
