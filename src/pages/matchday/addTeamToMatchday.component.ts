//todo
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-addTeamToMatchday',
  templateUrl: 'addTeamToMatchday.component.html',
  providers: [MatchdayService]
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
  alreadyPending: number;
  allTeams: any;
  relevantTeams: any;
  allPlayers: any;
  buttonDisabled: Array<boolean>;

  ngOnInit(){
    this.alreadyPending = 0;
    if (this.match.acceptedPlayers){
      for (let i in this.match.acceptedPlayers){
        this.acceptedArray[i]=this.match.acceptedPlayers[i];
      }
    }
    if (this.match.pendingPlayers){
      for (let i in this.match.pendingPlayers){
        this.pendingArray[i]=this.match.pendingPlayers[i];
        this.alreadyPending++;
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
    this.relevantTeams = this.getRelevantTeams(this.allTeams[this.teamPosition].ageLimit);
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private MatchdayService: MatchdayService, private Utilities: Utilities, private alertCtrl: AlertController) {
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
    player.pending = true;
    console.log('pending: ' + this.pendingArray);
    console.log(this.pendingArray);
    console.log(this.match.id);
  }

  removePlayer(player){
    let counter = 0;
    if(player.pending == true){
      for (let i in this.pendingArray) {
        if (this.pendingArray[i] == player.id){
          this.pendingArray.splice(counter, 1);
        }
        counter ++;
      }
      player.pending = false;
      console.log('pending: ' + this.pendingArray);
    }
    if(player.accepted == true){
      for (let i in this.acceptedArray) {
        if (this.acceptedArray[i] == player.id){
          this.acceptedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter ++;
      }
      player.accepted = false;
      console.log('accepted: ' + this.acceptedArray);
      console.log('deleted: ' + this.deletedArray);
    }
    if(player.declined == true){
      for (let i in this.declinedArray) {
        if (this.declinedArray[i] == player.id){
          this.declinedArray.splice(counter, 1);
        }
        counter ++;
      }
      player.declined = false;
      console.log('declined: ' + this.declinedArray);
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

    firebase.database().ref('clubs/12/matches/' + this.match.id + '/').update({
      pendingPlayers: this.pendingArray,
      acceptedPlayers: this.acceptedArray,
      declinedPlayers: this.declinedArray
    })
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
    console.log(this.alreadyPending);

    for (var i = this.alreadyPending; i < this.pendingArray.length; i++){
      let id = this.makeid();
      firebase.database().ref('clubs/12/invites/').child(id).set({
        match: this.match.id.toString(),
        recipient: this.pendingArray[this.alreadyPending],
        sender: this.Utilities.user.uid,
        state: 0
      })
      this.alreadyPending++;
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

