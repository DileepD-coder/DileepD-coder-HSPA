import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  authUser(user: { username: string; password: string }) {
    const userArray: { username: string; password: string }[] = this.getUsers(); // Get users from local storage
    return userArray.find(p => p.username === user.username && p.password === user.password);
  }

  private getUsers() {
    return JSON.parse(localStorage.getItem('Users') || '[]'); // Retrieve users
  }
}
