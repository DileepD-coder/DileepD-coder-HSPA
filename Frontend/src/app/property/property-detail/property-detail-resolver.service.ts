import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      return this.housingService.getProperty(+propId).pipe(
        catchError(error => {
          this.router.navigate(['/']);
          // Create an empty property object instead of returning null
          return of(new Property());
        })
      );
  }
}
  