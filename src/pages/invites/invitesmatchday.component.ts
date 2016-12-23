/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { InvitesService } from '../../providers/invitesService';

import { AboutComponent } from '../about/about.component'

import firebase from 'firebase';

import { loggedInUser } from '../../app/globalVars';

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html',
  providers: [InvitesService]
})
export class InvitesMatchdayComponent {
  matchday: any;
  invites: any;
  players: any;
  profilePictureURL: any;
  loggedInUserID: string = loggedInUser.uid;

  constructor(private navCtrl: NavController, private navP: NavParams, private invitesService: InvitesService) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
  }

  getProfilePictureURL(player) {
    /* var that = this;
     firebase.storage().ref().child("profilePictures/" + player.id + "/" + player.id + ".jpg").getDownloadURL().then(function (url) {
       that.profilePictureURL = url;
     }).catch(function(error) {
       that.profilePictureURL = "../../assets/images/ic_account_circle_black_48dp_2x.png";
     });
     return that.profilePictureURL;*/
    return "../../assets/images/ic_account_circle_black_48dp_2x.png";
  }

  goToPage() {
    this.navCtrl.push(AboutComponent);
  }
}
