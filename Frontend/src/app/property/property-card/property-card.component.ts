import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProperty } from '../IProperty.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent {
  @Input() property!: IProperty;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Property:', this.property);
    console.log('Constructed Image URL:', 'assets/Hou/' + this.property.ImageUrl);
  }

  navigateToProperty() {
    // Change this line to check for Id instead of id
    if (this.property && this.property.Id) {  // Use this.property.Id
      console.log('Navigating to property with ID:', this.property.Id);  // Log the correct ID
      this.router.navigate(['/property-detail', this.property.Id], { 
        queryParams: { type: this.property.SellRent === 1 ? 'buy' : 'rent' }
      });
    } else {
      console.error('Property is not defined or does not have an ID:', this.property);
    }
  }
}
