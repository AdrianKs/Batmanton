/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { InvitesMatchdayComponent } from "../invites/invitesmatchday.component";

import { InvitesService } from '../../providers/invitesService';

import firebase from 'firebase';

@Component({
  selector: 'page-invites',
  templateUrl: 'invites.component.html',
  providers: [InvitesService]
})

export class InvitesComponent {
  dataMatchday: any;
  dataInvite: any;
  dataPlayers: any;
  dataTeams: any;

  //  matchday: any;
  data: any;

  constructor(private navCtrl: NavController, private navP: NavParams, private invitesService: InvitesService) {
    //Load data in array
    this.getMatchday();
    this.getInvite();
    this.getPlayers();
    this.getTeams();
    this.data = [{ dataPlayer: this.dataMatchday }, { dataInvite: this.dataInvite }]
  }

  getInvite(): void {
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      let inviteArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        inviteArray[counter] = snapshot.val()[i];
        inviteArray[counter].id = i;
        counter++;
      }
      this.dataInvite = inviteArray;
    })
  }

  getTeams(): void {
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamsArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamsArray[counter] = snapshot.val()[i];
        teamsArray[counter].id = i;
        counter++;
      }
      this.dataTeams = teamsArray;
    })
  }

  getPlayers(): void {
    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      let playersArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playersArray[counter] = snapshot.val()[i];
        playersArray[counter].id = i;
        counter++;
      }
      this.dataPlayers = playersArray;
    })
  }

  getMatchday(): void {
    firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      let matchdayArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        matchdayArray[counter] = snapshot.val()[i];
        matchdayArray[counter].id = i;
        counter++;
      }
      this.dataMatchday = matchdayArray;
    })
  }

  goToPage(ev, value, invites, players) {
    this.navCtrl.push(InvitesMatchdayComponent, { matchday: value, invites: invites, players: players });
  }
}
