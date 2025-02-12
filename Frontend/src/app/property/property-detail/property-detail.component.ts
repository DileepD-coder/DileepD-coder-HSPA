import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [], 
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the 'id' parameter from the route and assign it to 'propertyId'
    this.propertyId = this.route.snapshot.paramMap.get('id');
    console.log('Property ID:', this.propertyId); // Log the 'propertyId' for debugging
  }
}
