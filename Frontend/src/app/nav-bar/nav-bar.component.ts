import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertfyService } from '../Services/alertfy.service';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BsDropdownModule]
})
export class NavBarComponent implements OnInit, OnDestroy {
  username: string | null = null;
  private usernameSubscription: Subscription;

  constructor(
    private router: Router, 
    private alertify: AlertfyService,
    private authService: AuthService
  ) {
    // Subscribe to username changes
    this.usernameSubscription = this.authService.username$.subscribe(
      username => this.username = username
    );
  }

  ngOnInit(): void {
    // Initialize username from localStorage
    this.username = localStorage.getItem('username');
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  loggedin(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.authService.setUsername(null); // Clear username in AuthService
    this.alertify.success('You have been logged out successfully!');
    this.router.navigate(['/login']);
  }

  viewDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  myProfile(): void {
    this.router.navigate(['/profile']);
  }

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }
}
