/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import * as _ from 'lodash';
import { AlertController } from "ionic-angular";
import { PlayerComponent } from '../pages/gameDetails/player.component';

@Injectable()
export class Utilities {
  public fireAuth: any;
  user: any;
  pushIDsAdmins: any;
  userData: any = {};
  allTeams: Array<any> = [];
  allTeamsVal: Array<any> = [];
  teamsLoaded: boolean = false;
  userLoaded: boolean = false;
  allInvites: Array<any>;
  invitesLoaded: boolean = false;
  allPlayers: Array<any>;
  inRegister: boolean = false;
  loggedIn: boolean = false;
  LOCAL_TOKEN_KEY: string = 'Batmanton';
  hashedPassword = -1719170103;
  counterOpen: any;

  constructor(public alertCtrl: AlertController) {
    this.fireAuth = firebase.auth();
    this.setInvites();
    // this.setPlayers();
  }

  setPushIDsAdmins(){
     for (let i in this.allPlayers) {
      if (this.allPlayers[i].isAdmin) {
        this.pushIDsAdmins.push(this.allPlayers[i].pushID)
      }
    }
    return this.pushIDsAdmins;
  }

  setInRegister(): void {
    this.inRegister = !this.inRegister;
  }

  /**
   * Gets the data for the logged in userData from the database and sets the "userLoaded" flag to "true"
   */
  setUserData(): void {
    firebase.database().ref('clubs/12/players/' + this.user.uid).once('value', snapshot => {
      if (snapshot.val() != null) {
        console.log("in snapshot");
        this.userData = snapshot.val();
        this.userLoaded = true;
      }
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
      if (snapshot.val()){
        this.allTeamsVal = snapshot.val();
      }
      this.allTeams = teamArray;
      this.teamsLoaded = true;
    });
  }

  setPlayers() {
    return firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        counter++;
      }
      this.allPlayers = playerArray;
      this.allPlayers = _.sortBy(this.allPlayers, "lastname");
    });
  }

  createPlayer(playerId, playerData) {
    return firebase.database().ref('clubs/12/players/').child(playerId).set({
      birthday: playerData.birthday,
      email: playerData.email,
      firstname: playerData.firstname,
      gender: playerData.gender,
      helpCounter: playerData.helpCounter,
      isDefault: playerData.isDefault,
      isPlayer: playerData.isPlayer,
      isTrainer: playerData.isTrainer,
      lastname: playerData.lastname,
      picUrl: playerData.picUrl,
      platform: playerData.platform,
      pushid: playerData.pushid,
      state: playerData.state,
      team: playerData.team
    });
  }

  setInvites() {
    this.invitesLoaded = false;
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      let inviteArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        inviteArray[counter] = snapshot.val()[i];
        inviteArray[counter].id = i;
        counter++;
      }
      this.allInvites = inviteArray;
      this.invitesLoaded = true;
    })
  }

  calculateAge(birthdayString) {
    if (birthdayString != undefined) {
      let birthdayDate = new Date(birthdayString);

      let todayDate = new Date();
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
  }

  getRelevantTeams(birthdayString) {
    if (birthdayString != undefined) {
      let age = this.calculateAge(birthdayString);
      let relevantTeams: Array<any> = [];
      this.allTeams.forEach(function (team) {
        if (team.ageLimit > age || team.ageLimit == 0) {
          relevantTeams.push(team);
        }
      });
      return relevantTeams;
    }
  }

  addPlayerToTeam(teamID, userID) {
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
        firebase.database().ref('clubs/12/players/' + userID + '/').update({
          team: teamID
        });
      });
      //Team ID zum Player hinzufügen
      /*firebase.database().ref('clubs/12/players/' + userID+'/teams/').once('value', snapshot => {
        let playerTeams = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playerTeams[counter] = snapshot.val()[i];
          counter++;
        }
        playerTeams.push(teamID);
        firebase.database().ref('clubs/12/players/' + userID+'/').update({
          teams: playerTeams
        });
      });*/
    }
  }

  getPlayer(userID: any): any {
    return firebase.database().ref('clubs/12/players/' + userID).once('value')
      .then(user => {console.log("in utilities then"); return user});
  }

  updatePlayer(userID: any, data: any): any {
    return firebase.database().ref('clubs/12/players/' + userID).update(data);
  }

  updateMatch(matchID: any, data: any): any {
    return firebase.database().ref('clubs/12/matches/' + matchID).update(data);
  }

  removePlayerFromTeam(teamID, userID) {
    if (teamID != undefined && teamID != "0") {
      firebase.database().ref('clubs/12/teams/' + teamID + '/players').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              break;
            }
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/teams/' + teamID + '/players/' + userPosition).remove();
        }
        if (userID != undefined) {
          firebase.database().ref('clubs/12/players/' + userID + '/').update({
            team: '0'
          })
        }
      });
    }
  }

  sendPushNotification(pushIds: Array<any>, content: String) {
    let notificationObj = {
      contents: {en: content},
      include_player_ids: pushIds
    };
    window["plugins"].OneSignal.postNotification(notificationObj,
      function(successResponse) {
        console.log("Notification Post Success:", successResponse);
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
        //alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
      }
    )
  }

  sendGameReminderDayBefore(pushIds: Array<any>, content: String, timeOfMatch: string, matchID: String) {
    let reminderTime = new Date(timeOfMatch);
    reminderTime.setDate(reminderTime.getDate() - 1);
    let notificationObj = {
      contents: {en: content},
      send_after: reminderTime,
      include_player_ids: pushIds
    };
    window["plugins"].OneSignal.postNotification(notificationObj,
      function(successResponse) {
        console.log("Notification Post Success:", successResponse);
        firebase.database().ref('clubs/12/matches/' + matchID).update({delayedNotificationID: successResponse.id});
      },
      function (failedResponse) {
        console.log("Notification Post Failed: ", failedResponse);
        //alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
      }
    )
  }

  cancelPushNotification(notificationID: any) {
    window["plugins"].OneSignal.cancelNotification(notificationID);
  }

  hashPassword(password): any {
    let hash = 0, i, chr, len;
    if (password.length === 0) return hash;
    for (i = 0, len = password.length; i < len; i++) {
      chr   = password.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  countOpen(){
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      this.counterOpen = 0;
      let inviteArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        if(snapshot.val()[i].recipient == this.user.uid && snapshot.val()[i].state == 0){
          this.counterOpen++;
        }
      }
    });
  }

  openProfile(item, navCtrl){
    navCtrl.push(PlayerComponent, { player: item});
  }

  transformTime(time: String) {
    if(time != undefined){
      console.log(time.split("T")[0] + ", um " + time.split("T")[1].split("Z")[0]);
      return time.split("T")[0] + ", um " + time.split("T")[1].split("Z")[0];
    }
  }
}
