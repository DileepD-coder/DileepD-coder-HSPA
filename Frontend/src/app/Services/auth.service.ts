import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Initialize with the current username from local storage (or null)
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  username$ = this.usernameSubject.asObservable();

  // Call this to update the current username
  setUsername(username: string | null): void {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(username);
  }
}
