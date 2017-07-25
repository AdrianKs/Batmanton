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
  allInvites: any;
  allPlayers: any;
  counts: any;
  toast: any;
  confirm: any;
  loadingElement: any;
  profilePictureURL: any;
  playerStatus: string = 'accepted';

  /**
  * Constructor. Initializes variables
  * @param invitesProvider Provider instance that delivers the necessary data.
  * @param navCtrl Navigation Controller that enables navigation through the app.
  * @param navP navigation parameters are used to pass on information when navigation through the app
  * @param loadingCtrl controller that creates the possibiity to show loading elements
  * @param utilities instance of the utilities class that globally implements several methods which are used in several pages
  * @param alertCtrl controller that creates the possibility to show different variations of alerts
  * @param toastCtrl controller that creates the possibility to show toast messages
  */
  constructor(public invitesProvider: InvitesProvider, private navCtrl: NavController, private navP: NavParams, private loadingCtrl: LoadingController, public utilities: Utilities, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    //Load data in arrays
    this.matchday = navP.get('matchday');
    this.allInvites = navP.get('invites');
    this.counts = this.countStates(this.matchday);
    this.allPlayers = navP.get('players');
  }

  /**
   * method that counts the amount of times invitations to a specific match have been accepted declined or left pending
   * @param matchday matchday of which the states are to be counted
   * @return array of numbers for pending, accepted and declined invites
   */
  countStates(match) {
    let accepted = 0;
    let declined = 0;
    let pending = 0;
    for (let i of this.allInvites) {
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
  * Shows a toast message. Meant for instances where invitations are resent.
  */
  showMessage() {
    this.toast = this.toastCtrl.create({
      message: 'Die Einladung wurde erneut versendet.',
      position: 'top',
      duration: 3000,

    });
    this.toast.present();
  }

  /**
   * Shows a confirm dialogue for when an invitation is about to be resent.
   */
  showConfirm(player) {
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
            let pushIds = [];
            console.log(player);
            console.log("--------------------------");
            for (let i in player.pushid) {
              pushIds.push(i);
            }

            console.log(pushIds);

            let notificationMessage = "Erinnerung: Sie haben eine unbeantwortete Einladung:\n\n" + this.utilities.transformTime(this.matchday.time) + "\ngegen " + this.matchday.opponent +"\n" + this.matchday.location.street + ", " + this.matchday.location.zipcode;
            this.utilities.sendPushNotification(pushIds, notificationMessage);
            this.showMessage();
          }
        }
      ]
    });
    this.confirm.present();
  }

  /**
   * methode that redirects the user to the GameDetails page.
   * @param value match that is to be displayed
   */
  goToPage(value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }

  /**
   * shows a loading circle. Meant for instances where the user has to wait for data to be loaded
   */
  showLoadingElement() {
    this.loadingElement = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loadingElement.present();
  }

  /**
   * refreshes the data.
   * @param refresher UI element the user has to interact with in order to trigger the refresh
   */
  doRefresh(refresher) {
    this.showLoadingElement();
    this.invitesProvider.setInvites().then(() => {
      this.allInvites = this.invitesProvider.allInvites;
      this.counts = this.countStates(this.matchday);
    });
    this.invitesProvider.setPlayers().then(() => {
      this.allPlayers = this.invitesProvider.allPlayers;
    });
    refresher.complete();
    this.loadingElement.dismiss().catch(() => { });
  }

  /**
  * Removes a page from the top of the navigation stack and thus redirects the user to the previous page.
  */
  popPage() {
    this.navCtrl.pop();
  }
}

