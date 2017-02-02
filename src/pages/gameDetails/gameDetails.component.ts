//todo
//4 men 2 women for isNotMini (Logik allgemein)
//aushilfscounter
//Adressvorlagen
//pending bei Zeitänderung
//spieler selbst bei gamedetails löschen
//Alter der Leute
//dummy
//home bug
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { AddTeamToMatchdayComponent } from '../matchday/addTeamToMatchday.component';
import { PlayerComponent } from './player.component';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-gameDetails',
  templateUrl: 'gameDetails.component.html',
})
export class GameDetailsComponent implements OnInit{

  editMode: boolean = false;
  playerStatus: string = 'accepted';
  isAdmin: boolean;
  currentUser: any;
  loading: any;
  gameItem: any;
  playerArray: any;
  teamArray: any;

  opponentOld: string;
  teamOld: string;
  homeOld: boolean;
  streetOld: string;
  zipcodeOld: number;
  timeOld: string;

  opponentChanged: boolean;
  teamChanged: boolean;
  homeChanged: boolean;
  streetChanged: boolean;
  zipcodeChanged: boolean;
  timeChanged: boolean;

  ngOnInit() {
    this.isTrainer();
    this.playerArray = this.Utilities.allPlayers;  
  }

  ionViewWillEnter() {
    this.setTeams(true, null);
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private Utilities: Utilities,  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.gameItem = navP.get('gameItem');
  }

  isTrainer() {
      this.currentUser = this.Utilities.user;
      firebase.database().ref("/clubs/12/players/" + this.currentUser.uid + "/").once('value', snapshot => {
          let data = snapshot.val();
          if (this.isAdmin = data.isTrainer){
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
      })
  }

  setTeams(showLoading: boolean, event) {
    if (showLoading) {
      this.createAndShowLoading();
    }
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.teamArray = teamArray;
      this.teamArray = teamArray;
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
    for (let i of this.Utilities.allInvites) {
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

  editProfile() {
    this.opponentOld = this.gameItem.opponent;
    this.teamOld = this.gameItem.team;
    this.homeOld = this.gameItem.home;
    this.streetOld = this.gameItem.location.street;
    this.zipcodeOld = this.gameItem.location.zipcode;
    this.timeOld = this.gameItem.time;
    this.editMode = true;
  }

  finishEditProfile() {
    if (this.opponentChanged || this.teamChanged || this.homeChanged || this.streetChanged || this.zipcodeChanged || this.timeChanged) {
      firebase.database().ref('clubs/12/matches/' + this.gameItem.id).set({
        opponent: this.gameItem.opponent,
        team: this.gameItem.team,
        home: this.gameItem.home,
        time: this.gameItem.time
      });
      if(this.gameItem.acceptedPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          acceptedPlayers: this.gameItem.acceptedPlayers
        });   
      }
      if(this.gameItem.pendingPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          pendingPlayers: this.gameItem.pendingPlayers
        });   
      }
      if(this.gameItem.declinedPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          declinedPlayers: this.gameItem.declinedPlayers
        });   
      }
      firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/location').set({
        street: this.gameItem.location.street,
        zipcode: this.gameItem.location.zipcode
      });
    }
    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.editMode = false;
  }

  opponentEnteredChanged(input) {
    if (this.opponentOld != input) {
      this.opponentChanged = true;
    } else {
      this.opponentChanged = false;
    }
  }

  streetEnteredChanged(input) {
    if (this.streetOld != input) {
      this.streetChanged = true;
    } else {
      this.streetChanged = false;
    }
  }

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      this.teamChanged = true;
    } else {
      this.teamChanged = false;
    }
  }

  homeSelectChanged(input) {
    if (this.homeOld != input) {
      this.homeChanged = true;
    } else {
      this.homeChanged = false;
    }
    console.log(this.homeChanged);
  }

  zipcodeSelectChanged(input){
    if (this.zipcodeOld != input) {
      this.zipcodeChanged = true;
    } else {
      this.zipcodeChanged = false;
    }
  }

  timeSelectChanged(input) {
    if (this.timeOld != input) {
      this.timeChanged = true;
    } else {
      this.timeChanged = false;
    }
  }

  cancelEditProfile() {
    this.gameItem.opponent = this.opponentOld;
    this.gameItem.team = this.teamOld;
    this.gameItem.home = this.homeOld;
    this.gameItem.location.street = this.streetOld;
    this.gameItem.location.zipcode = this.zipcodeOld;
    this.gameItem.time = this.timeOld;

    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.editMode = false;
  }

  openProfile(item){
    this.navCtrl.push(PlayerComponent, { player: item});
  }

  goBack(){
    this.navCtrl.pop();
  }

  addPlayers(){
    if (this.gameItem.team == "0"){
      let error = this.alertCtrl.create({
        title: 'Achtung!',
        message: 'Bitte Mannschaft auswählen, damit Spieler hinzugefügt werden können.',
        buttons: ['Okay']
      });
      error.present();
    } else {
      this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.gameItem, relevantTeamsItem: this.teamArray});
    }
  }

  removePlayer(item){
    
  }

  deleteGame(){
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
            firebase.database().ref('clubs/12/invites').once('value', snapshot => {
              for (let i in snapshot.val()) {
                if (snapshot.val()[i].match == this.gameItem.id){
                  firebase.database().ref('clubs/12/invites/' + i).remove();
                }     
              }      
            });
            firebase.database().ref('clubs/12/matches/' + this.gameItem.id).remove();
            this.navCtrl.popToRoot();
          }
        }
      ]
    });
    confirm.present();
  }
  
}

