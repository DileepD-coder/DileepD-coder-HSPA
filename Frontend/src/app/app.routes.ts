import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';  // Import TabsModule from ngx-bootstrap

import { PropertyListComponent } from './property/property-list/property-list.component';
import { RentPropertyComponent } from './property/rent-property/rent-property.component';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { PropertyDetailResolverService } from './property/property-detail/property-detail-resolver.service';

export const routes: Routes = [
  { path: '', component: PropertyListComponent },
  { path: 'buy', component: PropertyListComponent },
  { path: 'rent-property', component: RentPropertyComponent },
  { 
    path: 'property-detail/:id', 
    component: PropertyDetailComponent,
    resolve: { property: PropertyDetailResolverService }
  },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'register', component: UserRegisterComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    TabsModule.forRoot() // This initializes the TabsModule from ngx-bootstrap
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
