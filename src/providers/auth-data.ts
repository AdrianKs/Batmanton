import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
// import {setUserID} from "../app/globalVars";
//import myGlobals from '../app/globalVars';
import {Utilities} from '../app/utilities';
/*
  Generated class for the AuthData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthData {
  public fireAuth: any;
  public userProfile: any;

  constructor(public utilities: Utilities) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('clubs/12/players');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, firstname: string, lastname: string, birthday: string, gender: string, team: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        let teamId = team;
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
          pushid: ''
          });
        this.utilities.user = newUser;
        this.addTeamsOfPlayerArray(team, newUser.uid);
      });
  }

  addTeamsOfPlayerArray(team: any, playerId: any){
    let teams = [];
    teams.push(team);
    console.log(teams);
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  changeEmail(email: string): any {
    return this.fireAuth.currentUser.updateEmail(email).then(function() {
      // Update successful.
    }, function(error) {
      // An error happened.
    });
  }

  logoutUser(): any {
    return this.fireAuth.signOut();
  }

}
