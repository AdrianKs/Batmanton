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
  rank: any;
  allPlayers: any;
  teamHasPlayers: any;
  manCounter: any = 0;
  womanCounter: any = 0;
  playerDBArray: any;
  matchesDBArray: any;
  playerDeleted: any;
  deleteID: any;

  /**
   * VARIABLEN FÜR EDITPLAYERSCOMPONENT
   */
  allPlayersEdit: any;
  manCounterEdit: any = 0;
  womanCounterEdit: any = 0;

  constructor() {

  }

  setTeams() {
    return firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        teamArray[counter].rank = parseInt(snapshot.val()[i].rank);
        counter++;
      }
      this.teams = teamArray;
      this.teams = _.sortBy(this.teams, "rank");
    })
  }

  buildTeam() {
    return firebase.database().ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
      this.team = snapshot.val();
      this.teamNameOld = this.team.name;
      this.altersKOld = this.team.ageLimit;
      this.altersklasse = this.team.ageLimit;
      this.teamArt = this.team.type;
      this.rank = this.team.rank;
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
    this.manCounter = 0;
    this.womanCounter = 0;
    return firebase.database().ref('/clubs/12/players/').once('value', snapshot => {
      let players = snapshot.val();
      let player;
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

  updateTeamInfos(ageLimit: string, name: string, type: string, rank: number) {
    this.team.ageLimit = ageLimit;
    this.team.name = name;
    this.team.type = type;
    this.team.rank = rank;
    return firebase.database().ref('clubs/12/teams/' + this.teamId).update({
      ageLimit: ageLimit,
      name: name,
      type: type,
      rank: rank
    });
  }

  removePlayer(p: any) {
    return firebase.database().ref('/clubs/12/teams/' + this.teamId + '/players/').once('value', snapshot => {
      let justPlayersOfTeam = snapshot.val();
      for (let i in justPlayersOfTeam) {
        let ID = justPlayersOfTeam[i];
        if (p.id == ID) {
          this.deleteID = i;
        }
      }
    });

  }

  deletePlayerFromTeam(deleteId: any) {
    return firebase.database().ref('clubs/12/teams/' + this.teamId + '/players/' + deleteId).remove();
  }

  resetTeamOfPlayer(playerId: any) {
    this.refreshPlayerArray(playerId);
    return firebase.database().ref('clubs/12/players/' + playerId + '/').update({
      team: '0'
    });
  }

  refreshPlayerArray(ID) {
    for (let i in this.allPlayers) {
      if (this.allPlayers[i].id == ID) {
        this.allPlayers[i].team = "";
      }
    }
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

  getRelevantPlayers(ageLimit) {
    this.allPlayersEdit = [];
    console.log(this.teamId);
    return firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        counter++;
      }
      this.allPlayersEdit = playerArray;
      //this.groupPlayers(this.allPlayers);
      let relevantPlayers = [];
      this.manCounterEdit = 0;
      this.womanCounterEdit = 0;
      for (let i in this.allPlayersEdit) {
        let age = this.calculateAge(this.allPlayersEdit[i].birthday);
        //console.log("Name: " + this.allPlayers[i].lastname + ", Alter: " + age);
        if (ageLimit != 0) {
          if (ageLimit >= age) {
            if ((this.allPlayersEdit[i].team == this.teamId) || this.allPlayersEdit[i].team == "0") {
              if (this.allPlayersEdit[i].gender == "m") {
                this.manCounterEdit++;
              } else {
                this.womanCounterEdit++;
              }
              relevantPlayers.push(this.allPlayersEdit[i]);
            }
          }
        } else {
          if ((this.allPlayersEdit[i].team == this.teamId) || this.allPlayersEdit[i].team == "0") {
            if (this.allPlayersEdit[i].gender == "m") {
              this.manCounterEdit++;
            } else {
              this.womanCounterEdit++;
            }
            relevantPlayers.push(this.allPlayersEdit[i]);
          }
          //relevantPlayers.push(this.allPlayers[i]);
        }
      }
      this.allPlayersEdit = relevantPlayers;
      let player;
      let teamOfPlayer;
      for (let i in this.allPlayersEdit) {
        player = this.allPlayersEdit[i];
        teamOfPlayer = player.team;
        if (teamOfPlayer == this.teamId) {
          player.isAdded = true;
        } else {
          player.isAdded = false;
        }
      }
      this.allPlayersEdit = _.sortBy(this.allPlayersEdit, "lastname");

    });
  }

  addPlayerToTeam(p: any, teamID) {
    if (teamID != undefined && teamID != "0") {
      return firebase.database().ref('clubs/12/teams/' + teamID + '/players').once('value', snapshot => {
        for (let i in this.allPlayersEdit) {
          if (this.allPlayersEdit[i].id == p.id) {
            this.allPlayersEdit[i].isAdded = true;
          }
        }
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(p.id);
        firebase.database().ref('clubs/12/teams/' + teamID + '/').update({
          players: playersArray
        });
        firebase.database().ref('clubs/12/players/' + p.id + '/').update({
          team: teamID
        });
      });
    }
  }

  calculateAge(birthdayString) {
    let birthdayDate = new Date(birthdayString);

    let todayDate = new Date();
    let todayYear = todayDate.getFullYear();
    let todayMonth = todayDate.getMonth() + 1;
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

  removePlayerFromTeam(p: any, teamID) {
    for (let i in this.allPlayersEdit) {
      if (this.allPlayersEdit[i].id == p.id) {
        this.allPlayersEdit[i].isAdded = false;
      }
    }
    if (teamID != undefined && teamID != "0") {
      return firebase.database().ref('clubs/12/teams/' + teamID + '/players').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === p.id) {
              userPosition = i;
              break;
            }
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/teams/' + teamID + '/players/' + userPosition).remove();
        }
        if (p.id != undefined) {
          firebase.database().ref('clubs/12/players/' + p.id + '/').update({
            team: '0'
          })
        }
      });
    }
  }

  addNewTeam(id: string, ageLimit: string, name: string, type: string, rank: number){
    return firebase.database().ref('clubs/12/teams').child(id).set({
      ageLimit: ageLimit,
      name: name,
      type: type,
      rank: rank
    })
  }
}
