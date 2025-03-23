import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IPropertybase } from '../../models/IPropertybase';


@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent {
  @Input() property!: IPropertybase;
  @Input() hideIcons: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('Property:', this.property);
    console.log('Constructed Image URL:', 'assets/Hou/' + this.property.ImageUrl);
  }

  navigateToProperty() {
    if (this.property && this.property.Id) {
      console.log('Navigating to property with ID:', this.property.Id);
      const type = this.property.SellRent === 1 ? 'buy' : 'rent';
      this.router.navigate(['/property-detail', this.property.Id], { 
        queryParams: { type: type },
        relativeTo: this.route
      });
    } else {
      console.error('Property is not defined or does not have an ID:', this.property);
    }
  }
}
