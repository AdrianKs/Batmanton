//todo
//benachrichtigungsnummer im menu
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { GameDetailsComponent } from "../gameDetails/gameDetails.component";
import { MyGamesService } from '../../providers/myGames.service';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-myGames',
  templateUrl: 'myGames.component.html',
  providers: [MyGamesService]
})

export class MyGamesComponent implements OnInit {

  ngOnInit() {
    this.getGames();
    this.getInvites();
    console.log(this.today);
    if (this.today == "2017-01-23T17:12:27.881Z"){
      console.log("is the same")
    }
    if (this.today > "2017-01-24T17:12:27.881Z"){
      console.log("is bigger")
    }
    if (this.today < "2017-01-24T17:12:27Z"){
      console.log("is smaller")
    }
  }

  gameStatus: string = "vergangene";
  loggedInUserID: string = this.Utilities.user.uid;
  dataGames: any;
  dataInvites: any;
  testRadioOpen: boolean;
  testRadioResult;
  declined: boolean;
  accepted: boolean;
  pending: boolean;
  today: String = new Date().toISOString();

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private navP: NavParams, private MyGamesService: MyGamesService, private Utilities: Utilities) {

  }

  getGames(): void {
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
      })
    }

  getInvites(): void {
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      let inviteArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        inviteArray[counter] = snapshot.val()[i];
        inviteArray[counter].id = i;
        counter++;
      }
      this.dataInvites = inviteArray;
    })
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

  openDetails(ev, value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }

  verifyAccept(inviteItem){
    firebase.database().ref('clubs/12/invites/' + inviteItem.id).set({
      excuse: "",
      match: inviteItem.match,
      recipient: inviteItem.recipient,
      sender: inviteItem.sender,
      state: 1
    });
    inviteItem.state = 1;
    this.pendingToAccepted(inviteItem.match, this.loggedInUserID);
    let alert = this.alertCtrl.create({
      title: 'Zugesagt',
      message: 'Du wirst diesem Spieltag zugeteilt!',
      buttons: ['Ok']
    });
    alert.present()
  }

  doRadio(inviteItem, value) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Grund der Abwesenheit:');

    alert.addInput({
      type: 'radio',
      label: 'Erkältet',
      value: 'sick',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Verletzt',
      value: 'injured'
    });

    alert.addInput({
      type: 'radio',
      label: 'Schule/Studium/Beruf',
      value: 'education'
    });

    alert.addInput({
      type: 'radio',
      label: 'Privat',
      value: 'private'
    });

    alert.addInput({
      type: 'radio',
      label: 'Sonstige',
      value: 'miscellaneous'
    });

    alert.addButton('Abbruch');
    alert.addButton({
      text: 'Absenden',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        if(this.testRadioResult == 'sick' || this.testRadioResult == 'education' || this.testRadioResult == 'private'){
          console.log('Radio data:', data);
          inviteItem.state = 2;
          if (value == 0){
            this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
          } else {
            this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
          }
          firebase.database().ref('clubs/12/invites/' + inviteItem.id).set({
            excuse: data,
            match: inviteItem.match,
            recipient: inviteItem.recipient,
            sender: inviteItem.sender,
            state: 2
          });
        }
        if(this.testRadioResult == 'injured' || this.testRadioResult == 'miscellaneous'){
            let prompt = this.alertCtrl.create({
              title: 'Verletzt/Sonstige',
              message: "Bitte näher ausführen:",
              inputs: [
                {
                  name: 'extra',
                  placeholder: 'Wie lange wirst du ausfallen?'
                },
              ],
              buttons: [
                {
                  text: 'Abbruch',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Absenden',
                  handler: data => {
                    console.log('Radio data:', this.testRadioResult + ': ' +data.extra);
                    inviteItem.state = 2;
                    if (value == 0){
                      this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
                    } else {
                      this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
                    }
                    firebase.database().ref('clubs/12/invites/' + inviteItem.id).set({
                      excuse: this.testRadioResult + ': ' +data.extra,
                      match: inviteItem.match,
                      recipient: inviteItem.recipient,
                      sender: inviteItem.sender,
                      state: 2
                    });
                  }
                }
              ]
            });
            prompt.present();
          }
       }
     });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
  }

   doRefresh(refresher) {
      console.log('Refreshed');
      this.getGames();
      this.getInvites();
      setTimeout(() => {
        console.log('New Data loaded.');
        refresher.complete();
      }, 1000);
    }

  pendingToAccepted(matchID, userID){
    if (matchID != undefined && matchID != "0") {
      firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              break;
            }
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers/' + userPosition).remove();
        }
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          acceptedPlayers: playersArray
        });
      });
    }
  }

  pendingToDeclined(matchID, userID){
    if (matchID != undefined && matchID != "0") {
      firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              break;
            }
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers/' + userPosition).remove();
        }
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/declinedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          declinedPlayers: playersArray
        });
      });
    }
  }

  acceptedToDeclined(matchID, userID){
      firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers').once('value', snapshot => {
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              break;
            }
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers/' + userPosition).remove();
        }
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/declinedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          declinedPlayers: playersArray
        });
      });
  }

}
