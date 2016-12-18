/**
 * Created by kochsiek on 08.12.2016.
 */
// todo:
// change pb
// db anbindung
// Label-/ Inputausrichtungen?
// Geschlecht ändern?
// passwort ändern?
// Verein wählen
// Einstellungsscreen (Benachrichtigungen, Verein ändern)
// UserManagement --> DB Call auf Rollen begrenzen
// Error Handling

import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {NavController, Button} from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {loggedInUser} from "../../app/globalVars";
import {AuthData} from '../../providers/auth-data';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
  providers: [AuthData]
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    this.getPlayer();
  }

  public profileForm;
  loggedInUserID: string = loggedInUser.uid;
  player: any;
  editMode: boolean = false;
  /**
   * Indicates wether the data for the view has been successfully loaded or not. If true, the profile-form in the template can be displayed
   * @type {boolean}
   */
  dataLoaded: boolean = false;
  today: String = new Date().toISOString();

  /**
   *  Save values from form before entering edit view to check for changes
   */
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

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public authData: AuthData,) {
    this.profileForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      birthday: [],
      team: []
    })
  }

  /**
   * Gets the data for the logged in player from the database and sets the "dataLoaded" flag afterwards "true".
   */
  getPlayer(): void {
    firebase.database().ref('clubs/12/players/' + this.loggedInUserID).once('value', snapshot => {
      this.player = snapshot.val();
      this.dataLoaded = true;
    })
  }

  /**
   * Formats the birthday coming from the player data value to "dd.mm.yyyy" to display it with a label
   * @returns {string} Formatted birthday
   */
  formatBirthday() {
    return this.player.birthday.split("-")[2] + "." + this.player.birthday.split("-")[1] + "." + this.player.birthday.split("-")[0];
  }

  editProfile() {
    this.firstnameOld = this.player.firstname;
    this.lastnameOld = this.player.lastname;
    this.emailOld = this.player.email;
    this.birthdayOld = this.player.birthday;
    this.teamOld = this.player.team;
    this.editMode = true;
  }

  finishEditProfile() {
    if (this.firstnameOld || this.lastnameChanged || this.emailChanged || this.birthdayChanged || this.teamChanged) {
      firebase.database().ref('clubs/12/players/' + this.loggedInUserID).set({
        birthday: this.player.birthday,
        email: this.player.email,
        firstname: this.player.firstname,
        gender: this.player.gender,
        isTrainer: this.player.isTrainer,
        isPlayer: this.player.isPlayer,
        lastname: this.player.lastname,
        pushid: this.player.pushid,
        state: this.player.state,
        team: this.player.team
      });
    }
    if (this.emailChanged) {
      this.authData.changeEmail(this.player.email);
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

