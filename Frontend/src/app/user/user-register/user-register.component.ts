import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
})
export class UserRegisterComponent {
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpassword: ['', [Validators.required]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    }, { validators: this.passwordMatchValidator }); // Custom validator to check password match
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('cpassword')?.value 
      ? null 
      : { mismatch: true }; // Return an error object if they don't match
  }

  onSubmit() {
    console.log("Form submitted");
    if (this.registrationForm.valid) {
      console.log("Form values:", this.registrationForm.value);
    } else {
      console.log("Form is invalid");
      console.log("Form errors:", this.registrationForm.errors);
      Object.keys(this.registrationForm.controls).forEach(controlName => {
        const control = this.registrationForm.controls[controlName];
        if (control.invalid) {
          console.log(`${controlName} is invalid:`, control.errors);
        }
      });
    }
  }
}
