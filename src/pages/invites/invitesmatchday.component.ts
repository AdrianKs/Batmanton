/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {Utilities} from '../../app/utilities';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component'

import firebase from 'firebase';

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html'
})
export class InvitesMatchdayComponent {
  matchday: any;
  invites: any;
  players: any;
  profilePictureURL: any;


  constructor(private navCtrl: NavController, private navP: NavParams, public utilities: Utilities) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
  }

  getProfilePictureURL(player) {
    /* var that = this;
     firebase.storage().ref().child("profilePictures/" + loggedInUser.id + "/" + loggedInUser.id + ".jpg").getDownloadURL().then(function (url) {
       that.profilePictureURL = url;
     }).catch(function(error) {
       that.profilePictureURL = "../../assets/images/ic_account_circle_black_48dp_2x.png";
     });
     return that.profilePictureURL;*/
    return "../../assets/images/ic_account_circle_black_48dp_2x.png";
  }

  goToPage(value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }
}
