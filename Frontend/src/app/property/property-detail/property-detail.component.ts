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
  propertyId: number | null = null;
  propertyType: string | null = null;
  property: IPropertybase | null = null;
  properties: IPropertybase[] = [];
  currentIndex: number = 0;
  filteredProperties: IPropertybase[] = [];
  
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
    
    console.log('Property ID:', this.propertyId);
    console.log('Property Type:', this.propertyType);

    // Load property data
    this.route.data.subscribe({
      next: (data) => {
        console.log('Route Data:', data);
        this.property = data['property'];
        console.log('Loaded Property:', this.property);
        
        if (this.property && this.property.Id !== 0) {
          this.loadPropertyImages();
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
