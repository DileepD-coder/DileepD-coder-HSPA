import { Component, OnInit } from '@angular/core';
import { HousingService } from '../../Services/housing.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IPropertybase } from '../../models/IPropertybase';  // Use the base interface
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-rent-property',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PropertyCardComponent],
  templateUrl: './rent-property.component.html',
  styleUrls: ['./rent-property.component.css']
})
export class RentPropertyComponent implements OnInit {
  rentProperties: IPropertybase[] = [];

  constructor(private housingService: HousingService) {}

  ngOnInit(): void {
    this.loadRentProperties();
  }

  loadRentProperties(): void {
    this.housingService.getAllProperties().subscribe(
      (data: IPropertybase[]) => {
        // Filter properties with SellRent === 2 (rent)
        this.rentProperties = data.filter((property) => property.SellRent === 2);
        console.log('Rent Properties:', this.rentProperties);
      },
      (error: any) => {
        console.error('Error fetching rent properties:', error);
      }
    );
  }
}
