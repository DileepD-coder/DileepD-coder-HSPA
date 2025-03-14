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
  selectedFurnishingType: string = '';
  selectedOption: string = '';

  binding: string = '';  // Binding variable for "in Building/Socity/Project" field

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
    FType: '',
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
    this.updateProgress(0);
  }

  // Called when user types in the binding input
  updatePreview(): void {
    this.propertyview.Name = this.binding;
  
    if (this.binding.trim().toLowerCase() === 'sunny villa') {
      // Update preview with all details
      this.propertyview = {
        Id: 1,
        SellRent: 1,
        Name: "Sunny Villa",
        PType: "House",
        FType: "Semi Furnished",
        Price: 12000,
        BHK: 3,
        BuiltArea: 2000,
        City: 'New York',
        RTM: 1,
        ImageUrl: "img1.jpg",
        Type: "House"
      };
      this.loading = false;
    } else {
      this.loading = true;
    }
  }
  
  submitForm(): void {
    console.log('Property Type:', this.selectedPropertyType);
    console.log('Furnishing Type:', this.selectedFurnishingType);
  }

  goBack(): void {
    this.location.back();
  }

  onBhkSelect(bhk: number): void {
    this.selectedBhk = bhk;
    console.log('Selected BHK:', bhk);
  }

  onSubmit(Form: NgForm): void {
    if (Form.valid) {
      console.log('Congrats! Form Submitted');
      console.log(this.addPropertyForm.value);
      console.log('Possession Date:', this.possessionDate);
      // Add backend submission logic here
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
