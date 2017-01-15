/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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


  constructor(private navCtrl: NavController, private navP: NavParams, public utilities: Utilities, public alertCtrl: AlertController) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Einladung erneut senden?',
      message: 'Möchten Sie diese Einladung erneut senden?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
            console.log('Nicht versendet');
          }
        },
        {
          text: 'Ja',
          handler: () => {
            console.log('versendet');
          }
        }
      ]
    });
    confirm.present();
  }

  goToPage(value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }
}
