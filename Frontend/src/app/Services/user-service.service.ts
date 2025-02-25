import { Injectable } from '@angular/core';
import { User } from '../models/user';  // Import the User interface

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];  // Store users locally

  constructor() {}

  addUser(user: User) {
    this.users.push(user);  // Add user to the array
    localStorage.setItem('Users', JSON.stringify(this.users)); // Save to local storage
    console.log("User registered:", user);
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('Users') || '[]');  // Retrieve users
  }
}
