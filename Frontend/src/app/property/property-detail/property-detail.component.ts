import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { IPropertybase } from '../../models/IPropertybase';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    GalleryModule
  ],
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
  galleryItems: GalleryItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {
    // Get property ID from route
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.propertyType = this.route.snapshot.queryParamMap.get('type');
    
    console.log('Property ID:', this.propertyId);
    console.log('Property Type:', this.propertyType);

    // Load property data
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route Data:', data);
        this.property = data['property'];
        console.log('Loaded Property:', this.property);
        
        if (this.property && this.property.Id !== 0) {
          this.galleryItems = this.getPropertyImages();
          console.log('Gallery Items:', this.galleryItems);
        } else {
          console.error('Invalid property data received');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.router.navigate(['/']);
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

  getPropertyImages(): GalleryItem[] {
    const images: GalleryItem[] = [];
    
    try {
      if (this.property) {
        // Add main photo if exists
        if (this.property.ImageUrl) {
          images.push(new ImageItem({
            src: 'assets/Hou/' + this.property.ImageUrl,
            thumb: 'assets/Hou/' + this.property.ImageUrl
          }));
        }

        // Add additional photos if they exist
        if (this.property.Photos && Array.isArray(this.property.Photos)) {
          this.property.Photos.forEach(photo => {
            if (photo) {
              images.push(new ImageItem({
                src: 'assets/Hou/' + photo,
                thumb: 'assets/Hou/' + photo
              }));
            }
          });
        }

        // If no images available, add a default image
        if (images.length === 0) {
          images.push(new ImageItem({
            src: 'assets/images/house_image.jpg',
            thumb: 'assets/images/house_image.jpg'
          }));
        }
      }
    } catch (error) {
      console.error('Error processing property images:', error);
      return [new ImageItem({
        src: 'assets/images/house_image.jpg',
        thumb: 'assets/images/house_image.jpg'
      })];
    }

    return images;
  }
}
