//todo
//keine spiele vorhanden
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component';
import { CreateMatchdayComponent } from './createMatchday.component';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-matchday',
  templateUrl: 'matchday.component.html',
})

export class MatchdayComponent implements OnInit {

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isTrainer();
    this.dataInvites = this.Utilities.allInvites;
    this.loadData(true, null);
  }

  dataGames: any;
  dataInvites: any;
  loading: any;
  currentUser: any;
  isAdmin: boolean;
  
  constructor(public navCtrl: NavController, private Utilities: Utilities, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    
  }

  isTrainer() {
        this.currentUser = this.Utilities.user;
        firebase.database().ref('/clubs/12/players/' + this.currentUser.uid + '/').once('value', snapshot => {
            let data = snapshot.val();
            this.isAdmin = data.isTrainer;
        });
    }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      let gamesArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        gamesArray[counter] = snapshot.val()[i];
        gamesArray[counter].id = i;
        counter++;
      }
      this.dataGames = gamesArray;
      this.dataGames = _.sortBy(this.dataGames, "time").reverse();
    }).then((data) => {
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
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loading.present();
  }

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.dataInvites) {
      if (i.match == match.id && i.sender == this.Utilities.user.uid && counter < 4){
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

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }


  createGame(){
    this.navCtrl.push(CreateMatchdayComponent);
  }
}

