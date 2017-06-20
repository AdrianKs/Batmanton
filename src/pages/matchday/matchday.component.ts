import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component';
import { CreateMatchdayComponent } from './createMatchday.component';
import { MyGamesProvider } from '../../providers/myGames-provider';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-matchday',
  templateUrl: 'matchday.component.html',
  providers: [MyGamesProvider]
})

export class MatchdayComponent implements OnInit {

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isTrainer();
    this.loadData(true, null);
  }

  dataGames: any;
  dataInvites: any;
  loading: any;
  currentUser: any;
  isAdmin: boolean = false;
  gamesAvailable: boolean = false;
  counter: any;

  constructor(public navCtrl: NavController, public myGamesProvider: MyGamesProvider, private Utilities: Utilities, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

  isTrainer() {
        this.currentUser = this.Utilities.user;
        firebase.database().ref('/clubs/12/players/' + this.currentUser.uid + '/').once('value', snapshot => {
            let data = snapshot.val();
            if(data){
              this.isAdmin = data.isTrainer;
            }
        });
    }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    this.myGamesProvider.setInvites().then((data) => {
      this.dataInvites = this.myGamesProvider.dataInvites;
      if (showLoading) {
      this.loading.dismiss().catch((error) => console.log("error caught"));
      }
      if(event!=null){
        event.complete();
      }
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.myGamesProvider.setGames().then((data) => {
      this.dataGames = this.myGamesProvider.dataGames;
      this.gamesAvailable = true;
      if (this.dataGames.length == 0){
        this.gamesAvailable = false;
      }
      if (showLoading) {
      this.loading.dismiss().catch((error) => console.log("error caught"));
      }
      if(event!=null){
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
      spinner: 'ios'
    })
    this.loading.present();
  }

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.dataInvites) {
      if (i.match == match.id && counter < 4){
          for(let j of this.Utilities.allPlayers){
            if(i.recipient == j.id){
              urlArray[counter] = j.picUrl;
              counter ++;
            }
          }
      }
    }
    return urlArray;
  }

  openDetails(ev, value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }

  createGame(){
    this.navCtrl.push(CreateMatchdayComponent);
  }

  deleteGame(gameItem){
    let confirm = this.alertCtrl.create({
      title: 'Warnung',
      message: 'Daten können nach Löschvorgang nicht wiederhergestellt werden. Fortfahren?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
          }
        },
        {
          text: 'Ja',
          handler: () => {
            firebase.database().ref('clubs/12/players').once('value', snapshot => {
              for (let i in snapshot.val()){
                for (let j in gameItem.acceptedPlayers){
                  if (gameItem.acceptedPlayers[j] == i && snapshot.val()[i].team != gameItem.team){
                    let newHelpCounter = snapshot.val()[i].helpCounter;
                    newHelpCounter--;
                    firebase.database().ref('clubs/12/players/' + i).update({
                      helpCounter: newHelpCounter
                    });
                  }
                }
              }
            });
            firebase.database().ref('clubs/12/invites').once('value', snapshot => {
              for (let i in snapshot.val()) {
                if (snapshot.val()[i].match == gameItem.id){
                  firebase.database().ref('clubs/12/invites/' + i).remove();
                }
              }
            });
            firebase.database().ref('clubs/12/matches/' + gameItem.id).remove()
              .then(() => {
                this.loadData(true, null);
              });
          }
        }
      ]
    });
    confirm.present();
  }
}

