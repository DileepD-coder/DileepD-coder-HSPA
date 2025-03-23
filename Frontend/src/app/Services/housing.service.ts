// housing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IPropertybase } from '../models/IPropertybase';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private http: HttpClient) { }

  getAllProperties(sellRent?: number): Observable<IPropertybase[]> {
    return forkJoin([
      this.http.get<IPropertybase[]>('data/properties.json'),
      this.getLocalProperties()
    ]).pipe(
      map(([jsonProperties, localProperties]) => {
        // Log initial properties from both sources
        console.log('Properties before combining:', {
          jsonProperties: jsonProperties.length,
          localProperties: localProperties.length,
          jsonIds: jsonProperties.map(p => p.Id),
          localIds: localProperties.map(p => p.Id)
        });

        // Use a Map to ensure unique properties by Id
        const propertyMap = new Map();
        
        // Add JSON properties first
        jsonProperties.forEach(prop => {
          propertyMap.set(prop.Id, prop);
        });
        
        // Add local properties, overwriting JSON ones if they exist
        localProperties.forEach(prop => {
          propertyMap.set(prop.Id, prop);
        });
        
        // Convert Map back to array
        const uniqueProperties = Array.from(propertyMap.values());
        
        // Map properties and add SellOrBuy
        const mappedProperties = uniqueProperties.map(property => ({
          ...property,
          SellOrBuy: property.SellRent === 1 ? 'Sell' : 'Rent'
        }));

        // Filter by SellRent if specified
        let finalProperties = mappedProperties;
        if (sellRent !== undefined) {
          finalProperties = mappedProperties.filter(item => item.SellRent === sellRent);
        }
        
        // Sort by Id to ensure consistent order
        const sortedProperties = finalProperties.sort((a, b) => a.Id - b.Id);
        
        console.log('Final properties:', {
          sellRent: sellRent,
          total: sortedProperties.length,
          ids: sortedProperties.map(p => p.Id).join(', ')
        });
        
        return sortedProperties;
      }),
      catchError(error => {
        console.error('Error loading properties:', error);
        return of([]);
      })
    );
  }

  getProperty(id: number): Observable<Property> {
    console.log('Getting property with ID:', id);
    
    // First check local storage
    const localProperties = localStorage.getItem('properties');
    if (localProperties) {
      const properties: Property[] = JSON.parse(localProperties);
      const property = properties.find(p => p.Id === id);
      if (property) {
        console.log('Found property in local storage:', property);
        return of(property);
      }
    }

    // If not found in local storage, check JSON file
    return this.http.get<Property[]>('data/properties.json').pipe(
      map(properties => {
        console.log('All properties from JSON:', properties);
        const property = properties.find(p => p.Id === id);
        if (!property) {
          console.error('Property not found in JSON file');
          throw new Error('Property not found');
        }
        console.log('Found property in JSON:', property);
        return property;
      }),
      catchError(error => {
        console.error('Error fetching property:', error);
        throw error;
      })
    );
  }

  private getLocalProperties(): Observable<Property[]> {
    const localProperties = localStorage.getItem('properties');
    if (localProperties) {
      try {
        const properties = JSON.parse(localProperties);
        console.log('Local storage properties:', {
          count: properties.length,
          ids: properties.map((p: Property) => p.Id)
        });
        return of(properties);
      } catch (error) {
        console.error('Error parsing local storage properties:', error);
        localStorage.removeItem('properties'); // Clear invalid data
        return of([]);
      }
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
