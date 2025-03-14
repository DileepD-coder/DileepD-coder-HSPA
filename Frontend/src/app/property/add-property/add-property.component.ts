import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IPropertybase } from '../../models/IPropertybase';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ButtonsModule,
    BsDatepickerModule,
    PropertyCardComponent
  ],
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements AfterViewInit {
  @Input() property: IPropertybase | null = null;

  // Fields for List Property card
  selectedBhk: number | null = null;
  possessionDate: Date | undefined;
  selectedPropertyType: string = '';
  selectedFurnishingType: string = '';  // The selected furnishing type
  selectedOption: string = '';
  selectedCity: string = ''; // City selection
  selectedBuiltArea: number | null = null; // Built Area selection

  binding: string = '';  // Binding variable for "in Building/Society/Project" field

  // Datepicker configuration
  bsConfig = {
    dateInputFormat: 'MM/DD/YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-green'
  };

  progress: number = 0;
  gatedCommunity: string = '';
  readyToMove: string = '';
  readyToMoveDate: string = '';

  @ViewChild('Form') addPropertyForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent;

  propertyTypes: string[] = ['House', 'Villa', 'Condo', 'Cabin', 'Cottage', 'Apartment', 'Mansion', 'Penthouse', 'Farm', 'Bungalow'];
  furnishTypes: string[] = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

  // The preview property – initialize with default values so it always conforms to IPropertybase.
  propertyview: IPropertybase = {
    Id: 0,
    SellRent: 0,
    Name: '',
    PType: '',
    FType: '',  // Furnishing type in preview
    Price: null,
    BHK: 0,
    BuiltArea: 0,
    City: '',
    RTM: 0,
    ImageUrl: '',
    Type: ''
  };

  // Loading flag for preview
  loading: boolean = false;
  hideIcons: boolean = true;

  constructor(private location: Location) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateProgress(0);
    });
  }
  

  // Update preview method after each change
  updatePreview(): void {
    this.propertyview.Name = this.binding;

    if (this.selectedBhk) {
      this.propertyview.BHK = this.selectedBhk;
    }

    if (this.selectedPropertyType) {
      this.propertyview.PType = this.selectedPropertyType;
    }

    if (this.selectedFurnishingType) {
      this.propertyview.FType = this.selectedFurnishingType;  // Update furnishing type in the preview
    }

    if (this.selectedOption) {
      this.propertyview.RTM = this.selectedOption === 'Ready to Move' ? 1 : 0;
    }

    if (this.selectedCity) {
      this.propertyview.City = this.selectedCity;
    }

    if (this.selectedBuiltArea !== null) {
      this.propertyview.BuiltArea = this.selectedBuiltArea;
    }

    this.loading = false;
  }

  // Method to update furnishing type
  updateFurnishing(furnishing: string): void {
    this.selectedFurnishingType = furnishing;
    this.propertyview.FType = furnishing;  // Update propertyview's furnishing type
    this.updatePreview();  // Ensure the preview is updated with the new furnishing type
 
 
  }
  

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.updatePreview();
  }

  onBuiltAreaChange(area: number): void {
    this.selectedBuiltArea = area;
    this.updatePreview();
  }

  submitForm(): void {
    console.log('Property Type:', this.selectedPropertyType);
    console.log('Furnishing Type:', this.selectedFurnishingType);
    console.log('City:', this.selectedCity);
    console.log('Built Area:', this.selectedBuiltArea);
  }

  goBack(): void {
    this.location.back();
  }

  onBhkSelect(bhk: number): void {
    if (this.propertyview.BHK !== bhk) {  // Prevent unnecessary updates
      this.selectedBhk = bhk;
      this.propertyview.BHK = bhk;  // Update BHK only if it's different
      this.updatePreview();  // Ensure preview is updated only once
    }
  }
  

  onSubmit(Form: NgForm): void {
    if (Form.valid) {
      console.log('Congrats! Form Submitted');
      console.log(this.addPropertyForm.value);
      console.log('Possession Date:', this.possessionDate);
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
