/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, AlertController } from 'ionic-angular';
import { TestData } from './testData';

@Component({
  templateUrl: 'myGames.component.html'
})

export class MyGamesComponent {
  gameStatus: string = "vergangende";
  

  constructor(public navCtrl: NavController) {
    
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
