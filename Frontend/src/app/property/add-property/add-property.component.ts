import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IPropertybase } from '../../models/IPropertybase';
import { AlertfyService } from '../../Services/alertfy.service';

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
    private alertify: AlertfyService
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
        Security: [null, [Validators.required, Validators.min(0)]],
        Maintenance: [null, [Validators.required, Validators.min(0)]],
        BuiltArea: [null, [Validators.required, Validators.min(0)]],
        CarpetArea: [null, [Validators.required, Validators.min(0)]]
      }),
      addressInfo: this.fb.group({
        Address: ['', Validators.required],
        Landmark: ['', Validators.required],
        Floor: [null, [Validators.required, Validators.min(1)]],
        TotalFloors: [null, [Validators.required, Validators.min(1)]]
      }),
      otherInfo: this.fb.group({
        RTM: [null, Validators.required],
        PossessionDate: [null],
        Age: [null, [Validators.required, Validators.min(0)]],
        GatedCommunity: [null, Validators.required],
        MainEntrance: ['', Validators.required],
        Description: ['']
      })
    });

    // Add conditional validation for possession date
    this.addPropertyForm.get('otherInfo.RTM')?.valueChanges.subscribe(value => {
      const possessionDateControl = this.addPropertyForm.get('otherInfo.PossessionDate');
      if (value === 'no') {
        possessionDateControl?.setValidators([Validators.required]);
      } else {
        possessionDateControl?.clearValidators();
      }
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

  onSubmit(): void {
    // Log validation status of each form group
    const basicInfo = this.addPropertyForm.get('basicInfo') as FormGroup;
    const pricingInfo = this.addPropertyForm.get('pricingInfo') as FormGroup;
    const addressInfo = this.addPropertyForm.get('addressInfo') as FormGroup;
    const otherInfo = this.addPropertyForm.get('otherInfo') as FormGroup;

    console.log('Basic Info validation:', {
      valid: basicInfo?.valid,
      errors: basicInfo?.errors,
      controls: Object.keys(basicInfo?.controls || {}).map(key => ({
        key,
        valid: basicInfo?.get(key)?.valid,
        errors: basicInfo?.get(key)?.errors
      }))
    });

    console.log('Pricing Info validation:', {
      valid: pricingInfo?.valid,
      errors: pricingInfo?.errors,
      controls: Object.keys(pricingInfo?.controls || {}).map(key => ({
        key,
        valid: pricingInfo?.get(key)?.valid,
        errors: pricingInfo?.get(key)?.errors
      }))
    });

    console.log('Address Info validation:', {
      valid: addressInfo?.valid,
      errors: addressInfo?.errors,
      controls: Object.keys(addressInfo?.controls || {}).map(key => ({
        key,
        valid: addressInfo?.get(key)?.valid,
        errors: addressInfo?.get(key)?.errors
      }))
    });

    console.log('Other Info validation:', {
      valid: otherInfo?.valid,
      errors: otherInfo?.errors,
      controls: Object.keys(otherInfo?.controls || {}).map(key => ({
        key,
        valid: otherInfo?.get(key)?.valid,
        errors: otherInfo?.get(key)?.errors
      }))
    });

    if (this.addPropertyForm.invalid) {
      this.alertify.error('Please fill out all required fields correctly!');
      this.markFormGroupTouched(this.addPropertyForm);
      return;
    }

    console.log('Form Data:', this.addPropertyForm.value);
    this.alertify.success('Property added successfully!');
  }

  selectTab(tabId: number): void {
    // Only validate the first tab (Basic Info)
    if (tabId === 1) {  // When moving from first to second tab
      const basicInfoGroup = this.addPropertyForm.get('basicInfo') as FormGroup;
      
      if (basicInfoGroup && basicInfoGroup.invalid) {
        Object.values(basicInfoGroup.controls).forEach(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
        });
        this.alertify.error('Please complete all required fields in Basic Info.');
        return;
      }
    }
    
    // Allow navigation for all other tabs and update progress
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
        control.updateValueAndValidity();
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
}
