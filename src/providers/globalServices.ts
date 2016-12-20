/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {setTeams} from "../app/globalVars";

@Injectable()
export class GlobalServices {
  public fireAuth: any;
  teamsLoaded: boolean = false;

  constructor() {
    this.fireAuth = firebase.auth();
  }

  getTeams(){
    this.teamsLoaded = false;
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      setTeams(teamArray);
      this.teamsLoaded = true;
    });
  }
}
