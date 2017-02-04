/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
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
  counts: any;
  loadingElement: any;
  profilePictureURL: any;
  playerStatus: string = 'accepted';


  constructor(private navCtrl: NavController, private navP: NavParams, private loadingCtrl: LoadingController, public utilities: Utilities, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.players = navP.get('players');
    this.counts = navP.get('counts');
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

  showMessage() {
    let toast = this.toastCtrl.create({
      message: 'Die Einladung wurde erneut versendet.',
      position: 'top',
      duration: 3000,

    });
    toast.present();
  }

  showConfirm() {
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


  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loadingElement.present();
  }

  doRefresh(refresher) {
    this.showLoadingElement();
    this.utilities.setInvites();
    this.invites = this.utilities.allInvites;
    this.utilities.setPlayers();
    this.players = this.utilities.allPlayers;
    this.counts = this.countStates(this.matchday);
    refresher.complete();
    this.loadingElement.dismiss().catch(() => { });
  }

  popPage() {
    this.navCtrl.pop();
  }
}
