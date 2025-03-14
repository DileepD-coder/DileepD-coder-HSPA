// housing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPropertybase } from 'models/IPropertybase';

export interface Property extends IPropertybase { }  // Property now extends IProperty

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  private propertiesUrl = 'data/properties.json';

  constructor(private http: HttpClient) { }

  getAllProperties(): Observable<IPropertybase[]> {
    return this.http.get<IPropertybase[]>(this.propertiesUrl).pipe(
      map(properties => {
        // Simply return the properties, no need to loop through them
        return properties;
      })
    );
  }
}
