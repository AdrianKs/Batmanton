/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { ViewTeamComponent} from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import firebase from 'firebase';


@Component({
  templateUrl: 'teams.component.html',
  providers: [FirebaseProvider]
})
export class TeamsComponent {

  teams: any[];
  database: any;



  constructor(public navCtrl: NavController, public fbP: FirebaseProvider) {
    this.database = firebase.database();
    this.getAllTeamData();
  }

  testGetData() {
    var test = this.fbP.getItemsOfRefOn("/clubs/12/teams/");
    console.log(test);
  }

  getAllTeamData() {
    this.database.ref("/clubs/12/teams/").once('value', snapshot => {
      console.log(snapshot.val());
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.teams = teamArray;
    });
    console.log("ITEMS:");
    console.log(this.teams);

    //this.teams = this.fbP.getItemsOfRefOn("/clubs/12/teams/");
  }

  initializeTeams() {
    this.teams = [
    ]
  }


  viewTeam(ev, value) {
    this.navCtrl.push(ViewTeamComponent, { team: value });
  }

  addTeam(ev, value) {
    //Team hinzufügen View aufrufen
  }


 
  getItems(ev) {
    this.initializeTeams();
    this.getAllTeamData();

    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.teams = this.teams.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

 

}
