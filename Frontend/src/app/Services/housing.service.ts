// src/app/property/housing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProperty } from './IProperty.interface';  // Correct path to IProperty.interface.ts

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  private propertiesUrl = 'data/properties.json';  // Ensure the path is correct

  constructor(private http: HttpClient) { }

  getAllProperties(): Observable<IProperty[]> {
    return this.http.get<IProperty[]>(this.propertiesUrl).pipe(
      map(properties => {
        // Directly return the properties as is (if the response is already in array format)
        return properties;
      })
    );
  }
}
