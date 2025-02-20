import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  properties: { id: number, SellRent: number }[] = [
    { id: 1, SellRent: 1 }, { id: 2, SellRent: 1 }, { id: 3, SellRent: 2 },
    { id: 4, SellRent: 1 }, { id: 5, SellRent: 2 }, { id: 6, SellRent: 1 },
    { id: 7, SellRent: 2 }, { id: 8, SellRent: 1 }, { id: 9, SellRent: 2 },
    { id: 10, SellRent: 1 }, { id: 11, SellRent: 1 }, { id: 12, SellRent: 2 },
    { id: 13, SellRent: 2 }, { id: 14, SellRent: 1 }, { id: 15, SellRent: 2 },
    { id: 16, SellRent: 1 }, { id: 17, SellRent: 2 }, { id: 18, SellRent: 2 },
    { id: 19, SellRent: 1 }, { id: 20, SellRent: 1 }, { id: 21, SellRent: 2 },
    { id: 22, SellRent: 2 }, { id: 23, SellRent: 1 }, { id: 24, SellRent: 2 },
    { id: 25, SellRent: 1 }, { id: 26, SellRent: 1 }, { id: 27, SellRent: 2 },
    { id: 28, SellRent: 2 }, { id: 29, SellRent: 1 }, { id: 30, SellRent: 2 },
    { id: 31, SellRent: 1 }, { id: 32, SellRent: 1 }, { id: 33, SellRent: 2 },
    { id: 34, SellRent: 2 }, { id: 35, SellRent: 1 }, { id: 36, SellRent: 2 },
    { id: 37, SellRent: 2 }, { id: 38, SellRent: 1 }, { id: 39, SellRent: 2 },
    { id: 40, SellRent: 1 }, { id: 41, SellRent: 2 }, { id: 42, SellRent: 1 },
    { id: 43, SellRent: 1 }, { id: 44, SellRent: 2 }, { id: 45, SellRent: 1 },
    { id: 46, SellRent: 2 }, { id: 47, SellRent: 1 }, { id: 48, SellRent: 2 },
    { id: 49, SellRent: 1 }, { id: 50, SellRent: 2 }
  ];

  currentIndex: number = 0;
  filteredProperties: { id: number, SellRent: number }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.propertyId = id ? +id : null;
      this.propertyType = this.route.snapshot.queryParamMap.get('type');

      this.filterPropertiesByType();
      this.setCurrentIndex();
      
      console.log("Property ID:", this.propertyId);
      console.log("Property Type:", this.propertyType);
      console.log("Filtered Properties:", this.filteredProperties);
    });
  }

  filterPropertiesByType(): void {
    if (this.propertyType) {
      this.filteredProperties = this.properties.filter(p => p.SellRent === (this.propertyType === 'rent' ? 2 : 1));
    } else {
      this.filteredProperties = [];
    }
  }

  setCurrentIndex(): void {
    if (this.propertyId !== null && this.propertyType) {
      const propertyIndex = this.filteredProperties.findIndex(p => p.id === this.propertyId);
      this.currentIndex = propertyIndex >= 0 ? propertyIndex : 0;
    }
  }

  goToPrevProperty(): void {
    if (this.hasPrevProperty()) {
      this.currentIndex--;
      this.navigateToProperty(this.filteredProperties[this.currentIndex].id);
    }
  }

  goToNextProperty(): void {
    if (this.hasNextProperty()) {
      this.currentIndex++;
      this.navigateToProperty(this.filteredProperties[this.currentIndex].id);
    }
  }

  hasPrevProperty(): boolean {
    return this.currentIndex > 0;
  }

  hasNextProperty(): boolean {
    return this.currentIndex < this.filteredProperties.length - 1;
  }

  navigateToProperty(propertyId: number): void {
    this.router.navigate(['/property-detail', propertyId], { queryParams: { type: this.propertyType } });
  }
}
