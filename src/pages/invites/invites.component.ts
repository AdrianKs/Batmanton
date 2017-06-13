import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, NavParams } from 'ionic-angular';

import { InvitesMatchdayComponent } from "../invites/invitesmatchday.component";

import { Utilities } from '../../app/utilities';

import { InvitesProvider } from '../../providers/invites-provider';

import { document } from "@angular/platform-browser/src/facade/browser";

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
  today: String = new Date().toISOString();
  matchdayCount: any;

  ionViewWillEnter() {
    this.showLoadingElement();
    this.invitesProvider.setInvites();
    this.invitesProvider.setMatchdays().then(() => {
      this.matchdayCount = this.countMatchdays();
    });
    this.invitesProvider.setPlayers();
    this.loadingElement.dismiss();
  }

  ngOnInit() {

  }

  /**
   * Constructor that initializes necessary items.
   */
  constructor(public invitesProvider: InvitesProvider, private navCtrl: NavController, private navP: NavParams, public utilities: Utilities, public loadingCtrl: LoadingController) {
    //Load data in arrays
  }

  /**
   * Gets the URLs for the profile pictures of the first four players listed for a specific match in the database.
   * @param match Match that URLs are to be fetched for
   */
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

  /**
   * Counts how many future matchdays exist in the database for which invitations have been sent out.
   * @return amount of matchdays
   */
  countMatchdays() {
    let counter = 0;
    for (let match of this.invitesProvider.allMatchdays) {
      let states = this.countStates(match);
      if (states[0] > 0 || states[1] > 0 || states[2] > 0) {
        if (this.today <= match.time) {
          counter++;
        }
      }
    }
    return counter;
  }

  /**
   * Counts the states of the invites that have been sent out for 
   * a specific match and returns the number for each accepted, pending and declined invites.
   * @param match The match of which the states should be counted.
   * @return Array with the numbers for accepted, pending and declined invites.
   */
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

/**
 * Redirects the user to the more detailed matchday page.
 * @param ev click-event
 * @param value matchday that is to be displayed
 * @param invites Array of invites
 * @param players Array of players
 * @param counts Array with the status counts for invites
 * @param invitesProvider provider that delivers the data from the database
 */
  goToPage(ev, value, invites, players, picture, counts, invitesProvider) {
    this.navCtrl.push(InvitesMatchdayComponent, { matchday: value, invites: invites, players: players });
  }

  /**
  * Shows a Circle. Meant for instances where the user has to wait for data to be loaded. 
  */
  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loadingElement.present();
  }

  /**
   * Method that refreshes the information
   * @param refresher UI element that has to be used in order to trigger this method
   */
  doRefresh(refresher) {
    this.showLoadingElement();
    this.invitesProvider.setMatchdays();
    this.invitesProvider.setInvites();
    this.invitesProvider.setPlayers();
    refresher.complete();
    this.loadingElement.dismiss();
  }
}
