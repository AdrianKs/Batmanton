import { Injectable } from '@angular/core';
import firebase from 'firebase';
import * as _ from 'lodash';

/*
  Generated class for the TeamsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TeamsProvider {


  /**
   * GLOBALLY USED
   */
  teamId: any;

  /**
   * VARIABLEN FÜR TEAMCOMPONENT
   */
  teams: any = [];

  /**
   * VARIABLEN FÜR VIEWTEAMCOMPONENT
   */
  team: any;
  teamNameOld: any;
  altersKOld: any;
  altersklasse: any;
  teamArt: any;
  sKlasse: any;
  allPlayers: any;
  teamHasPlayers: any;
  manCounter: any = 0;
  womanCounter: any = 0;
  playerDBArray: any;
  matchesDBArray: any;

  constructor() {

  }

  setTeams() {
    return firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.teams = teamArray;
    })
  }

  buildTeam() {
    return firebase.database().ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
      this.team = snapshot.val();
      this.teamNameOld = this.team.name;
      this.altersKOld = this.team.ageLimit;
      this.altersklasse = this.team.ageLimit;
      this.teamArt = this.team.type;
      this.sKlasse = this.team.sclass;
    })
  }

  refreshPlayers() {
    return firebase.database().ref("/clubs/12/players/").once('value', snapshot => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        counter++;
      }
      this.allPlayers = playerArray;
      this.allPlayers = _.sortBy(this.allPlayers, "lastname");
    })
  }

  checkIfTeamsHasPlayers() {
    return firebase.database().ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
      let array = snapshot.val();
      let playerArray = array.players;
      if (playerArray == undefined || playerArray.length == 0) {
        this.teamHasPlayers = false;
      } else {
        this.teamHasPlayers = true;
      }
    })
  }

  countGenders() {
    return firebase.database().ref('/clubs/12/players/').once('value', snapshot => {
      let players = snapshot.val();
      let player;
      let age;
      for (let i in players) {
        player = players[i];
        if (player.team == this.teamId) {
          if (player.gender == "m") {
            this.manCounter++;
          } else {
            this.womanCounter++;
          }
        }
      }
    })
  }

  deleteTeam() {
    return firebase.database().ref('clubs/12/teams/' + this.teamId).remove();
  }

  deleteTeamFromPlayers() {
    return firebase.database().ref('clubs/12/players').once('value', snapshot => {
      this.playerDBArray = snapshot.val();

      let player;
      for (let i in this.playerDBArray) {
        player = this.playerDBArray[i];
        if (player.team == this.teamId) {
          player.team = '0';
        }
      }
    })

  }

  updateDatabaseWithArray(whichPath: string, array: any) {
    if (whichPath == "players") {
      return firebase.database().ref('clubs/12/').update({
        players: array
      })
    }
    if (whichPath == "matches") {
      return firebase.database().ref('clubs/12/').update({
        matches: array
      })
    }
  }

  deleteTeamFromMatches() {
    return firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      this.matchesDBArray = snapshot.val();
      let match;
      for (let i in this.matchesDBArray) {
        match = this.matchesDBArray[i];
        if (match.team == this.teamId) {
          match.team = '0';
        }
      }

    })
  }
}
