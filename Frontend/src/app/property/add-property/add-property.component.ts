import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { IProperty } from '../IProperty.interface';

@Component({
    selector: 'app-add-property',
    standalone: true,
    imports: [CommonModule, FormsModule, TabsModule, ButtonsModule, BsDatepickerModule],
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements AfterViewInit {
    @Input() property!: IProperty;

    propertyName: string = '';
    propertyPrice: number = 0;
    progress: number = 0;
    selectedBhk: number | null = null;
    possessionDate: Date | undefined; // Add this line
    
    bsConfig = {
        dateInputFormat: 'MM/DD/YYYY', // Ensure correct date format
        showWeekNumbers: false,
        containerClass: 'theme-green'
      };
      

    gatedCommunity: string = '';
    readyToMove: string = '';
    readyToMoveDate: string = '';

    @ViewChild('Form') addPropertyForm!: NgForm;
    @ViewChild('formTabs') formTabs!: TabsetComponent;

    propertyTypes: Array<string> = ['House', 'Villa', 'Condo', 'Cabin', 'Cottage', 'Apartment',
        'Mansion', 'Penthouse', 'Farm', 'Bungalow'];

    furnishTypes: Array<string> = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

    selectedPropertyType: string = '';
    selectedFurnishingType: string = '';

    constructor(private location: Location) { }

    ngAfterViewInit() {
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
        console.log('Selected BHK:', bhk);
    }

    onSubmit(Form: NgForm): void {
        if (Form.valid) {
            console.log('Congrats! Form Submitted');
            console.log(this.addPropertyForm.value);
            console.log('Possession Date:', this.possessionDate); // Log the selected date
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