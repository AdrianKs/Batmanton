import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { MyGamesProvider } from '../../providers/myGames-provider';
import firebase from 'firebase';

@Component({
    selector: 'page-player',
    templateUrl: 'player.component.html',
    providers: [MyGamesProvider]
})
export class PlayerComponent {

    ionViewWillEnter() {
    //this.loadData(true, null);
  }

    player: any;
    playerStatus: String = "accepted";
    dataGames: any;
    loading: any;
    acceptedCounter = 0;
    pendingCounter = 0;
    declinedCounter = 0;

    constructor(private navCtrl: NavController, private navParams: NavParams, public myGamesProvider: MyGamesProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
        this.player = navParams.get('player');
    }

    loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    
    this.myGamesProvider.setGames().then((data) => {
    this.dataGames = this.myGamesProvider.dataGames;
    console.log(this.dataGames);
    console.log(this.player.id);
    for (let i in this.dataGames) {
        for (let j in this.dataGames[i].acceptedPlayers){
            if (this.dataGames[i].acceptedPlayers[j]==this.player.id){
                this.dataGames[i].accepted=true;
                this.acceptedCounter++;
            }
        }
        for (let j in this.dataGames[i].pendingPlayers){
            if (this.dataGames[i].pendingPlayers[j]==this.player.id){
                this.dataGames[i].pending=true;
                this.pendingCounter++;
            }
        }
        for (let j in this.dataGames[i].declinedPlayers){
            if (this.dataGames[i].declinedPlayers[j]==this.player.id){
                this.dataGames[i].declined=true;
                this.declinedCounter++;
            }
        }
    }
    if (showLoading) {
        this.loading.dismiss().catch((error) => console.log("error caught"));
    }
    if (event != null) {
        event.complete();
    }
    }).catch((error) => {
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

  getFirstFourPicUrls(match) {
  }
    goBack(){
        this.navCtrl.pop();
    }
}
