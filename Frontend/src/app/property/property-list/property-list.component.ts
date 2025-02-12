import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { IProperty } from './IProperty.interface';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  private propertiesUrl = 'data/properties.json';  // Ensure the path is correct

  constructor(private http: HttpClient) { }

  // Correct method name with pipe and map operator
  getAllProperties(): Observable<IProperty[]> {
    return this.http.get<IProperty[]>(this.propertiesUrl).pipe(
      map(properties => {
        // Directly return the properties as is (if the response is already in array format)
        return properties;
      })
    );
  }
}
