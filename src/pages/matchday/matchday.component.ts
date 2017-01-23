/**
 * Created by kochsiek on 08.12.2016.
 */
//todo
//mannschaftsbild (check)
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component';
import { CreateMatchdayComponent } from './createMatchday.component';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-matchday',
  templateUrl: 'matchday.component.html',
  providers: [MatchdayService]
})

export class MatchdayComponent implements OnInit {

  ngOnInit() {
    this.getGames();
  }

  dataGames: any;
  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService, private Utilities: Utilities) {
    
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

  doRefresh(refresher) {
    console.log('Refreshed');
    this.getGames();
    setTimeout(() => {
      console.log('New Data loaded.');
      refresher.complete();
    }, 1000);
  }


  createGame(){
    this.navCtrl.push(CreateMatchdayComponent);
  }
}

