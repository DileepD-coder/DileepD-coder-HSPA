import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { IProperty } from '../IProperty.interface';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,
  imports: [CommonModule, PropertyCardComponent]
})
export class PropertyListComponent implements OnInit {
  SellRent: number = 1; // Default to "Buy"
  properties: IProperty[] = [];
  filteredProperties: IProperty[] = [];

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
      (data: IProperty[]) => {
        // Map each property so that it includes the required "PType" property.
        // We assume the incoming data has a property PType.
        this.properties = data.map(property => ({
          Id: property.Id,
          SellRent: property.SellRent,
          Name: property.Name,
          PType: property.PType,          // Added to satisfy the interface
          Type: property.PType || '',       // For display purposes, we set Type equal to PType
          Price: property.Price,
          ImageUrl: property.ImageUrl
        }));

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
