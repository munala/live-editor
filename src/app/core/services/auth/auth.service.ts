import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { auth } from 'firebase/app';
import { User } from '../../../shared/interfaces/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;
  loggedIn: boolean;
  loggedInUser: Observable<any>;

  constructor(
    public router: Router,
    public ngZone: NgZone,
    public angularFireAuth: AngularFireAuth
  ) {}

  initAuth(): void {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    this.loggedInUser = new Observable((observer) => {
      if (userFromLocalStorage) {
        this.user = userFromLocalStorage;
        this.loggedIn = true;

        observer.next(userFromLocalStorage);
      } else {
        this.angularFireAuth.authState.subscribe((user) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));

            this.loggedIn = true;
            this.user = user;

            observer.next(user);
          } else {
            this.logout();
          }
        });
      }
      return {
        unsubscribe() {},
      };
    });
  }

  isLoggedIn = (): boolean => {
    const user = JSON.parse(localStorage.getItem('user'));

    return user !== null;
  };

  signInWithGoogle = async () => {
    const googleAuthProvider = new auth.GoogleAuthProvider();

    try {
      const { user } = await this.angularFireAuth.signInWithPopup(
        googleAuthProvider
      );

      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));

      this.ngZone.run(() => {
        this.router.navigate(['editor']);
      });
    } catch (error) {
      window.alert(error);
    }
  };

  logout = () => {
    this.user = null;
    this.loggedIn = false;

    localStorage.removeItem('user');

    this.router.navigate(['auth']);
  };

  signOut = async () => {
    await this.angularFireAuth.signOut();

    this.logout();
  };
}
