import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { HttpClientModule } from '@angular/common/http';
import { HousingService } from '../../Services/housing.service';
import { IProperty } from '../IProperty.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, HttpClientModule, RouterModule], 
})
export class PropertyListComponent implements OnInit {
  properties: IProperty[] = [];

  constructor(private housingService: HousingService) {}

  ngOnInit(): void {
    this.housingService.getAllProperties().subscribe(
      (data: any) => {
        // Map 'Id' to 'id' to prevent undefined values
        this.properties = data.map((property: any) => ({
          id: property.Id,  // ✅ Fixing case issue
          Name: property.Name,
          Type: property.Type,
          Price: property.Price
        }));
      },
      (error: any) => {
        console.error('Error fetching properties:', error);
      }
    );
  }
}
