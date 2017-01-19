//todo
//Formcontroll
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AddTeamToMatchdayComponent } from './addTeamToMatchday.component'
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [MatchdayService]
})

export class CreateMatchdayComponent implements OnInit {
  match = {opponent: this.opponent, team: this.team, home: this.home, location: {street: this.street, zipcode: this.zipcode}, time: this.time, pendingPlayers: this.pendingPlayersArray};
  opponent: string;
  team: any;
  home: boolean;
  street: string;
  zipcode: number;
  time: String;
  pendingPlayersArray = [];
  relevantTeams = this.Utilities.allTeams;
  teamChanged: boolean = false;
  dayChanged: boolean = false;

  ngOnInit() {
  }

  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService, private Utilities: Utilities, private alertCtrl: AlertController) {
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

    if (this.match.team == 0){
      this.pendingPlayersArray[0] = "Keiner";
      this.match.pendingPlayers = this.pendingPlayersArray;
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
        firebase.database().ref('clubs/12/matches/' + counter + '/pendingPlayers').remove();
      });
      this.navCtrl.popToRoot();
    } else {
       this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.match, relevantTeamsItem: this.relevantTeams});
    }
  }

  goBack(){
    let confirm = this.alertCtrl.create({
      title: 'Warnung',
      message: 'Beim Verlassen des Fensters gehen alle Veränderungen verloren. Fortfahren?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
          }
        },
        {
          text: 'Ja',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present()
  }
}