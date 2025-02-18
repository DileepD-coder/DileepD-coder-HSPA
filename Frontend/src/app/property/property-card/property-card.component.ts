import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProperty } from '../IProperty.interface';

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
    console.log('Property:', this.property);  
    console.log('Constructed Image URL:', 'assets/Hou/' + this.property.ImageUrl);  
  }
}
