/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Utilities {
  public fireAuth: any;
  user: any;
  userData: any = "";
  allTeams: Array<any>;
  teamsLoaded: boolean = false;
  userLoaded: boolean = false;

  constructor() {
    this.fireAuth = firebase.auth();
  }

  /**
   * Gets the data for the logged in userData from the database and sets the "userLoaded" flag to "true"
   */
  setUserData(): void {
    firebase.database().ref('clubs/12/players/' + this.user.uid).once('value', snapshot => {
      this.userData = snapshot.val();
      this.userLoaded = true;
    })
  }

  setTeams(){
    this.teamsLoaded = false;
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.allTeams = teamArray;
      this.teamsLoaded = true;
    });
  }

}
