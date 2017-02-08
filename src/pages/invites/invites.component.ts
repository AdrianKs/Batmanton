import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, NavParams } from 'ionic-angular';

import { InvitesMatchdayComponent } from "../invites/invitesmatchday.component";

import { Utilities } from '../../app/utilities';

import { InvitesProvider } from '../../providers/invites-provider';

@Component({
  selector: 'page-invites',
  templateUrl: 'invites.component.html',
  providers: [InvitesProvider]
})

export class InvitesComponent implements OnInit {
  login: any;
  loadingElement: any;
  allInvites: Array<any>;
  allPlayers: Array<any>;
  allMatchdays: Array<any>;

  ionViewWillEnter() {
    this.showLoadingElement();
    this.invitesProvider.setInvites();
    this.invitesProvider.setMatchdays();
    this.invitesProvider.setPlayers();
    this.loadingElement.dismiss();
  }

  ngOnInit() {

  }

  constructor(public invitesProvider: InvitesProvider, private navCtrl: NavController, private navP: NavParams, public utilities: Utilities, public loadingCtrl: LoadingController) {
    //Load data in arrays
  }

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.invitesProvider.allInvites) {
      if (i.match == match.id && i.sender == this.utilities.user.uid && counter < 4) {
        for (let j of this.invitesProvider.allPlayers) {
          if (i.recipient == j.id) {
            urlArray[counter] = j.picUrl;
            counter++;
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
    for (let i of this.invitesProvider.allInvites) {
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
    return [pending, accepted, declined];
  }

  goToPage(ev, value, invites, players, picture, counts, invitesProvider) {
    this.navCtrl.push(InvitesMatchdayComponent, { matchday: value, invites: invites, players: players});
  }

  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loadingElement.present();
  }

  doRefresh(refresher) {
    this.showLoadingElement();
    this.invitesProvider.setMatchdays();
    this.invitesProvider.setInvites();
    this.invitesProvider.setPlayers();
    refresher.complete();
    this.loadingElement.dismiss();
  }
}
