import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {Utilities} from '../app/utilities';
import {MenuController} from "ionic-angular";
/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
  public fireAuth: any;
  public userProfile: any;

  constructor(public utilities: Utilities, public menuCtrl: MenuController) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('clubs/12/players');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, firstname: string, lastname: string, birthday: string, gender: string, team: string, pushid: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        this.userProfile.child(newUser.uid).set({
          email: email,
          firstname: firstname,
          lastname: lastname,
          birthday: birthday,
          gender: gender,
          team: team,
          state: 0,
          isPlayer: true,
          isTrainer: false,
          picUrl: "",
          pushid: {},
          isDefault: false,
          helpCounter: 0
          });
          firebase.database().ref('clubs/12/players/' + newUser.uid + '/pushid/' + pushid).set(
            true
          );
        this.utilities.user = newUser;
        newUser.sendEmailVerification();
      });
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  changePassword(newPassword: string, passwordOld: string): any{
    let that = this;
    let credentials = firebase.auth.EmailAuthProvider.credential(
      this.utilities.userData.email,
      passwordOld
    );

    return this.fireAuth.currentUser.reauthenticate(credentials).then(function() {
      that.fireAuth.currentUser.updatePassword(newPassword);
    });
  }

  changeEmail(email: string): any {
    return this.fireAuth.currentUser.updateEmail(email).then(function() {
      // Update successful.
    }, function(error) {
      alert(error.message);
    });
  }

  deleteUser(password: string): any{
    let that = this;
    let credentials = firebase.auth.EmailAuthProvider.credential(
      this.utilities.userData.email,
      password
    );

    return this.fireAuth.currentUser.reauthenticate(credentials).then(function() {
      that.fireAuth.currentUser.delete().then(function() {
        // User deleted.
      }, function(error) {
        alert(error.message);
      });
    });
  }

  changePushid(userid: string): any {
    window["plugins"].OneSignal.getIds(ids => {
      console.log('getIds: ' + JSON.stringify(ids));
      //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
      return firebase.database().ref('clubs/12/players/' + userid + '/pushid/' + ids.userId).set(
        true
      );
    });

  }

  logoutUser(): any {
    this.menuCtrl.close('mainMenu');
    console.log("nach menu close");
    window["plugins"].OneSignal.getIds(ids => {
      console.log('getIds: ' + JSON.stringify(ids));
      firebase.database().ref('clubs/12/players/' + this.utilities.user.uid + '/pushid').child(ids.userId).remove().then(() => {
        console.log("in logout promise");
          return this.fireAuth.signOut();
      })
    })
  }

  getErrorMessage(error): string {
    let code: string = error.code;
    if(code === "auth/invalid-email"){
      return "Die eingegebene E-Mail Adresse ist ungültig."
    }
    else if(code === "auth/wrong-password"){
      return "Ihr eingegebenes Passwort ist falsch."
    }
    else if(code === "auth/user-not-found"){
      return "Unter dieser E-Mail Adresse ist kein User registriert."
    }
    else if(code === "auth/internal-error"){
      return "Es scheint etwas schief gelaufen zu sein. Bitte versuchen Sie es erneut."
    }
    else {
      return error.message;
    }
  }

}
