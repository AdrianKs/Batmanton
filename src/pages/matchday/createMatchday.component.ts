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
  opponent: string;
  team: any;
  home: boolean;
  location: any;
  address: string;
  zipcode: number;
  date: String;
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
    console.log(this.opponent, this.team, this.home, this.address, this.zipcode, this.date);
    if (this.home == true){
      this.home = true;
    } else {
      this.home = false;
    }
    this.date = this.date.substring(0, this.date.length - 1);
    this.date = this.date.replace("T","-");
    this.date = this.date.replace(/:/g,"-");
    console.log(this.date);


    firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      let matchesArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        matchesArray[counter] = snapshot.val()[i];
        counter++;
      }
      console.log(counter);
      firebase.database().ref('clubs/12/').update({
        matches: matchesArray
      });
      firebase.database().ref('clubs/12/matches/'+counter).set({
        opponent: this.opponent,
        team: this.team,
        home: this.home,
        time: this.date
      });
      firebase.database().ref('clubs/12/matches/'+counter+'/location').set({
        street: this.address,
        zipcode: this.zipcode
      });
    });
  }
}