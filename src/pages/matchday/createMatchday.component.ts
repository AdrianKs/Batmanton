//todo
//Spiel erstellen-Screen erstellen
//Datenbankveränderung integrieren
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import {Utilities} from "../../app/utilities";

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [MatchdayService]
})

export class CreateMatchdayComponent implements OnInit {
  match = {opponent: this.opponent, team: this.team, home: this.home, location: {address: this.address, zipcode: this.zipcode}, time: this.time};
  opponent: string;
  team: any;
  home: boolean;
  address: string;
  zipcode: number;
  time: String;
  relevantTeams = this.Utilities.allTeams;
  teamChanged: boolean = false;
  dayChanged: boolean = false;

  ngOnInit() {

  }

  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService, private Utilities: Utilities) {
  }

  teamSelectChanged(input) {
    this.team = input;
    this.teamChanged = true;
  }

  daySelectChanged() {
    this.dayChanged = true;
  }

  createGame(){
    if (this.match.home == true){
      this.match.home = true;
    } else {
      this.match.home = false;
    }
    this.match.time = this.match.time.substring(0, this.match.time.length - 1);
    this.match.time = this.match.time.replace("T","-");
    this.match.time = this.match.time.replace(/:/g,"-");


    firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      let matchesArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        matchesArray[counter] = snapshot.val()[i];
        counter++;
      }
      matchesArray.push(this.match);
      firebase.database().ref('clubs/12').update({
          matches: matchesArray
      });
    });
  }
}