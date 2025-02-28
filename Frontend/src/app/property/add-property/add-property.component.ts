import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs'; // ✅ Correct import

@Component({
  selector: 'app-add-property',
  standalone: true, 
  imports: [CommonModule, FormsModule, TabsetComponent, TabDirective], // ✅ Import TabsetComponent & TabDirective
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent {
  propertyName: string = '';
  propertyPrice: number = 0;

  @ViewChild('Form') addPropertyForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent; // ✅ Fixed ViewChild name

  constructor(private location: Location) {}

  submitForm(): void {
    console.log('Property Name:', this.propertyName);
    console.log('Property Price:', this.propertyPrice);
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(Form: NgForm): void {
    console.log('Congrats! Form Submitted');
    console.log(this.addPropertyForm.value);
  }

  selectTab(tabId: number): void {
    this.formTabs.tabs[tabId].active = true; // ✅ Corrected logic
  }
}
