import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../Services/housing.service';
import { IPropertybase } from '../../models/IPropertybase';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabsModule,
    CarouselModule,
    FormsModule
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  // Add Math property
  Math = Math;
  
  propertyId: number | null = null;
  propertyType: string | null = null;
  property: IPropertybase | null = null;
  properties: IPropertybase[] = [];
  filteredProperties: IPropertybase[] = [];
  currentIndex: number = 0;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  pages: number[] = [];
  
  // Carousel properties
  slides: any[] = [];
  myInterval = 4000;
  activeSlideIndex = 0;
  itemsPerSlide = 3;
  singleSlideOffset = true;
  noWrap = false;
  fullscreenImage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private housingService: HousingService
  ) {}

  ngOnInit(): void {
    // Get property ID from route
    this.propertyId = Number(this.route.snapshot.params['id']);
    this.propertyType = this.route.snapshot.queryParamMap.get('type');
    
    // Load current property data
    this.route.data.subscribe({
      next: (data) => {
        this.property = data['property'];
        if (this.property && this.property.Id !== 0) {
          this.loadPropertyImages();
          // Load all properties after getting current property
          this.loadAllProperties();
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.router.navigate(['/']);
      }
    });
  }

  loadAllProperties() {
    // Determine SellRent value based on current property
    const sellRent = this.property?.SellRent ?? undefined;
    if (!sellRent) return;

    this.housingService.getAllProperties(sellRent).subscribe({
      next: (properties) => {
        // Log raw properties first
        console.log('Raw properties loaded:', {
          count: properties.length,
          sellRent: sellRent,
          propertyIds: properties.map(p => p.Id)
        });
        
        // Sort properties by Id
        this.properties = properties.sort((a, b) => a.Id - b.Id);
        this.filteredProperties = this.properties;
        this.totalItems = this.filteredProperties.length;
        
        // Find current property index after sorting
        if (this.property) {
          this.currentIndex = this.filteredProperties.findIndex(p => p.Id === this.property?.Id);
          this.currentPage = this.currentIndex + 1;
        }
        
        console.log('Final properties state:', {
          total: this.totalItems,
          currentIndex: this.currentIndex,
          currentPage: this.currentPage,
          propertyIds: this.filteredProperties.map(p => ({id: p.Id, sellRent: p.SellRent}))
        });
        
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  updatePagination() {
    if (this.property && this.filteredProperties.length > 0) {
      // Find the index of current property
      this.currentIndex = this.filteredProperties.findIndex(p => p.Id === this.property?.Id);
      
      // Calculate current page (1-based)
      this.currentPage = this.currentIndex + 1;
      
      // Calculate total pages based on total items
      const totalPages = this.filteredProperties.length;
      
      // Generate page numbers
      this.pages = this.generatePageNumbers(this.currentPage, totalPages);
      
      console.log('Pagination state:', {
        currentIndex: this.currentIndex,
        currentPage: this.currentPage,
        totalPages: totalPages,
        pages: this.pages,
        currentPropertyId: this.property.Id,
        allPropertyIds: this.filteredProperties.map(p => p.Id).join(', '),
        totalProperties: this.filteredProperties.length
      });
    }
  }

  generatePageNumbers(currentPage: number, totalPages: number): number[] {
    console.log('Generating pages:', { currentPage, totalPages });
    
    const pages: number[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = currentPage - 2;
      let end = currentPage + 2;
      
      // Adjust range if near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = 6;
      }
      // Adjust range if near the end
      else if (currentPage >= totalPages - 2) {
        start = totalPages - 5;
        end = totalPages - 1;
      }
      
      // Ensure start and end are within bounds
      start = Math.max(2, start);
      end = Math.min(totalPages - 1, end);
      
      // Add ellipsis before if needed
      if (start > 2) {
        pages.push(-1);
      }
      
      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after if needed
      if (end < totalPages - 1) {
        pages.push(-1);
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    console.log('Generated page numbers:', {
      currentPage,
      totalPages,
      pages: pages.join(', '),
      totalProperties: this.filteredProperties.length
    });
    
    return pages;
  }

  goToPage(page: number) {
    console.log('Attempting to go to page:', page);
    
    // Validate page number
    if (page < 1 || page > this.filteredProperties.length) {
      console.error('Invalid page number:', {
        requestedPage: page,
        totalPages: this.filteredProperties.length
      });
      return;
    }

    // Convert to 0-based index
    const index = page - 1;
    const targetProperty = this.filteredProperties[index];

    if (targetProperty) {
      console.log('Navigation details:', {
        requestedPage: page,
        index: index,
        targetPropertyId: targetProperty.Id,
        totalProperties: this.filteredProperties.length,
        currentPropertyId: this.property?.Id
      });

      this.router.navigate(['/property-detail', targetProperty.Id], {
        queryParams: { type: this.propertyType }
      });
    }
  }

  goToFirstPage() {
    const firstProperty = this.filteredProperties[0];
    if (firstProperty) {
      console.log('Going to first property:', firstProperty.Id);
      this.router.navigate(['/property-detail', firstProperty.Id], {
        queryParams: { type: this.propertyType }
      });
    }
  }

  goToLastPage() {
    const lastProperty = this.filteredProperties[this.filteredProperties.length - 1];
    if (lastProperty) {
      console.log('Going to last property:', lastProperty.Id);
      this.router.navigate(['/property-detail', lastProperty.Id], {
        queryParams: { type: this.propertyType }
      });
    }
  }

  goToPrevious() {
    const prevIndex = this.currentIndex - 1;
    if (prevIndex >= 0) {
      const prevProperty = this.filteredProperties[prevIndex];
      console.log('Previous navigation:', {
        currentIndex: this.currentIndex,
        prevIndex: prevIndex,
        prevPropertyId: prevProperty.Id
      });
      this.router.navigate(['/property-detail', prevProperty.Id], {
        queryParams: { type: this.propertyType }
      });
    }
  }

  goToNext() {
    const nextIndex = this.currentIndex + 1;
    if (nextIndex < this.filteredProperties.length) {
      const nextProperty = this.filteredProperties[nextIndex];
      console.log('Next navigation:', {
        currentIndex: this.currentIndex,
        nextIndex: nextIndex,
        nextPropertyId: nextProperty.Id
      });
      this.router.navigate(['/property-detail', nextProperty.Id], {
        queryParams: { type: this.propertyType }
      });
    }
  }

  loadPropertyImages(): void {
    try {
      if (this.property) {
        console.log('Loading images for property:', this.property.Id);
        this.slides = [];
        
        // Add main photo if exists
        if (this.property.ImageUrl) {
          const mainImagePath = 'assets/Hou/' + this.property.ImageUrl;
          console.log('Adding main image:', mainImagePath);
          this.slides.push({
            image: mainImagePath,
            text: 'Main Property Image'
          });
        }

        // Add interior photos ONLY for properties 1-50 (demo properties)
        if (this.property.Id && this.property.Id <= 50) {
          const paddedNumber = this.property.Id.toString().padStart(2, '0');
          
          // Define image paths with exact folder names
          const imagePaths = [
            {
              path: `assets/Interiors/living/Living-${paddedNumber}.jpg`,
              text: 'Living Room'
            },
            {
              path: `assets/Interiors/BedRoom/Bedroom-${paddedNumber}.jpg`,
              text: 'Bedroom'
            },
            {
              path: `assets/Interiors/Kitchen/Kitchen-${paddedNumber}.jpg`,
              text: 'Kitchen'
            },
            {
              path: `assets/Interiors/BathRoom/Bathroom-${paddedNumber}.jpg`,
              text: 'Bathroom'
            }
          ];

          // Add each image to slides
          imagePaths.forEach(item => {
            console.log('Adding image:', item.path);
            this.slides.push({
              image: item.path,
              text: item.text
            });
          });

          console.log('Total slides to be loaded:', this.slides.length);
        }
      }
    } catch (error) {
      console.error('Error processing property images:', error);
      this.slides = [{
        image: 'assets/images/house_image.jpg',
        text: 'Default Property Image'
      }];
    }
  }

  openFullscreen(imagePath: string): void {
    this.fullscreenImage = imagePath;
    // Pause the carousel when in fullscreen
    this.myInterval = 0;
  }

  closeFullscreen(): void {
    this.fullscreenImage = null;
    // Resume carousel autoplay when exiting fullscreen
    this.myInterval = 4000;
  }
}
