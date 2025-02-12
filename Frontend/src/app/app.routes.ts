import { Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },  // Default route
  { path: 'add-property', component: AddPropertyComponent }  // Route for Add Property
];
