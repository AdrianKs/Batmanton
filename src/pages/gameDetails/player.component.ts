import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { MyGamesProvider } from '../../providers/myGames-provider';

@Component({
    selector: 'page-player',
    templateUrl: 'player.component.html',
    providers: [MyGamesProvider]
})
export class PlayerComponent {
    ionViewWillEnter() {
    this.loadData(true, null);
  }

    player: any;
    playerStatus: String = "accepted";
    dataGames: any;
    loading: any;

    constructor(private navCtrl: NavController, private navParams: NavParams, private myGamesProvider: MyGamesProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
        this.player = navParams.get('player');
    }

    loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    
    this.myGamesProvider.setGames().then((data) => {
    this.dataGames = this.myGamesProvider.dataGames;
    for (let i of this.dataGames) {
        console.log(this.dataGames[i].acceptedPlayers);
    }
    if (showLoading) {
        this.loading.dismiss().catch((error) => console.log("error caught"));
    }
    if (event != null) {
        event.complete();
    }
    }).catch(function (error) {
    if (showLoading) {
        this.createAndShowErrorAlert(error);
    }
    });
  }

  createAndShowErrorAlert(error) {
    let alert = this.alertCtrl.create({
      title: 'Fehler beim Empfangen der Daten',
      message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten :-(',
      buttons: ['OK']
    });
    alert.present();
  }

  createAndShowLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loading.present();
  }

    goBack(){
        this.navCtrl.pop();
    }
}
