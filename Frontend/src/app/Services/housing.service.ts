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

  addProperty(property: Property) {
    let properties = [];
    
    // Get existing properties from localStorage
    const localProperties = localStorage.getItem('properties');
    if (localProperties) {
      properties = JSON.parse(localProperties);
    }

    // Add new property
    property.Id = properties.length + 1;
    properties.push(property);

    // Save back to localStorage
    localStorage.setItem('properties', JSON.stringify(properties));
  }
}
