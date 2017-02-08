import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component'
import { InvitesProvider } from '../../providers/invites-provider';

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html',
  providers: [InvitesProvider]
})

export class InvitesMatchdayComponent {

  matchday: any;
  invites: any;
  players: any;
  counts: any;
  toast: any;
  confirm: any;
  loadingElement: any;
  profilePictureURL: any;
  playerStatus: string = 'accepted';


  constructor(public invitesProvider: InvitesProvider, private navCtrl: NavController, private navP: NavParams, private loadingCtrl: LoadingController, public utilities: Utilities, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    //Load data in array
    this.matchday = navP.get('matchday');
    this.invites = navP.get('invites');
    this.counts = this.countStates(this.matchday);
    this.players = navP.get('players');
  }

  countStates(match) {
    let accepted = 0;
    let declined = 0;
    let pending = 0;
    for (let i of this.invites) {
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

  showMessage() {
    this.toast = this.toastCtrl.create({
      message: 'Die Einladung wurde erneut versendet.',
      position: 'top',
      duration: 3000,

    });
    this.toast.present();
  }

  showConfirm() {
    this.confirm = this.alertCtrl.create({
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
    this.confirm.present();
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
    this.invitesProvider.setInvites().then(() => {
       this.invites = this.invitesProvider.allInvites;
       this.counts = this.countStates(this.matchday);
    });
    this.invitesProvider.setPlayers().then(() => {
      this.players = this.invitesProvider.allPlayers;
    });
    refresher.complete();
    this.loadingElement.dismiss().catch(() => { });
  }

  popPage() {
    this.navCtrl.pop();
  }
}
