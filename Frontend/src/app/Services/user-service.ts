import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';  // Import AuthService

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor(private authService: AuthService) {
    this.loadUsers();
  }

  addUser(user: User): void {
    this.users.push(user);
    localStorage.setItem('Users', JSON.stringify(this.users));
    console.log("User registered:", user);
    console.log("All users:", this.getUsers());
  }

  getUsers(): User[] {
    return this.users;
  }

  loadUsers(): void {
    const storedUsers = localStorage.getItem('Users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
    console.log("Loaded users:", this.users);
  }

  login(email: string, password: string): boolean {
    // Reload users from storage each time login is attempted
    this.loadUsers();
    console.log("Attempting login with:", email, password);
    console.log("Loaded users:", this.users);

    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find(user =>
      user.email.trim().toLowerCase() === normalizedEmail &&
      user.password === password
    );

    if (user) {
      localStorage.setItem('token', 'your-auth-token');
      localStorage.setItem('username', user.username);
      this.authService.setUsername(user.username); // Update the shared username
      console.log("Login successful for user:", user);
      return true;
    }
    console.log("Invalid credentials: no matching user found.");
    return false;
  }
}
