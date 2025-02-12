import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProperty } from "../IProperty.interface";

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],  // Add RouterModule for navigation
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent {
  @Input() property!: IProperty;

  ngOnInit() {
    // Log the property and id to check if it's available
    console.log('Property:', this.property);  // Log the full property
    console.log('Property ID:', this.property.id);  // Log the ID specifically
  }
}
