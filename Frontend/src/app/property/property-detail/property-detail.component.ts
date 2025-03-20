import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { IPropertybase } from '../../models/IPropertybase';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number | null = null;
  propertyType: string | null = null;
  property: IPropertybase | null = null;
  properties: IPropertybase[] = [];
  currentIndex: number = 0;
  filteredProperties: IPropertybase[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.propertyId = id ? +id : null;
      this.propertyType = this.route.snapshot.queryParamMap.get('type');

      if (this.propertyId) {
        this.loadPropertyDetails();
      }
    });
  }

  loadPropertyDetails(): void {
    this.housingService.getAllProperties().subscribe({
      next: (data: IPropertybase[]) => {
        this.properties = data;
        this.filterPropertiesByType();
        this.setCurrentIndex();
        this.property = this.filteredProperties[this.currentIndex];
      },
      error: (error) => {
        console.error('Error loading property details:', error);
      }
    });
  }

  filterPropertiesByType(): void {
    if (this.propertyType) {
      this.filteredProperties = this.properties.filter(p => 
        p.SellRent === (this.propertyType === 'rent' ? 2 : 1)
      );
    } else {
      this.filteredProperties = this.properties;
    }
  }

  setCurrentIndex(): void {
    if (this.propertyId !== null) {
      const propertyIndex = this.filteredProperties.findIndex(p => p.Id === this.propertyId);
      this.currentIndex = propertyIndex >= 0 ? propertyIndex : 0;
    }
  }

  goToPrevProperty(): void {
    if (this.hasPrevProperty()) {
      this.currentIndex--;
      this.navigateToProperty(this.filteredProperties[this.currentIndex].Id);
    }
  }

  goToNextProperty(): void {
    if (this.hasNextProperty()) {
      this.currentIndex++;
      this.navigateToProperty(this.filteredProperties[this.currentIndex].Id);
    }
  }

  hasPrevProperty(): boolean {
    return this.currentIndex > 0;
  }

  hasNextProperty(): boolean {
    return this.currentIndex < this.filteredProperties.length - 1;
  }

  navigateToProperty(propertyId: number): void {
    this.router.navigate(['/property-detail', propertyId], {
      queryParams: { type: this.propertyType }
    });
  }
}
