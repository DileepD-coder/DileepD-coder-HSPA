import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IPropertybase } from '../../models/IPropertybase';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PropertyCardComponent] // Add ReactiveFormsModule here
 // Add ReactiveFormsModule here
 // Add ReactiveFormsModule here
})
export class PropertyListComponent implements OnInit {
  propertyForm: FormGroup;
  properties: IPropertybase[] = [];
  filteredProperties: IPropertybase[] = [];

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService,
    private fb: FormBuilder
  ) {
    this.propertyForm = this.fb.group({
      SellRent: [1, Validators.required],  // Default value for SellRent
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      // Set the SellRent value based on the route, simplified
      this.propertyForm.setValue({
        SellRent: urlSegments[0]?.path === 'rent-property' ? 2 : 1,
      });
      this.loadProperties();
    });
  }

  loadProperties(): void {
    this.housingService.getAllProperties().subscribe(
      (data: IPropertybase[]) => {
        // Modify the properties mapping to ensure all required fields are present
        this.properties = data.map(property => ({
          Id: property.Id,
          SellRent: property.SellRent,
          Name: property.Name,
          PType: property.PType,
          Type: property.PType || '',
          Price: property.Price,
          ImageUrl: property.ImageUrl,
          FType: property.FType || '',
          BHK: property.BHK || 0,
          BuiltArea: property.BuiltArea || 0,
          City: property.City || '',
          RTM: (property as any).RTM === 1 || (property as any).Posession === 'Ready to move' ? 1 : 0,
          Address: property.Address || '',
          Landmark: property.Landmark || '',
          Floor: property.Floor || 0,
          TotalFloors: property.TotalFloors || 0,
          Age: property.Age || 0,
          Description: property.Description || ''
        }));
  
        // Apply the filter based on the SellRent form control value
        this.filteredProperties = this.properties.filter(
          property => property.SellRent === this.propertyForm.get('SellRent')?.value
        );
  
        console.log('Filtered Properties:', this.filteredProperties);
      },
      error => {
        console.error('Error fetching properties:', error);
      }
    );
  }
}