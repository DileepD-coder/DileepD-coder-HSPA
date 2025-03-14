import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { IPropertybase } from '../../models/IPropertybase';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,
  imports: [CommonModule, PropertyCardComponent]
})
export class PropertyListComponent implements OnInit {
  SellRent: number = 1; // Default to "Buy"
  properties: IPropertybase[] = [];
  filteredProperties: IPropertybase[] = [];

  constructor(
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.SellRent = urlSegments[0]?.path === 'rent-property' ? 2 : 1;
      this.loadProperties();
    });
  }

  loadProperties(): void {
    this.housingService.getAllProperties().subscribe(
      (data: IPropertybase[]) => {
        // Ensure all required fields are included
        this.properties = data.map(property => ({
          Id: property.Id,
          SellRent: property.SellRent,
          Name: property.Name,
          PType: property.PType,         
          Type: property.PType || '',    
          Price: property.Price,
          ImageUrl: property.ImageUrl,
          FType: property.FType || '',        // ✅ Ensure all required properties are included
          BHK: property.BHK || 0,             // ✅ Provide default values if missing
          BuiltArea: property.BuiltArea || 0, // ✅
          City: property.City || '',          // ✅
          RTM: property.RTM || 0              // ✅
        }));

        // Filter properties based on SellRent value
        this.filteredProperties = this.properties.filter(
          property => property.SellRent === this.SellRent
        );

        console.log('Filtered Properties:', this.filteredProperties);
      },
      error => {
        console.error('Error fetching properties:', error);
      }
    );
  }
}
