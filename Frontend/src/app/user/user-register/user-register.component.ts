import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service';
import { User } from '../../models/user';
import { AlertfyService } from '../../Services/alertfy.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [UserService, AlertfyService]
})
export class UserRegisterComponent implements OnInit {
  registrationForm: FormGroup;
  user: User = {
    username: '',
    email: '',
    password: '',
    cpassword: '',
    mobile: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertify: AlertfyService
  ) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {}

  // Getter methods for form controls with non-null assertion
  get firstName(): AbstractControl {
    return this.registrationForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.registrationForm.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.registrationForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.registrationForm.get('password')!;
  }

  get confirmPassword(): AbstractControl {
    return this.registrationForm.get('confirmPassword')!;
  }

  get mobile(): AbstractControl {
    return this.registrationForm.get('mobile')!;
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string, errorType: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field && field.errors && field.errors[errorType]) {
      return field.errors[errorType];
    }
    return '';
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ notmatched: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Create user object
      this.user = {
        username: `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        cpassword: this.registrationForm.value.confirmPassword,
        mobile: this.registrationForm.value.mobile,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName
      };

      this.userService.addUser(this.user);
      this.alertify.success('Registration successful!');
      this.registrationForm.reset();
    } else {
      this.alertify.error('Please complete the form with valid data');
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
