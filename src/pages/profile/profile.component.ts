/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import {LoginComponent} from "../login/login.component";
import { NavController } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {

  testDataPlayer: any;
  editMode: boolean;

  constructor(public navCtrl: NavController) {
    this.initializeItems();
    this.editMode = false;
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
    this.editMode = !this.editMode;
    this.setHiddenEditItems(!this.editMode)
    this.setHiddenDisplayItems(this.editMode)
    document.getElementById("editButtonIcon")
  }

  setHiddenEditItems(isHidden){
    document.getElementById("editFirstNameItem").hidden = isHidden;
    document.getElementById("editLastNameItem").hidden = isHidden;
    document.getElementById("editMailItem").hidden = isHidden;
    document.getElementById("editBirthdayItem").hidden = isHidden;
    document.getElementById("editTeamItem").hidden = isHidden;
    document.getElementById("doneButtonIcon").hidden = isHidden;
  }

  setHiddenDisplayItems(isHidden){
    document.getElementById("nameItem").hidden = isHidden;
    document.getElementById("mailItem").hidden = isHidden;
    document.getElementById("birthdayItem").hidden = isHidden;
    document.getElementById("teamItem").hidden = isHidden;
    document.getElementById("bottomContainer").hidden = isHidden;
    document.getElementById("editButtonIcon").hidden = isHidden;
  }

  logOut(){
    firebase.auth().signOut();
    this.navCtrl.setRoot(LoginComponent);
    //this.nav.setRoot(LoginComponent);
  }
}
