import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs'; // Import TabsModule
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; // <-- New import
import { IProperty } from '../IProperty.interface'; // Add this import


@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, TabsModule, ButtonsModule, BsDatepickerModule], // Added BsDatepickerModule here
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements AfterViewInit {
  @Input() property!: IProperty; // Accept property input

  propertyName: string = '';
  propertyPrice: number = 0;
  progress: number = 0;
  selectedBhk: number | null = null;

  // Initialized properties
  gatedCommunity: string = '';  // For gated community selection
  readyToMove: string = '';  // For ready to move selection
  readyToMoveDate: string = '';  // For ready to move date selection

  @ViewChild('Form') addPropertyForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent;

  // Property Types from the data
  propertyTypes: Array<string> = ['House', 'Villa', 'Condo', 'Cabin', 'Cottage', 'Apartment', 
                                 'Mansion', 'Penthouse', 'Farm', 'Bungalow'];

  // Furnishing Types
  furnishTypes: Array<string> = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

  // Store selected property type and furnishing type
  selectedPropertyType: string = '';
  selectedFurnishingType: string = '';

  constructor(private location: Location) {}

  ngAfterViewInit() {
    // Update the progress after view initialization to ensure tabs are available
    this.updateProgress(0);
  }

  submitForm(): void {
    console.log('Property Name:', this.propertyName);
    console.log('Property Price:', this.propertyPrice);
    console.log('Property Type:', this.selectedPropertyType);
    console.log('Furnishing Type:', this.selectedFurnishingType);
  }

  goBack(): void {
    this.location.back();
  }

  selectedOption: string = '';
  onBhkSelect(bhk: number): void {
    this.selectedBhk = bhk;
    console.log('Selected BHK:', bhk); // Optional: you can use this value for further logic
  }

  onSubmit(Form: NgForm): void {
    if (Form.valid) {
      console.log('Congrats! Form Submitted');
      console.log(this.addPropertyForm.value);
      // Add backend call here to submit the data
    } else {
      console.log('Form is invalid');
    }
  }
  mainEntrance: string = '';

  selectTab(tabId: number): void {
    this.formTabs.tabs[tabId].active = true;
    this.updateProgress(tabId);
  }

  updateProgress(tabId: number): void {
    const totalTabs = this.formTabs.tabs.length;
    this.progress = ((tabId + 1) / totalTabs) * 100;
  }
}
