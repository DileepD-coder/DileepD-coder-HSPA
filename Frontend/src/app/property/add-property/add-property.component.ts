import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IPropertybase } from '../../models/IPropertybase';
import { AlertfyService } from '../../Services/alertfy.service';
import { Property } from '../../models/property';
import { HousingService } from '../../Services/housing.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  @ViewChild('formTabs') formTabs!: TabsetComponent;

  addPropertyForm!: FormGroup;
  propertySubmitted: Property = new Property();
  possessionDate: Date | undefined;

  // Fields for List Property card
  propertyTypes: string[] = ['House', 'Villa', 'Condo', 'Cabin', 'Cottage', 'Apartment', 'Mansion', 'Penthouse', 'Farm', 'Bungalow'];
  furnishTypes: string[] = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

  // Datepicker configuration
  bsConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-green',
    showWeekNumbers: false,
    minDate: new Date()
  };

  progress: number = 0;
  loading: boolean = false;
  hideIcons: boolean = true;

  // The preview property
  propertyview: IPropertybase = {
    Id: 0,
    SellRent: null,
    Name: '',
    PType: '',
    FType: '',
    Price: null,
    BHK: 0,
    BuiltArea: 0,
    City: '',
    RTM: 0,
    ImageUrl: '',
    Address: '',
    Landmark: '',
    Floor: 0,
    TotalFloors: 0,
    Age: 0,
    Description: '',
    Type: ''
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private alertify: AlertfyService,
    private housingService: HousingService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.addPropertyForm = this.fb.group({
      basicInfo: this.fb.group({
        SellRent: [null, Validators.required],
        BHK: [null, Validators.required],
        PType: ['', Validators.required],
        FType: ['', Validators.required],
        Name: ['', [Validators.required, Validators.minLength(5)]],
        City: ['', Validators.required]
      }),
      pricingInfo: this.fb.group({
        Price: [null, [Validators.required, Validators.min(0)]],
        BuiltArea: [null, [Validators.required, Validators.min(0)]],
        CarpetArea: [null, [Validators.required, Validators.min(0)]]
      }, { updateOn: 'blur' }),
      addressInfo: this.fb.group({
        Address: ['', Validators.required],
        Landmark: ['', Validators.required],
        Floor: [null, [Validators.required, Validators.min(1)]],
        TotalFloors: [null, [Validators.required, Validators.min(1)]]
      }, { updateOn: 'blur' }),
      otherInfo: this.fb.group({
        RTM: [null, Validators.required],
        PossessionDate: [null],
        Age: [null],
        GatedCommunity: [null, Validators.required],
        MainEntrance: ['', Validators.required],
        Description: ['']
      }, { updateOn: 'blur' })
    });

    // Add conditional validation for Age and PossessionDate based on RTM
    this.addPropertyForm.get('otherInfo.RTM')?.valueChanges.subscribe(value => {
      const ageControl = this.addPropertyForm.get('otherInfo.Age');
      const possessionDateControl = this.addPropertyForm.get('otherInfo.PossessionDate');
      
      if (value === 'yes') {
        ageControl?.setValidators([Validators.required, Validators.min(0)]);
        possessionDateControl?.clearValidators();
        possessionDateControl?.setValue(null);
      } else if (value === 'no') {
        possessionDateControl?.setValidators([Validators.required]);
        ageControl?.clearValidators();
        ageControl?.setValue(null);
      }
      
      ageControl?.updateValueAndValidity();
      possessionDateControl?.updateValueAndValidity();
    });
  }

  ngAfterViewInit() {
    // Subscribe to form value changes to update preview
    this.addPropertyForm.valueChanges.subscribe(() => {
      this.updatePreview();
    });
  }

  updatePreview(): void {
    const basicInfo = this.addPropertyForm.get('basicInfo')?.value;
    const pricingInfo = this.addPropertyForm.get('pricingInfo')?.value;
    const addressInfo = this.addPropertyForm.get('addressInfo')?.value;
    const otherInfo = this.addPropertyForm.get('otherInfo')?.value;

    if (basicInfo) {
      this.propertyview = {
        ...this.propertyview,
        ...basicInfo,
        Price: pricingInfo?.Price,
        BuiltArea: pricingInfo?.BuiltArea,
        Address: addressInfo?.Address,
        Landmark: addressInfo?.Landmark,
        Floor: addressInfo?.Floor,
        TotalFloors: addressInfo?.TotalFloors,
        RTM: otherInfo?.RTM === 'yes' ? 1 : 0,
        Age: otherInfo?.Age,
        Description: otherInfo?.Description
      };
    }
    this.loading = false;
  }

  onSubmit() {
    if (this.addPropertyForm.invalid) {
      // Find the first invalid group
      const groups = ['basicInfo', 'pricingInfo', 'addressInfo', 'otherInfo'];
      for (let i = 0; i < groups.length; i++) {
        const group = this.addPropertyForm.get(groups[i]);
        if (group?.invalid) {
          // Switch to the tab with invalid fields
          this.selectTab(i);
          this.markFormGroupTouched(group as FormGroup);
          this.alertify.error('Please complete all required fields in ' + groups[i].replace('Info', ''));
          return;
        }
      }
    }
    
    // Map form values to property object
    this.mapProperty();
    
    // Add property using housing service and handle navigation
    const propertyObservable = this.housingService.addProperty(this.propertySubmitted);
    propertyObservable.subscribe({
      next: (addedProperty: Property) => {
        console.log('Property added successfully:', addedProperty);
        this.alertify.success('Congrats, your property has been listed!');
        
        const sellRent = addedProperty.SellRent;
        if (sellRent === 1) {
          this.router.navigate(['/buy']);
        } else if (sellRent === 2) {
          this.router.navigate(['/rent-property']);
        }
      },
      error: (error: Error) => {
        console.error('Error adding property:', error);
        this.alertify.error('There was an error adding your property. Please try again.');
      }
    });
  }

  mapProperty(): void {
    const basicInfo = this.addPropertyForm.get('basicInfo')?.value;
    const pricingInfo = this.addPropertyForm.get('pricingInfo')?.value;
    const addressInfo = this.addPropertyForm.get('addressInfo')?.value;
    const otherInfo = this.addPropertyForm.get('otherInfo')?.value;

    this.propertySubmitted = new Property();
    this.propertySubmitted.SellRent = +basicInfo.SellRent;
    this.propertySubmitted.BHK = +basicInfo.BHK;
    this.propertySubmitted.PType = basicInfo.PType;
    this.propertySubmitted.Name = basicInfo.Name;
    this.propertySubmitted.City = basicInfo.City;
    this.propertySubmitted.FType = basicInfo.FType;
    this.propertySubmitted.Price = +pricingInfo.Price;
    this.propertySubmitted.BuiltArea = +pricingInfo.BuiltArea;
    this.propertySubmitted.CarpetArea = +pricingInfo.CarpetArea;
    this.propertySubmitted.Floor = +addressInfo.Floor;
    this.propertySubmitted.TotalFloors = +addressInfo.TotalFloors;
    this.propertySubmitted.Address = addressInfo.Address;
    this.propertySubmitted.Landmark = addressInfo.Landmark;
    this.propertySubmitted.RTM = otherInfo.RTM === 'yes' ? 1 : 0;
    this.propertySubmitted.Age = otherInfo.RTM === 'yes' ? +otherInfo.Age : 0;
    this.propertySubmitted.PossessionDate = otherInfo.RTM === 'no' ? otherInfo.PossessionDate : null;
    this.propertySubmitted.GatedCommunity = otherInfo.GatedCommunity;
    this.propertySubmitted.MainEntrance = otherInfo.MainEntrance;
    this.propertySubmitted.Description = otherInfo.Description;
    this.propertySubmitted.PostedOn = new Date().toString();
  }

  selectTab(tabId: number): void {
    // Get the current form group
    const currentTabIndex = this.formTabs?.tabs.findIndex(t => t.active) ?? 0;
    const currentGroup = this.getFormGroupForTab(currentTabIndex);
    
    // If we're going back, don't validate
    if (tabId < currentTabIndex) {
      if (this.formTabs?.tabs[tabId]) {
        this.formTabs.tabs[tabId].active = true;
        this.updateProgress(tabId);
      }
      return;
    }

    // If we're going forward, validate the current tab
    if (currentGroup && currentGroup.invalid) {
      this.markFormGroupTouched(currentGroup);
      this.alertify.error('Please complete all required fields in the current tab.');
      return;
    }
    
    // If validation passes, switch to the next tab
    if (this.formTabs?.tabs[tabId]) {
      this.formTabs.tabs[tabId].active = true;
      this.updateProgress(tabId);
    }
  }

  private getFormGroupForTab(tabId: number): FormGroup | null {
    const formGroups = {
      0: 'basicInfo',
      1: 'pricingInfo',
      2: 'addressInfo',
      3: 'otherInfo'
    };
    
    const groupName = formGroups[tabId as keyof typeof formGroups];
    return groupName ? this.addPropertyForm.get(groupName) as FormGroup : null;
  }

  updateProgress(tabId: number): void {
    // We have 5 tabs (0-4), so calculate progress as current tab + 1 / total tabs * 100
    const totalTabs = 5; // Basic Info, Pricing & Area, Address, Other Details, Photos
    this.progress = ((tabId + 1) / totalTabs) * 100;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const files: FileList = event.target.files;
      console.log('Selected files:', files);
    }
  }

  goBack(): void {
    this.location.back();
  }

  onFurnishSelect(furnish: string) {
    this.addPropertyForm.get('otherInfo.furnish')?.setValue(furnish);
    this.updatePreview();
  }
}
