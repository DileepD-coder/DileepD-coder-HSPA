import { Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { RentPropertyComponent } from './property/rent-property/rent-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';  // Import PropertyDetailComponent

export const routes: Routes = [
  { path: '', component: PropertyListComponent },  // Default route
  { path: 'add-property', component: AddPropertyComponent },  // Add Property route
  { path: 'rent-property', component: RentPropertyComponent },  // Rent Property route
  { path: 'property-detail/:id', component: PropertyDetailComponent }  // Property Detail route with dynamic ID
];
