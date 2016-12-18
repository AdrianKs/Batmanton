/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { InvitesService } from '../../providers/invitesService';

import firebase from 'firebase';

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html',
  providers: [InvitesService]
})
export class InvitesMatchdayComponent {
  matchday: any;
  invites: any;
  players: any;

  constructor(private navCtrl: NavController, private navP: NavParams, private invitesService: InvitesService) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
  }
  

    

  goToPage() {

  }
}
