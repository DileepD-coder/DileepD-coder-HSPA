import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Property } from '../../../app/models/property';
import { HousingService } from '../../../app/Services/housing.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyDetailResolverService implements Resolve<Property> {

  constructor(
    private housingService: HousingService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    Observable<Property> {
      const propId = route.params['id'];
      console.log('Resolving property with ID:', propId);
      
      return this.housingService.getProperty(+propId).pipe(
        map(property => {
          if (!property || property.Id === 0) {
            console.error('Property not found');
            this.router.navigate(['/']);
            return new Property();
          }
          console.log('Resolved property:', property);
          return property;
        }),
        catchError(error => {
          console.error('Error resolving property:', error);
          this.router.navigate(['/']);
          return of(new Property());
        })
      );
  }
}
       