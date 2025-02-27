import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    private alertify: AlertfyService
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]]
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
          this.errorMessages[control] = '';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please enter required fields to submit';
      this.alertify.error(this.errorMessage);

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
      if (this.registrationForm.controls['password'].value !== this.registrationForm.controls['cpassword'].value) {
        this.errorMessages['cpassword'] = 'Passwords do not match.';
      } else {
        this.errorMessages['cpassword'] = '';
      }

      // Optional: Add visual feedback (shake animation) for invalid fields

      return;
    }

    const userData: User = this.registrationForm.value;
    this.userService.addUser(userData);
    this.alertify.success("User registered successfully!");
    this.registrationForm.reset();
    this.errorMessage = '';
    this.errorMessages = {
      username: '',
      email: '',
      password: '',
      cpassword: '',
      mobile: '',
    };
  }
}
