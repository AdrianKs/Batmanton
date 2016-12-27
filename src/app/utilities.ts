/**
 * Created by Sebastian on 20.12.2016.
 */
import {Injectable} from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Utilities {
  public fireAuth: any;
  user: any;
  userData: any = "";
  allTeams: Array<any>;
  allTeamsVal: Array<any>;
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

  setTeams() {
    this.teamsLoaded = false;
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.allTeamsVal = snapshot.val();
      this.allTeams = teamArray;
      this.teamsLoaded = true;
    });
  }

  calculateAge(birthdayString) {
    let birthdayDate = new Date(birthdayString);

    let todayDate = new Date("2016-11-26");
    let todayYear = todayDate.getFullYear();
    let todayMonth = todayDate.getMonth();
    let todayDay = todayDate.getDate();
    let age = todayYear - birthdayDate.getFullYear();

    if (todayMonth < birthdayDate.getMonth()) {
      age--;
    }

    if (birthdayDate.getMonth() == todayMonth && todayDay < birthdayDate.getDate()) {
      age--;
    }
    return age;
  }

  getRelevantTeams(birthdayString) {
    let age = this.calculateAge(birthdayString);
    let relevantTeams: Array<any> = [];
    this.allTeams.forEach(function (team) {
      if (team.ageLimit > age || team.ageLimit === 0) {
        relevantTeams.push(team);
      }
    });
    return relevantTeams;
  }

  addPlayerToTeam(teamID, userID){
    if (teamID != undefined && teamID != "0") {
      firebase.database().ref('clubs/12/teams/' + teamID + '/players').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/teams/' + teamID + '/').update({
          players: playersArray
        });
      });
    }
  }

  removePlayerFromTeam(teamID, userID){
    if (teamID != undefined && teamID != "0") {
      firebase.database().ref('clubs/12/teams/' + teamID + '/players').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined){
            if (snapshot.val()[i] === userID){
              userPosition = i;
              break;
            }
          }
        }
        if(userPosition != undefined) {
          firebase.database().ref('clubs/12/teams/' + teamID + '/players/' + userPosition).remove();
        }
      });
    }
  }
}