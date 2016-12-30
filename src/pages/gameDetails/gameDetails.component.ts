/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyGamesService } from '../../providers/myGames.service';
import firebase from 'firebase';

@Component({
  selector: 'page-gameDetails',
  templateUrl: 'gameDetails.component.html',
  providers: [MyGamesService]
})
export class GameDetailsComponent {
  playerStatus: string = 'accepted';
  gameItem: any;

  constructor(private navCtrl: NavController, private navP: NavParams, private MyGamesService: MyGamesService) {
    //Load data in array
    this.gameItem = navP.get('gameItem');
  }
}

