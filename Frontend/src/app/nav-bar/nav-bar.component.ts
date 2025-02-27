import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like ngIf
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule] // Include RouterModule here
})
export class NavBarComponent implements OnInit {
  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void { }

  loggedin(): boolean {
    return localStorage.getItem('token') !== null; // Return true if token exists
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token on logout
    this.router.navigate(['/login']); // Navigate to login page after logout
  }
}
