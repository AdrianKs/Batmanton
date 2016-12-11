/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'myGames.component.html'
})
export class MyGamesComponent {
  gameStatus: string = "vergangende";

  constructor(public navCtrl: NavController) {

  }

}
