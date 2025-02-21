import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components
import { FormsModule, NgForm } from '@angular/forms'; // Import FormsModule for two-way data binding
import { Location } from '@angular/common'; // ✅ Import Location for Back Navigation

@Component({
  selector: 'app-add-property',
  standalone: true, // Mark as standalone component
  imports: [CommonModule, FormsModule], // Include FormsModule to handle forms
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  propertyName: string = ''; // Property name model
  propertyPrice: number = 0; // Property price model

  @ViewChild('Form') addPropertyForm!: NgForm; // Access the form instance

  constructor(private location: Location) {} // ✅ Inject Location for Back Navigation

  submitForm() {
    // Add form submission logic here
    console.log('Property Name:', this.propertyName);
    console.log('Property Price:', this.propertyPrice);
    // Add logic to send this data to a service or backend
  }

  goBack() {
    this.location.back(); // ✅ Navigates back to the previous page
  }

  onSubmit(Form: NgForm) {
    console.log('Congrats! Form Submitted');
    console.log(this.addPropertyForm.value); // Access the form values using addPropertyForm
  }
}
