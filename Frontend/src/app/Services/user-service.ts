import { Injectable } from '@angular/core';
import { User } from '../models/user';  // Import the User interface

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];  // Initialize an array for users

  constructor() {
    // Load users from local storage when the service is created
    this.loadUsers();
  }

  addUser(user: User) {
    this.users.push(user);  // Add user to the array
    localStorage.setItem('Users', JSON.stringify(this.users)); // Save to local storage
    console.log("User registered:", user);
    console.log("All users:", this.getUsers()); // Log all users to check
  }

  getUsers(): User[] {
    return this.users; // Return the users from the service
  }

  loadUsers() {
    const storedUsers = localStorage.getItem('Users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers); // Load users from local storage
    }
  }

  login(email: string, password: string): boolean {
    // Check if the email and password match any user in the stored users
    return this.users.some(user => user.email === email && user.password === password);
  }
}
