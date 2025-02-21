import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { RentPropertyComponent } from './property/rent-property/rent-property.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { UserLoginComponent } from './user/user-login/user-login.component'; // Import UserLoginComponent
import { UserRegisterComponent } from './user/user-register/user-register.component'; // Import UserRegisterComponent

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'buy', component: PropertyListComponent },
  { path: 'rent-property', component: RentPropertyComponent },
  { path: 'property-detail/:id', component: PropertyDetailComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'login', component: UserLoginComponent }, // Route for User Login
  { path: 'register', component: UserRegisterComponent } // Route for User Register
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
