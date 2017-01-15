/**
 * Created by kochsiek on 08.12.2016.
 */
//todo
//Suchleiste
//alert wenn zurückgegangen wird
//disable Button
//Invite objects
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MatchdayComponent } from './matchday.component';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-addTeamToMatchday',
  templateUrl: 'addTeamToMatchday.component.html',
  providers: [MatchdayService]
})

export class AddTeamToMatchdayComponent implements OnInit{
  geschlecht: string = 'maenner';
  match: any;
  teamSelection: any;
  teamPosition: number;
  counter: number = 0;
  tempArray = [];
  allTeams: any;
  relevantTeams: any;
  allPlayers: any;

  ngOnInit(){
    this.allPlayers = this.Utilities.allPlayers;
    this.teamSelection = this.match.team;
    let counter = 0;
    for (let i in this.allTeams) {
        if (this.match.team == this.allTeams[i].id){
          this.teamPosition = counter;
          break;
        }
        counter ++;
      }
    this.relevantTeams = this.getRelevantTeams(this.allTeams[this.teamPosition].ageLimit);
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private MatchdayService: MatchdayService, private Utilities: Utilities) {
    this.match = navP.get('matchItem');
    this.allTeams = navP.get('relevantTeamsItem');
  }

  getRelevantTeams(ageLimit) {
    let relevantTeams: Array<any> = [];
    this.allTeams.forEach(function (team) {
      if (team.ageLimit <= ageLimit || ageLimit === 0) {
        relevantTeams.push(team);
      }
    });
    return relevantTeams;
  }

  getItemsAvailable(ev) {
      // set val to the value of the ev target
      var val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
          this.allPlayers = this.allPlayers.filter((item) => {
              return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      }
  }

  addPlayer(playerID, isClickedOnce){
    console.log(playerID);
      let counter = 0;
    for (let i in this.tempArray) {
        counter++;
      }
    this.tempArray[counter]= playerID;

    console.log(this.tempArray);
  }

  createGame(){
    this.match.pendingPlayers = this.tempArray;
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
    this.navCtrl.popToRoot();
  }
}

