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

  addUser(user: User): void {
    this.users.push(user);  // Add user to the array
    localStorage.setItem('Users', JSON.stringify(this.users)); // Save to local storage
    console.log("User registered:", user);
    console.log("All users:", this.getUsers());
  }

  getUsers(): User[] {
    return this.users; // Return the users from the service
  }

  loadUsers(): void {
    const storedUsers = localStorage.getItem('Users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers); // Load users from local storage
    }
  }

  login(email: string, password: string): boolean {
    // Find a matching user by email and password
    const user = this.users.find(user => user.email === email && user.password === password);
    if (user) {
      // Store token and username on successful login
      localStorage.setItem('token', 'your-auth-token');
      localStorage.setItem('username', user.username);
      return true;
    }
    return false;
  }
}
