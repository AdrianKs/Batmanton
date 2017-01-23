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
  tempArray = [];
  alreadyPending: number;
  allTeams: any;
  relevantTeams: any;
  allPlayers: any;
  buttonDisabled: Array<boolean>;

  ngOnInit(){
    this.alreadyPending = 0;
    if (this.match.pendingPlayers){
      for (let i in this.match.pendingPlayers){
        this.tempArray[i]=this.match.pendingPlayers[i];
        this.alreadyPending++;
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
        playerArray[counter].added = false;
        playerArray[counter].included = false;
        if (this.match.acceptedPlayers){
          for (let i in this.match.acceptedPlayers){
            if (this.match.acceptedPlayers[i] == playerArray[counter].id){
              playerArray[counter].included = true;
            }
          }
        }
        if (this.match.pendingPlayers){
          for (let i in this.match.pendingPlayers){
            if (this.match.pendingPlayers[i] == playerArray[counter].id){
              playerArray[counter].included = true;
            }
          }
        }
        if (this.match.declinedPlayers){
          for (let i in this.match.declinedPlayers){
            if (this.match.declinedPlayers[i] == playerArray[counter].id){
              playerArray[counter].included = true;
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
    for (let i in this.tempArray) {
        counter++;
      }
    this.tempArray[counter]= player.id;
    player.added = true;
    console.log(this.tempArray);
    console.log(this.match.id);
  }

  removePlayer(player){
    let counter = 0;
    for (let i in this.tempArray) {
      if (this.tempArray[i] == player.id){
        this.tempArray.splice(counter, 1);
      }
      counter ++;
    }
    player.added = false;
    console.log(this.tempArray);
  }

  createGame(){
    this.match.pendingPlayers = this.tempArray;

    if (this.match.id){
      firebase.database().ref('clubs/12/matches/' + this.match.id + '/').update({
        pendingPlayers: this.match.pendingPlayers
      });
      this.matchesCounter = this.match.id;
    } else {
      firebase.database().ref('clubs/12/matches').once('value', snapshot => {
        let matchesArray = [];
        this.matchesCounter = 0;
        for (let i in snapshot.val()) {
          matchesArray[this.matchesCounter] = snapshot.val()[i];
          this.matchesCounter++;
        }
        matchesArray.push(this.match);
        firebase.database().ref('clubs/12').update({
            matches: matchesArray
        });
      });
    }
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      let invitesArray = [];
      let invitesCounter = 0;
      for (let i in snapshot.val()) {
        invitesArray[invitesCounter] = snapshot.val()[i];
        invitesCounter++;
      }
      console.log(this.alreadyPending);
      console.log(this.match.pendingPlayers.length);
      console.log(this.match.pendingPlayers[1]);
      for (var i = this.alreadyPending; i < this.match.pendingPlayers.length; i++){
        invitesArray.push({match: this.matchesCounter.toString(), recipient: this.match.pendingPlayers[this.alreadyPending], sender: this.Utilities.user.uid, state: 0});
        this.alreadyPending++;
      }
      firebase.database().ref('clubs/12').update({
          invites: invitesArray
      });
    });
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
              this.tempArray = this.match.pendingPlayers;
            } else {
              this.tempArray = [];
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present()
  }
}

