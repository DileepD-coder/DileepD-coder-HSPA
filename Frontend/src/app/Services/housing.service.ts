import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Property {
  Id: number;
  Name: string;
  Type: string;
  Price: number;
}

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  private propertiesUrl = 'data/properties.json';  // Ensure the path is correct

  constructor(private http: HttpClient) { }

  // Correct method name
  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.propertiesUrl);
  }
}
