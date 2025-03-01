import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs'; // Import TabsModule

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule, TabsModule], // Include TabsModule here
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements AfterViewInit {
  propertyName: string = '';
  propertyPrice: number = 0;
  progress: number = 0;

  // Initialized properties
  gatedCommunity: string = '';  // For gated community selection
  readyToMove: string = '';  // For ready to move selection
  readyToMoveDate: string = '';  // For ready to move date selection

  @ViewChild('Form') addPropertyForm!: NgForm;
  @ViewChild('formTabs') formTabs!: TabsetComponent;

  constructor(private location: Location) {}

  ngAfterViewInit() {
    // Update the progress after view initialization to ensure tabs are available
    this.updateProgress(0);
  }

  submitForm(): void {
    console.log('Property Name:', this.propertyName);
    console.log('Property Price:', this.propertyPrice);
  }

  goBack(): void {
    this.location.back();
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

  selectTab(tabId: number): void {
    this.formTabs.tabs[tabId].active = true;
    this.updateProgress(tabId);
  }

  updateProgress(tabId: number): void {
    const totalTabs = this.formTabs.tabs.length;
    this.progress = ((tabId + 1) / totalTabs) * 100;
  }
}
