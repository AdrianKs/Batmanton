/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import firebase from 'firebase';


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
    this.getAllTeamData();
  }

  constructor(public navCtrl: NavController, public fbP: FirebaseProvider) {
    this.database = firebase.database();
    //this.getAllTeamData();
  }

  testGetData() {
    var test = this.fbP.getItemsOfRefOn("/clubs/12/teams/");
    console.log(test);
  }


  viewTeam(ev, value) {
    this.navCtrl.push(ViewTeamComponent, { team: value });
  }

  addTeam(ev, value) {
    //Team hinzufügen View aufrufen
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
      this.teamsSearch = teamArray;
      this.teams = teamArray;
      let playerPlaceholder = [];
      counter = 0;
      for (let y in this.teams) {
        playerPlaceholder[counter] = this.teams[y].players;
        counter++;
      }
      console.log("PRINT BEFORE TEST");
      this.playerArray = playerPlaceholder;
      this.addPlayersToArray(this.playerArray);
      /* console.log(playerPlaceholder);
       counter = 0;
       let playerIDs = [];
       for (let j in playerPlaceholder){
         let test = playerPlaceholder[j][counter];
         console.log("ID: " + test);
         playerIDs.push(test);
         counter++;
       }
       console.log("PLAYER IDs");
       console.log(playerIDs);*/
    });


    //this.teams = this.fbP.getItemsOfRefOn("/clubs/12/teams/");
  }

  addPlayersToArray(valueArray: any) {
    this.database.ref("/clubs/12/players/").once('value', snapshot => {
      let allPlayers = snapshot.val();
      let idPlaceholder = 0;
      let counter = 0;
      for (let i in valueArray) {
        for (let y in valueArray[i]) {
          idPlaceholder = valueArray[i][y];
          let player = snapshot.child("" + idPlaceholder).val();
          console.log("PLAYER: ");
          console.log(player);
          this.teams[i].players[y] = player;
          console.log("TEAMS:");
          console.log(this.teams);
        }
      }
    })

  }

  initializeTeams() {
    this.teams = this.teamsSearch;
    /*this.teams = [
      {
        isAdult: true,
        name: "J1",
        type: "0",
        players: {
          15: {
            name: 'Thomas Test',
            geschlecht: 'm',
            geburtstag: '01.01.1996'
          },
          16: {
            name: 'Tina Turner',
            geschlecht: 'w',
            geburtstag: '02.02.1997'
          },
          17: {
            name: 'Tim Turner',
            geschlecht: 'm',
            geburtstag: '02.02.1997'
          }
        }
      },
      {
        isAdult: false,
        name: "J2",
        type: "0",
        players: {
          15: {
            name: 'Jonas Friedrich',
            geschlecht: 'm',
            geburtstag: '01.01.1996'
          },
          16: {
            name: 'Lisa Albert',
            geschlecht: 'w',
            geburtstag: '02.02.1997'
          },
          17: {
            name: 'Stefan Knolle',
            geschlecht: 'm',
            geburtstag: '02.02.1997'
          }
        }
      },
      {
        isAdult: true,
        name: "J3",
        type: "0",
        players: {
          15: {
            name: 'Tim Turbo',
            geschlecht: 'm',
            geburtstag: '01.01.1996'
          },
          16: {
            name: 'Christina Kralle',
            geschlecht: 'w',
            geburtstag: '02.02.1997'
          },
          17: {
            name: 'ASAP Ferg',
            geschlecht: 'm',
            geburtstag: '02.02.1997'
          }
        }
      }
    ]*/
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
