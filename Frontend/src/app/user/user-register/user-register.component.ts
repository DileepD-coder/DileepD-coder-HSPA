import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service.service';
import { User } from '../../models/user';
import { AlertfyService } from '../../Services/alertfy.service'; // Ensure the path is correct

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [UserService, AlertfyService] // Provide the AlertfyService here
})
export class UserRegisterComponent implements OnInit {
  registrationForm: FormGroup;
  errorMessage: string = '';
  errorMessages: { [key: string]: string } = {
    username: '',
    email: '',
    password: '',
    cpassword: '',
    mobile: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertify: AlertfyService // Inject AlertfyService
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.onValueChanges();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('cpassword')?.value ? null : { mismatch: true };
  }

  onValueChanges() {
    this.registrationForm.valueChanges.subscribe(() => {
      for (const control in this.registrationForm.controls) {
        if (this.registrationForm.controls[control].valid) {
          this.errorMessages[control] = ''; // Clear the error message if the control is valid
        }
      }
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please enter required fields to submit';
      this.alertify.error(this.errorMessage); // Use alertify service for error messages

      // Validate each control and set error messages accordingly
      if (this.registrationForm.controls['username'].invalid) {
        this.errorMessages['username'] = 'Please enter your name.';
      }
      if (this.registrationForm.controls['email'].invalid) {
        this.errorMessages['email'] = 'Please enter a valid email address.';
      }
      if (this.registrationForm.controls['password'].invalid) {
        this.errorMessages['password'] = 'Please enter a password of at least 6 characters.';
      }
      if (this.registrationForm.controls['cpassword'].invalid) {
        this.errorMessages['cpassword'] = 'Please confirm your password.';
      }
      if (this.registrationForm.controls['mobile'].invalid) {
        this.errorMessages['mobile'] = 'Please enter a valid mobile number.';
      }

      // Check if passwords match
      if (this.registrationForm.controls['password'].value !== this.registrationForm.controls['cpassword'].value) {
        this.errorMessages['cpassword'] = 'Passwords do not match.';
      } else {
        this.errorMessages['cpassword'] = ''; // Clear the error message if passwords match
      }

      // Add shake animation for invalid fields
      for (const control in this.registrationForm.controls) {
        const inputElement = document.getElementById(control);
        if (inputElement) {
          if (this.registrationForm.controls[control].invalid) {
            inputElement.classList.add('shake');
            inputElement.classList.remove('valid'); // Ensure valid class is removed
            inputElement.classList.add('invalid'); // Add invalid class
          } else {
            inputElement.classList.remove('shake');
            inputElement.classList.add('valid'); // Add valid class
            inputElement.classList.remove('invalid'); // Ensure invalid class is removed
          }
        }
      }

      return;
    }

    // If the form is valid and passwords match, proceed with registration
    const userData: User = this.registrationForm.value;
    this.userService.addUser(userData);
    this.alertify.success("User registered successfully!"); // Use alertify service for success messages

    this.registrationForm.reset();
    this.errorMessage = '';
    this.errorMessages = {
      username: '',
      email: '',
      password: '',
      cpassword: '',
      mobile: '',
    }; // Reset error messages
  }
}
