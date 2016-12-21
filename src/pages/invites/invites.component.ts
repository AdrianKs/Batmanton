/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { InvitesMatchdayComponent } from "../invites/invitesmatchday.component";

import { loggedInUser } from '../../app/globalVars.ts';

import firebase from 'firebase';

@Component({
  selector: 'page-invites',
  templateUrl: 'invites.component.html',
  //providers: [InvitesService]
})

export class InvitesComponent implements OnInit {
  login: any;
  dataMatchday: any;
  dataInvite: any;
  dataPlayers: any;
  dataTeams: any;
  loggedInUserID: string = loggedInUser.uid;

  ngOnInit() {
    this.getInvite();
    this.getMatchday();
    this.getPlayers();
    this.getTeams();
  }

  constructor(private navCtrl: NavController, private navP: NavParams) {
    //Load data in arrays

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

  countStates(match) {
    let accepted = 0;
    let declined = 0;
    let pending = 0;
    for (let i of this.dataInvite) {
      if (i.match == match.id && i.sender == this.loggedInUserID) {
        if (i.state == 0) {
          pending = pending + 1;
        } else if (i.state == 1) {
          accepted = accepted + 1;
        } else if (i.state == 2) {
          declined = declined + 1;
        }
      }
    }
    //return [{pen: pending, acc: accepted, dec: declined}];
    return [pending, accepted, declined];
  }

  formatMatchTime(match) {
    return match.time.split("-")[2] + "." + match.time.split("-")[1] + "." + match.time.split("-")[0]
      + " " + match.time.split("-")[3] + ":" + match.time.split("-")[4];
  }

  goToPage(ev, value, invites, players, picture) {
    this.navCtrl.push(InvitesMatchdayComponent, { matchday: value, invites: invites, players: players });
  }
}
