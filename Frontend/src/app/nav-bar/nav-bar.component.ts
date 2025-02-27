import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertfyService } from '../Services/alertfy.service'; // Corrected path

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, BsDropdownModule]
})
export class NavBarComponent implements OnInit {
  username: string | null = null;

  constructor(private router: Router, private alertify: AlertfyService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
  }

  loggedin(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
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
