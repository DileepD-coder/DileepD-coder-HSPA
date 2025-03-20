// housing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IPropertybase } from 'models/IPropertybase';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private http: HttpClient) { }

  getAllProperties(sellRent?: number): Observable<IPropertybase[]> {
    // Get properties from both sources and combine them
    return forkJoin([
      this.getLocalProperties(),
      this.getJsonProperties()
    ]).pipe(
      map(([localProps, jsonProps]) => {
        // Combine both arrays
        let allProperties = [...jsonProps, ...localProps];
         
        // Filter by SellRent if specified
        if (sellRent !== undefined) {
          allProperties = allProperties.filter(item => item.SellRent === sellRent);
        }
        
        return allProperties;
      })
    );
  }

  private getLocalProperties(): Observable<Property[]> {
    const localProperties = localStorage.getItem('properties');
    if (localProperties) {
      return of(JSON.parse(localProperties));
    }
    return of([]);
  }

  private getJsonProperties(): Observable<IPropertybase[]> {
    return this.http.get<IPropertybase[]>('data/properties.json').pipe(
      catchError(error => {
        console.error('Error loading JSON properties:', error);
        return of([]);
      })
    );
  }

  addProperty(property: Property): Observable<Property> {
    let properties = [];
    const localProperties = localStorage.getItem('properties');
    if (localProperties) {
      properties = JSON.parse(localProperties);
    }

    // Get max ID from both local and JSON properties
    return this.getJsonProperties().pipe(
      map(jsonProps => {
        const maxLocalId = properties.length > 0 ? Math.max(...properties.map((p: Property) => p.Id)) : 0;
        const maxJsonId = jsonProps.length > 0 ? Math.max(...jsonProps.map((p: IPropertybase) => p.Id)) : 0;
        const maxId = Math.max(maxLocalId, maxJsonId);
        
        property.Id = maxId + 1;
        properties.push(property);
        localStorage.setItem('properties', JSON.stringify(properties));
        
        return property;
      }),
      catchError(error => {
        console.error('Error adding property:', error);
        return of(property); // Return the property even if there's an error
      })
    );
  }
}
