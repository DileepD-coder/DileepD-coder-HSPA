import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service';
import { AlertfyService } from '../../Services/alertfy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertify: AlertfyService,
    private router: Router
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const isAuthenticated = this.userService.login(email, password);
      if (isAuthenticated) {
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
