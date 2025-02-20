import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { RentPropertyComponent } from './property/rent-property/rent-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'rent-property', component: RentPropertyComponent },
  { path: 'property-detail/:id', component: PropertyDetailComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
