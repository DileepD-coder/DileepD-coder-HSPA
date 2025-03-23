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
      const sellRent = urlSegments[0]?.path === 'rent-property' ? 2 : 1;
      this.propertyForm.setValue({
        SellRent: sellRent
      });
      this.loadProperties(sellRent);
    });
  }

  loadProperties(sellRent: number): void {
    console.log('Loading properties for SellRent:', sellRent);
    
    this.housingService.getAllProperties(sellRent).subscribe({
      next: (data: IPropertybase[]) => {
        console.log('Received properties:', data);
        
        this.properties = data;
        this.filteredProperties = this.properties;
        
        console.log('Properties loaded:', {
          total: this.properties.length,
          sellRent: sellRent,
          propertyIds: this.properties.map(p => p.Id)
        });
      },
      error: error => {
        console.error('Error fetching properties:', error);
      }
    });
  }
}