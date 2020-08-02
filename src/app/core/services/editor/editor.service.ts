import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  loggedInUser: User;
  collectionReference: any;
  documentReference: any;

  constructor(
    public database: AngularFirestore,
    private authService: AuthService
  ) {}

  initEditor(): Observable<any> {
    let storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      this.loggedInUser = <User>user;
    } else {
      this.authService.loggedInUser.subscribe({
        next: (loggedInUser) => {
          this.loggedInUser = loggedInUser;
        },
      });
    }
    this.collectionReference = this.database.collection(`documents`);

    this.documentReference = this.collectionReference.doc(
      this.loggedInUser.uid
    );

    return this.documentReference.valueChanges();
  }

  save(content: string): void {
    this.documentReference.set({ content });
  }
}
