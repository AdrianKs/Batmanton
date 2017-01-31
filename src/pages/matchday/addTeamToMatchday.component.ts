//todo
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-addTeamToMatchday',
  templateUrl: 'addTeamToMatchday.component.html',
})

export class AddTeamToMatchdayComponent implements OnInit{
  geschlecht: string = 'maenner';
  match: any;
  invite: any;
  teamSelection: any;
  teamPosition: number;
  counter: number = 0;
  matchesCounter: number;
  acceptedArray = [];
  pendingArray = [];
  declinedArray = [];
  deletedArray = [];
  allTeams: any;
  relevantTeams: any;
  allPlayers: any;
  buttonDisabled: Array<boolean>;

  ngOnInit(){
    if (this.match.acceptedPlayers){
      for (let i in this.match.acceptedPlayers){
        this.acceptedArray[i]=this.match.acceptedPlayers[i];
      }
    }
    if (this.match.pendingPlayers){
      for (let i in this.match.pendingPlayers){
        this.pendingArray[i]=this.match.pendingPlayers[i];
      }
    }
    if (this.match.declinedPlayers){
      for (let i in this.match.declinedPlayers){
        this.declinedArray[i]=this.match.declinedPlayers[i];
      }
    }
    this.allPlayers = this.setPlayers();
    this.teamSelection = this.match.team;
    let counter = 0;
    for (let i in this.allTeams) {
        if (this.match.team == this.allTeams[i].id){
          this.teamPosition = counter;
          break;
        }
        counter ++;
      }
    if (this.match.team == "0"){
      this.relevantTeams = this.getRelevantTeams(0);
    } else {
      this.relevantTeams = this.getRelevantTeams(this.allTeams[this.teamPosition].ageLimit);
    }
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private Utilities: Utilities, private alertCtrl: AlertController) {
    this.match = navP.get('matchItem');
    this.allTeams = navP.get('relevantTeamsItem');
  }

  setPlayers() {
    firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        playerArray[counter].accepted = false;
        playerArray[counter].pending = false;
        playerArray[counter].declined = false;
        if (this.match.acceptedPlayers){
          for (let i in this.match.acceptedPlayers){
            if (this.match.acceptedPlayers[i] == playerArray[counter].id){
              playerArray[counter].accepted = true;
            }
          }
        }
        if (this.match.pendingPlayers){
          for (let i in this.match.pendingPlayers){
            if (this.match.pendingPlayers[i] == playerArray[counter].id){
              playerArray[counter].pending = true;
            }
          }
        }
        if (this.match.declinedPlayers){
          for (let i in this.match.declinedPlayers){
            if (this.match.declinedPlayers[i] == playerArray[counter].id){
              playerArray[counter].declined = true;
            }
          }
        }
        counter++;
      }
      this.allPlayers = playerArray;
      this.allPlayers = _.sortBy(this.allPlayers, "lastname");
    });
  }

  getRelevantTeams(ageLimit) {
    let relevantTeams: Array<any> = [];
    this.allTeams.forEach(function (team) {
      if (team.ageLimit <= ageLimit || ageLimit === 0) {
        relevantTeams.push(team);
      }
    });
    return relevantTeams;
  }

  addPlayer(player){
    let counter = 0;
    for (let i in this.pendingArray) {
      counter++;
    }
    this.pendingArray[counter]= player.id;
    for (let i in this.deletedArray){
      if (this.deletedArray[i] == player.id){
        this.deletedArray[i] = null;
      }
    }
    player.pending = true;
    console.log('pending:');
    console.log(this.pendingArray);
  }

  removePlayer(player){
    let counter = 0;
    if(player.pending == true){
      for (let i in this.pendingArray) {
        if (this.pendingArray[i] == player.id){
          this.pendingArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter ++;
      }
      player.pending = false;
      console.log('pending: ');
      console.log(this.pendingArray);
    }
    counter = 0;
    if(player.accepted == true){
      for (let i in this.acceptedArray) {
        if (this.acceptedArray[i] == player.id){
          this.acceptedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter ++;
      }
      player.accepted = false;
      console.log('accepted: ');
      console.log(this.acceptedArray);
      console.log('deleted: ');
      console.log(this.deletedArray);
    }
    counter = 0;
    if(player.declined == true){
      for (let i in this.declinedArray) {
        if (this.declinedArray[i] == player.id){
          this.declinedArray.splice(counter, 1);
        }
        counter ++;
      }
      player.declined = false;
      console.log('declined: ');
      console.log(this.declinedArray);
    }
  }

  makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  confirmPlayer(){
    let pushIDs = [];
    let counter = 0;
    firebase.database().ref('clubs/12/matches/' + this.match.id + '/').update({
      pendingPlayers: this.pendingArray,
      acceptedPlayers: this.acceptedArray,
      declinedPlayers: this.declinedArray
    });

    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let i in snapshot.val()) {
        for (let j in this.deletedArray){
          if (snapshot.val()[i].match == this.match.id && snapshot.val()[i].recipient == this.deletedArray[j]){
            console.log("gefunden");
            console.log(i);
            firebase.database().ref('clubs/12/invites/' + i).remove();
          }
        }
      }
    });

    //counter = 0;
    for (let k in this.pendingArray){
      counter = 0;
      let inviteExists = false;
      firebase.database().ref('clubs/12/invites').once('value', snapshot => {
        for (let i in snapshot.val()) {
          if (snapshot.val()[i].match == this.match.id && snapshot.val()[i].recipient == this.pendingArray[k]){
            console.log("inviteExists now true");
            if (snapshot.val()[i].state != 0){
              //push-Benachrichtigung an snapshot.val()[i].recipient
              //Zugriff auf Spielerobjekt
              for (let j in this.allPlayers){
                if (this.allPlayers[j].id == snapshot.val()[i].recipient){
                  for (let pushID in this.allPlayers[j].pushid){
                    console.log(this.allPlayers[j]);
                    pushIDs[counter] = pushID;
                    //pushIDs.push(pushID);
                    counter++;
                  }
                }
              }
            }
            firebase.database().ref('clubs/12/invites/' + i).update({
              state: 0
            });
            inviteExists = true;
          }
        }
        if (inviteExists == false){
          let id = this.makeid();
          firebase.database().ref('clubs/12/invites/').child(id).set({
            match: this.match.id.toString(),
            recipient: this.pendingArray[k],
            sender: this.Utilities.user.uid,
            state: 0
          });
          //push-Benachrichtigung an this.pendingArray[k]
          //Zugriff auf Spielerobjekt
          //counter = 0;
          for (let l in this.allPlayers){
            if (this.allPlayers[l].id == this.pendingArray[k]){
              for (let pushID in this.allPlayers[l].pushid){
                console.log(this.allPlayers[l]);
                console.log("hier kommt eine pushID");
                console.log(pushID);
                pushIDs[counter] = pushID;
                counter++;
                //pushIDs.push(pushID);
              }
            }
          }
        }
        console.log(pushIDs);
        if(pushIDs.length != 0){
          console.log("ruft pushfunction");
          this.Utilities.sendPushNotification(pushIDs, 'Sie haben eine Einladung zu einem Spiel erhalten');
        }
      });
    }


    this.navCtrl.popToRoot();
  }

  goBack(){
    let confirm = this.alertCtrl.create({
      title: 'Warnung',
      message: 'Beim Verlassen des Fensters gehen alle Veränderungen verloren. Fortfahren?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
          }
        },
        {
          text: 'Ja',
          handler: () => {
            if(this.match.pendingPlayers){
              this.pendingArray = this.match.pendingPlayers;
            } else {
              this.pendingArray = [];
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}

