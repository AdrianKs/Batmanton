/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component'

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html'
})
export class InvitesMatchdayComponent {
  matchday: any;
  invites: any;
  players: any;
  profilePictureURL: any;


  constructor(private navCtrl: NavController, private navP: NavParams, public utilities: Utilities, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
  }

  showMessage() {
    let toast = this.toastCtrl.create({
      message: 'Die Einladung wurde erneut versendet',
      position: 'top',
      duration: 3000,

    });
    toast.present();
  }

  showConfirm(player) {
    let confirm = this.alertCtrl.create({
      title: 'Einladung erneut senden?',
      message: 'Möchten Sie diese Einladung erneut senden?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
          }
        },
        {
          text: 'Ja',
          handler: () => {
            let pushIds = [];
            console.log(player);
            console.log("under console log");
            let counter = 0;
            for (let i in player.pushid) {
              console.log(i);
              pushIds[counter] = i;
              counter++;
            }

            console.log(pushIds);

            this.utilities.sendPushNotification(pushIds, "Sie haben einen neue Einladung.");
            this.showMessage();
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

