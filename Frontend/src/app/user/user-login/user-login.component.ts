import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service'; // Import UserService
import { AlertfyService } from '../../Services/alertfy.service'; // Correct import statement
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Make sure ReactiveFormsModule is included here
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertify: AlertfyService,
    private router: Router // Inject Router
  ) { 
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required], // Change to email field
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Destructure email and password

      // Call UserService to authenticate the user
      const isAuthenticated = this.userService.login(email, password);

      if (isAuthenticated) {
        console.log('Login successful:', this.loginForm.value);
        this.alertify.success('Login successful'); // Use AlertfyService for success message
        
        // Navigate to another page or perform login actions here
        this.router.navigate(['/']); // Redirect to the homepage after login
      } else {
        console.log('Invalid credentials');
        this.alertify.error('Invalid email or password'); // Use AlertfyService for error message
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
