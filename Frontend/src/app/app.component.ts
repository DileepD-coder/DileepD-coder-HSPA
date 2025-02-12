import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // ✅ Import RouterModule
import { NavBarComponent } from './nav-bar/nav-bar.component'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],  // ✅ Add RouterModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HSPA';
}
