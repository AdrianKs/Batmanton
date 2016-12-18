/**
 * Created by kochsiek on 08.12.2016.
 */
// todo:
// change pb
// db anbindung
// Label-/ Inputausrichtungen?
// Geschlecht?
// passwort ändern
// form Standalone Adrian

import {Component} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {NavController, Button} from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {

  public profileForm;
  playerData: any;
  editMode: boolean = false;
  today: String = new Date().toISOString();

  // Save values from form before entering edit view to check for changes
  firstnameOld: string;
  lastnameOld: string;
  emailOld: string;
  birthdayOld: string;
  teamOld: string;


  // Flags to check wether a field has been changed or not
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  emailChanged: boolean = false;
  birthdayChanged: boolean = false;
  teamChanged: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,) {
    this.initializeItems();

    this.profileForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      birthday: [],
      team: []
    })
  }

  initializeItems() {
    this.playerData =
      {
        birthday: "1995-07-21",
        email: "se.roehling@gmail.com",
        firstname: "Sebastian",
        gender: "m",
        isPlayer: true,
        isTrainer: false,
        lastname: "Röhling",
        pushid: "",
        state: 0,
        team: "15"

      };
  }

  /**
   * Formats the birthday coming from the player data value to "dd.mm.yyyy" to display it with a label
   * @returns {string} Formatted birthday
   */
  formatBirthday(){
    return this.playerData.birthday.split("-")[2] + "." + this.playerData.birthday.split("-")[1] + "." + this.playerData.birthday.split("-")[0];
  }

  editProfile() {
    this.firstnameOld = this.playerData.firstname;
    this.lastnameOld = this.playerData.lastname;
    this.emailOld = this.playerData.email;
    this.birthdayOld = this.playerData.birthday;
    this.teamOld = this.playerData.team;
    console.log("Firstname " + this.firstnameOld);
    console.log("Lastname " + this.lastnameOld);
    console.log("Email " + this.emailOld);
    console.log("Birthday " + this.birthdayOld);
    console.log("Team " + this.teamOld);
    this.editMode = true;
  }

  finishEditProfile() {
    console.log("Model:")
    console.log("Firstname " + this.playerData.firstname);
    console.log("Lastname " + this.playerData.lastname);
    console.log("Email " + this.playerData.email);
    console.log("Birthday " + this.playerData.birthday);
    console.log("Team " + this.playerData.team);
    if (this.firstnameOld || this.lastnameChanged || this.emailChanged || this.birthdayChanged || this.teamChanged) {
      console.log("do DB Op");
    }
    this.firstnameChanged = false;
    this.lastnameChanged = false;
    this.emailChanged = false;
    this.birthdayChanged = false;
    this.teamChanged = false;
    this.editMode = false;
  }

  cancelEditProfile() {
    this.firstnameChanged = false;
    this.lastnameChanged = false;
    this.emailChanged = false;
    this.birthdayChanged = false;
    this.teamChanged = false;
    this.editMode = false;
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    if (this[field + "Old"] != this["profileForm"]["value"][field]) {
      this[field + "Changed"] = true;
    } else {
      this[field + "Changed"] = false;
    }
  }

  birthdaySelectChanged(input) {
    if (this.birthdayOld != input) {
      this.birthdayChanged = true;
    } else {
      this.birthdayChanged = false;
    }
  }

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      this.teamChanged = true;
    } else {
      this.teamChanged = false;
    }
  }

  logOut() {
    firebase.auth().signOut();
    this.navCtrl.setRoot(LoginComponent);
  }

  /**
   * This function checks, if the input field starts with a capital letter
   */
  startsWithACapital(c: FormControl) {
    let NAME_REGEXP = new RegExp("[A-Z]");
    if (!NAME_REGEXP.test(c.value.charAt(0))) {
      return {"incorrectNameFormat": true}
    }
    return null;
  }

  /**
   * This function checks if the input is a Email with a Regex.
   * @param c Formcontrol of the input form to check
   * @returns {boolean}
   */
  isAMail(c: FormControl) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (c.value != "" && (c.value.length <= 5 || !EMAIL_REGEXP.test(c.value))) {
      return {"incorrectMailFormat": true};
    }

    return null;
  }
}

