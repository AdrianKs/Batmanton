import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { EditRoleComponent } from '../editRole/editRole.component';

@Component({
  selector: 'page-userManagement',
  templateUrl: 'userManagement.component.html'
})
export class UserManagementComponent {

  geschlecht: string = "maenner";
  testDataPlayer: any[];
  testDataTeams: any[];

  constructor(private navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    /* this.testDataTeams = [
       {
         name: "Mannschaft auswählen"
       },
       {
         name: "S1"
       },
       {
         name: "S2"
       },
       {
         name: "J1",
       },
       {
         name: "J2"
       },
       {
         name: "J3"
       }
     ]*/

    this.testDataPlayer = [
      {
        vorname: "Max",
        nachname: "Mustermann",
        geburtstag: "19.12.1996",
        mannschaft: "J2",
        email: "max.mustermann@gmx.com",
        geschlecht: "m",
        rolle: [true, false]
      },
      {
        vorname: "Marc",
        nachname: "Mannmuster",
        geburtstag: "12.10.1991",
        mannschaft: "S2",
        email: "marc.mannmuster@gmail.com",
        geschlecht: "m",
        rolle: [true, true]
      },
      {
        vorname: "Maria",
        nachname: "Müller",
        geburtstag: "07.02.1990",
        mannschaft: "S1",
        email: "test@web.de",
        geschlecht: 'w',
        rolle: [true, false]
      }
    ]
  }

  openEditor(ev, value) {
   this.navCtrl.push(EditRoleComponent, {player: value});
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.testDataPlayer = this.testDataPlayer.filter((item) => {
        return (item.nachname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}


//Firebase Login
//manuel-entenmann@web.de
//Test123

//Spielerliste mit Tabs

