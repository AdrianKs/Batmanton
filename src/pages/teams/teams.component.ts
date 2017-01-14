/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { CreateTeamComponent } from './createNewTeam.component';


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
//this.database = firebase.database();
  }

  ionViewWillEnter(){
        console.log("Teams are alive");
        /*this.teams = this.utilities.allTeams;
        this.teamsSearch = this.utilities.allTeams;*/
        this.setTeams();
    }

  constructor(public navCtrl: NavController, public fbP: FirebaseProvider, public utilities: Utilities) {
    
    
  }

  setTeams() {
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      //this.allTeamsVal = snapshot.val();
      this.teams = teamArray;
      this.teamsSearch = this.utilities.allTeams;
      //this.teamsLoaded = true;
    });
  }

  viewTeam(ev, value) {
    this.navCtrl.push(ViewTeamComponent, {
      teamId: value.id
    });
  }

  pushToAddNewTeam() {
    this.navCtrl.push(CreateTeamComponent);
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
