import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service.service';
import { User } from '../../models/user';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [UserService]
})
export class UserRegisterComponent {
  registrationForm: FormGroup;
  errorMessages: { [key: string]: string } = {};

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('cpassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessages = {}; // Reset error messages
      if (this.registrationForm.get('username')?.invalid) {
          this.errorMessages['username'] = 'Please enter your name.';
      }
      if (this.registrationForm.get('email')?.invalid) {
          this.errorMessages['email'] = 'Please enter a valid email address.';
      }
      if (this.registrationForm.get('password')?.invalid) {
          this.errorMessages['password'] = 'Please enter a password of at least 6 characters.';
      }
      if (this.registrationForm.get('cpassword')?.invalid) {
          this.errorMessages['cpassword'] = 'Please confirm your password.';
      }
      if (this.registrationForm.get('mobile')?.invalid) {
          this.errorMessages['mobile'] = 'Please enter a valid mobile number.';
      }
  

      alertify.error('Please enter required fields to submit');

      // Add shake animation for invalid fields
      for (const control in this.registrationForm.controls) {
        if (this.registrationForm.controls[control].invalid) {
          const inputElement = document.getElementById(control);
          if (inputElement) {
            inputElement.classList.add('shake');
            setTimeout(() => {
              inputElement.classList.remove('shake');
            }, 1000);
          }
        }
      }

      return;
    }

    const userData: User = this.registrationForm.value;
    this.userService.addUser(userData);
    alertify.success("User registered successfully!");

    this.registrationForm.reset();
    this.errorMessages = {};
  }
}
