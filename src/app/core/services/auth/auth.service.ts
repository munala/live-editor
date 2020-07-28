import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from '../../../shared/interfaces/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;

  constructor(
    public router: Router,
    public ngZone: NgZone,
    public angularFireAuth: AngularFireAuth
  ) {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
      }
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

  signOut = async () => {
    await this.angularFireAuth.signOut();

    localStorage.removeItem('user');
    this.router.navigate(['auth']);
  };
}
