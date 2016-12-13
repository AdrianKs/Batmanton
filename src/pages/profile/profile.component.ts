/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {

  testDataPlayer: any;

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    this.testDataPlayer =
      {
        vorname: "Max",
        nachname: "Mustermann",
        geburtstag: "19.12.1996",
        mannschaft: "J2",
        email: "max.mustermann@gmx.com",
        geschlecht: "m",
        admin: true,
        player: true
      };
  }

  editProfile(){
    console.log("editProfile pressesd")
  }

  logout(){
    console.log("Logout Pressed")
  }
}
