/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';


@Component({
  templateUrl: 'teams.component.html',
  providers: [FirebaseProvider]
})
export class TeamsComponent {

  teams: any[];



  constructor(public navCtrl: NavController, public fbP: FirebaseProvider) {
    this.initializeTeams();
    console.log(this.teams);
  }

  testGetData(){
    var test = this.fbP.getItemsOfRefOn("/clubs/12/teams/");
    console.log(test);
  }

  initializeTeams() {
    this.teams = [
      {
        isAdult: true, 

        name: "J3", 

        type: "0",
        players: {
        15: { 
          name: 'Tim Turbo',
          geschlecht: 'm' ,
          geburtstag: '01.01.1996'
        },
        16: {
          name: 'Christina Kralle',
          geschlecht: 'w',
          geburtstag: '02.02.1997' 
        },
        17:  {
          name: 'ASAP Ferg',
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
          geschlecht: 'm' ,
          geburtstag: '01.01.1996'
        },
        16: {
          name: 'Lisa Albert',
          geschlecht: 'w',
          geburtstag: '02.02.1997' 
        },
        17:  {
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
          geschlecht: 'm' ,
          geburtstag: '01.01.1996'
        },
        16: {
          name: 'Christina Kralle',
          geschlecht: 'w',
          geburtstag: '02.02.1997' 
        },
        17:  {
          name: 'ASAP Ferg',
          geschlecht: 'm',
          geburtstag: '02.02.1997' 
        }
      }

    }
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
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.teams = this.teams.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
