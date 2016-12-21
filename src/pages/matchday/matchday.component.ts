/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GameDetailsComponent } from '../gameDetails/gameDetails.component';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';

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
  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService) {
    
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
  
  openDetails(ev, value) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value });
  }

}

