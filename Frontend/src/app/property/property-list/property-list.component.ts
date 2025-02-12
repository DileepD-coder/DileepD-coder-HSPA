import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { HttpClientModule } from '@angular/common/http';
import { HousingService } from '../../Services/housing.service';
import { IProperty } from '../IProperty.interface';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, HttpClientModule],
})
export class PropertyListComponent implements OnInit {
  properties: Array<IProperty> = [];

  constructor(private housingService: HousingService) {}

  ngOnInit(): void {
    // Correct method name: getAllProperties()
    this.housingService.getAllProperties().subscribe(
      (data: any) => {  // Specify type for data
        this.properties = data;
      },
      (error: any) => {  // Specify type for error
        console.error('Error fetching properties:', error);
      }
    );
  }
}
