import { Component } from '@angular/core';
import { PropertyListComponent } from "./property/property-list/property-list.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';  // Import CommonModule for standalones

@Component({
  selector: 'app-root',
  standalone: true,  // Mark as standalone component
  imports: [CommonModule, PropertyListComponent, NavBarComponent],  // Import components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-first-app';
}
