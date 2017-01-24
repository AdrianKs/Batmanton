/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { InvitesMatchdayComponent } from "../invites/invitesmatchday.component";

import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-invites',
  templateUrl: 'invites.component.html',
  //providers: [InvitesService]
})

export class InvitesComponent implements OnInit {
  login: any;
  dataMatchday: any;

  ionViewWillEnter() {
    this.utilities.setInvites();
    this.getMatchday();
  }
  
  ngOnInit() {

  }

  constructor(private navCtrl: NavController, private navP: NavParams, public utilities: Utilities) {
    //Load data in arrays

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

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.utilities.allInvites) {
      if (i.match == match.id && i.sender == this.utilities.user.uid && counter < 4){
          for(let j of this.utilities.allPlayers){
            if(i.recipient == j.id){
              urlArray[counter] = j.picUrl;
              counter ++;
            }
          }
      }
    }
    return urlArray;
  }

  countStates(match) {
    let accepted = 0;
    let declined = 0;
    let pending = 0;
    for (let i of this.utilities.allInvites) {
      if (i.match == match.id && i.sender == this.utilities.user.uid) {
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

  goToPage(ev, value, invites, players, picture) {
    this.navCtrl.push(InvitesMatchdayComponent, { matchday: value, invites: invites, players: players });
  }
}
