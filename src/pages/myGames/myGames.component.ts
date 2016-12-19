/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, AlertController } from 'ionic-angular';
import { MyGamesService } from '../../providers/myGames.service';
import firebase from 'firebase';

@Component({
  templateUrl: 'myGames.component.html',
  providers: [MyGamesService]
})

export class MyGamesComponent implements OnInit {

  ngOnInit() {
    this.getGames();
  }

  id: string = "13";
  gameStatus: string = "vergangende";
  dataGames: any;
  testRadioOpen: boolean;
  testRadioResult;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    
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


  doRadio() {
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
        }
        if(this.testRadioResult == 'miscellaneous' || this.testRadioResult == 'injured'){
          let prompt = this.alertCtrl.create({
            title: 'Verletzt/Sonstige',
            message: "Bitte näher ausführen:",
            inputs: [
              {
                name: 'cause',
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
                  console.log('Radio data:', data);
                  console.log('Send clicked');
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

  testData = [
      {
        date: "13.12.2016",
        matchday: "Spieltag 15",
        team: "Gladbacher KV",
        location: "Auswärts",
      },
      {
        date: "11.1.2017",
        matchday: "Spieltag 17",
        team: "Grostedt TCU",
        location: "Auswärts",
      },
      {
        date: "18.1.2017",
        matchday: "Spieltag 18",
        team: "RB Krefeld",
        location: "Heim",
      }
    ]

}
