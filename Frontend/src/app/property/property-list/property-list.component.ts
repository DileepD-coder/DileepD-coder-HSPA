import { Component, OnInit } from '@angular/core';  // Import OnInit for ngOnInit lifecycle hook
import { HttpClient } from '@angular/common/http';  // Import HttpClient to make HTTP requests
import { CommonModule } from '@angular/common';  // Import CommonModule
import { PropertyCardComponent } from '../property-card/property-card.component';  // Correct import for PropertyCardComponent
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  standalone: true,  // This component is standalone
  imports: [CommonModule, PropertyCardComponent, HttpClientModule],  // Import HttpClientModule
})
export class PropertyListComponent implements OnInit {  // Implement OnInit to fetch data when component initializes
  properties: Array<any> = [];  // Define the properties array

  constructor(private http: HttpClient) {}  // Inject HttpClient to use in this component

  ngOnInit(): void {
    // Make an HTTP GET request to fetch data from the JSON file
    this.http.get<any[]>('assets/data/properties.json')  // Updated path to 'assets/data/properties.json'
      .subscribe(data => {
        this.properties = data;  // Set the properties array with the data from the response
      }, error => {
        console.error('Error fetching properties:', error);
      });
  }
}
