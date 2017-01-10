/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import {CreateTeamComponent} from './createNewTeam.component';


@Component({
  templateUrl: 'teams.component.html',
  providers: [FirebaseProvider]
})
export class TeamsComponent implements OnInit {

  teams: any[];
  teamsSearch: any[];
  database: any;
  playerArray: any[];

  ngOnInit(): void {
    this.teams = this.utilities.allTeams;
    this.teamsSearch = this.utilities.allTeams;
    this.getAllTeamData();
  }

  constructor(public navCtrl: NavController, public fbP: FirebaseProvider, public utilities: Utilities) {
    this.database = firebase.database();
  }


  viewTeam(ev, value) {
    this.navCtrl.push(ViewTeamComponent, { team: value });
  }

  addTeam(ev, value) {
    //Team hinzufügen View aufrufen
  }

  pushToAddNewTeam(){
    this.navCtrl.push(CreateTeamComponent);
  }


  getAllTeamData() {
    let playerPlaceholder = [];
    let counter = 0;
    for (let y in this.teams) {
      playerPlaceholder[counter] = this.teams[y].players;
      counter++;
    }
    this.playerArray = playerPlaceholder;
    this.addPlayersToArray(this.playerArray);
  }

  addPlayersToArray(valueArray: any) {
    this.database.ref("/clubs/12/players/").once('value', snapshot => {
      let idPlaceholder = 0;
      let counter = 0;
      for (let i in valueArray) {
        for (let y in valueArray[i]) {
          idPlaceholder = valueArray[i][y];
          let player = snapshot.child("" + idPlaceholder).val();
          if ((player != null) && (player != undefined)) {
            this.teams[i].players[y] = player;
            this.teams[i].players[y].id = y;
            this.teams[i].players[y].uniqueId = idPlaceholder;
          } else {
            console.log("Spieler übersprungen, da null");
          }
        }
      }
    })

  }

  initializeTeams() {
    this.teams = this.teamsSearch;
  }

  getItems(ev) {
    this.initializeTeams();

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.teams = this.teams.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
