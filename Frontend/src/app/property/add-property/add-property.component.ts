import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IProperty } from '../IProperty.interface';

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
  @Input() property: IProperty | null = null;

  // Fields for List Property card
  // (You may remove propertyName since we now use binding)
  // propertyName: string = '';
  //propertyPrice: number = 0;
  selectedBhk: number | null = null;
  possessionDate: Date | undefined;
  selectedPropertyType: string = '';
  selectedFurnishingType: string = '';
  selectedOption: string = '';

  // This is the binding variable for the "in Building/Socity/Project" field.
  binding: string = '';

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

  // The preview property – initialize with default values so it always conforms to IProperty.
  propertyview: IProperty = {
    Id: 0,
    SellRent: 0,
    Name: '',
    Type: '',
    Price: null,  // Change from 0 to null
    ImageUrl: ''
  };

  // Loading flag for preview (if needed; here we set it false for live preview)
  loading: boolean = false;

  constructor(private location: Location) { }

  ngAfterViewInit() {
    this.updateProgress(0);
  }

  // Called whenever the user types in the binding input
  updatePreview(): void {
    // Update the preview property name to the entered binding value.
    this.propertyview.Name = this.binding;
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
