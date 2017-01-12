//todo
//unterscheidung zwischen vergangende/bevorstehende ggf. Sortierung?
//update nach klick
//SCSS
//Menüleiste für offene Games
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { GameDetailsComponent } from "../gameDetails/gameDetails.component";
import { MyGamesService } from '../../providers/myGames.service';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-myGames',
  templateUrl: 'myGames.component.html',
  providers: [MyGamesService]
})

export class MyGamesComponent implements OnInit {

  ngOnInit() {
    this.getGames();
    this.getInvites();
  }

  gameStatus: string = "vergangende";
  loggedInUserID: string = this.utilities.user.uid;
  dataGames: any;
  dataInvites: any;
  testRadioOpen: boolean;
  testRadioResult;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private navP: NavParams, private MyGamesService: MyGamesService, public utilities: Utilities) {

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
    this.utilities.pushToAccepted(inviteItem.match, this.loggedInUserID);
    let alert = this.alertCtrl.create({
      title: 'Zugesagt',
      message: 'Du wirst diesem Spieltag zugeteilt!',
      buttons: ['Ok']
    });
    alert.present()
  }

  doRadio(inviteItem) {
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
          this.utilities.pushToDeclined(inviteItem.match, this.loggedInUserID);
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
                    console.log('Send clicked');
                    this.utilities.pushToDeclined(inviteItem.match, this.loggedInUserID);
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
}
