import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for standalone components
import { FormsModule } from '@angular/forms';  // Import FormsModule for two-way data binding

@Component({
  selector: 'app-add-property',
  standalone: true,  // Mark as standalone component
  imports: [CommonModule, FormsModule],  // Include FormsModule to handle forms
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  propertyName: string = ''; // Property name model
  propertyPrice: number = 0;  // Property price model

  submitForm() {
    // Add form submission logic here
    console.log('Property Name:', this.propertyName);
    console.log('Property Price:', this.propertyPrice);
    // Add logic to send this data to a service or backend
  }
}
