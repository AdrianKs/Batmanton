/**
 * Created by kochsiek on 08.12.2016.
 */
// todo:
// Einstellungsscreen (Benachrichtigungen, Verein ändern, PW ändern, E-Mail ändern)
// Error Handling (global)
// "Profil aufnehmen" --> "Profilbild ändern" in Register Screen
// kleinere Fonts
// Einheitliche Namen/ i18n
// Admin/ Spieler Rolle
// Enter App Screen
// Passwort validate
// Datenmodell-Teams
// Change Teams Properly
// Fix LogOut set user bug

import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {NavController, ActionSheetController} from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {AuthData} from '../../providers/auth-data';
import {Camera} from 'ionic-native';
import {document} from "@angular/platform-browser/src/facade/browser";
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
  providers: [AuthData]
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    this.getProfilePicture();
  }

  public profileForm;
  editMode: boolean = false;
  actionSheetOptions: any;
  formValid: boolean = true;

  today: String = new Date().toISOString();

  /**
   *  Save values from form before entering edit view to check for changes
   */
  firstnameOld: string;
  lastnameOld: string;
  emailOld: string;
  birthdayOld: string;
  genderOld: string;
  teamOld: string;

  /**
   *  Flags to check whether a field has been changed or not
   */
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  emailChanged: boolean = false;
  birthdayChanged: boolean = false;
  genderChanged: boolean = false;
  teamChanged: boolean = false;

  /**
   * Variables to change and save profile image
   */
  public base64Image: string;
  public base64String: string;


  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public authData: AuthData, public actionSheetCtrl: ActionSheetController, public utilities: Utilities) {
    this.profileForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      birthday: [],
      gender: [],
      team: []
    })
  }

  /**
   * Gets the url to the profile picture. If no profile picture has been uploaded, the default picture is set to the src url
   */
  getProfilePicture() {
    var that = this;
    // firebase.storage().ref().child("profilePictures/" + this.utilities.userDataID + "/" + this.utilities.userDataID + ".jpg").getDownloadURL().then(function (url) {
    firebase.storage().ref().child("profilePictures/" + this.utilities.user.uid + "/" + this.utilities.user.uid + ".jpg").getDownloadURL().then(function (url) {
      document.getElementById("profileImage").src = url;
      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.actionSheetOptions = {
        title: 'Profilbild ändern',
        buttons: [
          {
            text: "Kamera",
            icon: "camera",
            handler: () => that.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => that.getPicture()
          },
          {
            text: 'Profilbild löschen',
            role: 'destructive',
            icon: "trash",
            handler: () => that.deleteProfilePicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    }).catch(function (error) {
      document.getElementById("profileImage").src = "assets/images/ic_account_circle_black_48dp_2x.png";
      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.actionSheetOptions = {
        title: 'Profilbild ändern',
        buttons: [
          {
            text: "Kamera",
            icon: "camera",
            handler: () => that.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => that.getPicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    });
  }

  editProfile() {
    this.firstnameOld = this.utilities.userData.firstname;
    this.lastnameOld = this.utilities.userData.lastname;
    this.emailOld = this.utilities.userData.email;
    this.birthdayOld = this.utilities.userData.birthday;
    this.teamOld = this.utilities.userData.team;
    this.genderOld = this.utilities.userData.gender;
    this.editMode = true;
  }

  finishEditProfile() {
    if ((this.firstnameChanged || this.lastnameChanged || this.emailChanged || this.birthdayChanged || this.genderChanged || this.teamChanged) && this.formValid) {
      // firebase.database().ref('clubs/12/players/' + this.utilities.userDataID).set({
      firebase.database().ref('clubs/12/players/' + this.utilities.user.uid).set({
        birthday: this.utilities.userData.birthday,
        email: this.utilities.userData.email,
        firstname: this.utilities.userData.firstname,
        gender: this.utilities.userData.gender,
        isTrainer: this.utilities.userData.isTrainer,
        isPlayer: this.utilities.userData.isPlayer,
        lastname: this.utilities.userData.lastname,
        pushid: this.utilities.userData.pushid,
        state: this.utilities.userData.state,
        team: this.utilities.userData.team
      });
    }
    if (this.emailChanged) {
      this.authData.changeEmail(this.utilities.userData.email);
    }
    this.firstnameChanged = false;
    this.lastnameChanged = false;
    this.emailChanged = false;
    this.birthdayChanged = false;
    this.teamChanged = false;
    this.genderChanged = false;
    this.editMode = false;
  }

  cancelEditProfile() {
    this.utilities.userData.firstname = this.firstnameOld;
    this.utilities.userData.lastname = this.lastnameOld;
    this.utilities.userData.email = this.emailOld;
    this.utilities.userData.birthday = this.birthdayOld;
    this.utilities.userData.team = this.teamOld;
    this.utilities.userData.gender = this.genderOld;

    this.firstnameChanged = false;
    this.lastnameChanged = false;
    this.emailChanged = false;
    this.birthdayChanged = false;
    this.teamChanged = false;
    this.genderChanged = false;
    this.editMode = false;
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    if (this[field + "Old"] != this["profileForm"]["value"][field]) {
      this[field + "Changed"] = true;
    } else {
      this[field + "Changed"] = false;
    }
    if (this.profileForm.controls.firstname.valid && this.profileForm.controls.lastname.valid && this.profileForm.controls.email.valid) {
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  birthdaySelectChanged(input) {
    if (this.birthdayOld != input) {
      this.birthdayChanged = true;
    } else {
      this.birthdayChanged = false;
    }
  }

  genderSelectChanged(input) {
    if (this.genderOld != input) {
      this.genderChanged = true;
    } else {
      this.genderChanged = false;
    }
  }

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      this.teamChanged = true;
    } else {
      this.teamChanged = false;
    }
  }

  changeProfilePicture() {
    let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);

    actionSheet.present();
  }

  takePicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }

  getPicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }

  callCamera(options) {
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64String = imageData;
        this.uploadPicture();
      }, (err) => {
        console.log(err);
      });
  }

  uploadPicture() {
    // firebase.storage().ref().child('profilePictures/' + this.utilities.userDataID + "/" + this.utilities.userDataID + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
    firebase.storage().ref().child('profilePictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
      .then(callback => {
        document.getElementById("profileImage").src = this.base64Image;
        // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
        this.actionSheetOptions = {
          title: 'Profilbild ändern',
          buttons: [
            {
              text: "Kamera",
              icon: "camera",
              handler: () => this.takePicture()
            },
            {
              text: 'Fotos',
              icon: "images",
              handler: () => this.getPicture()
            },
            {
              text: 'Profilbild löschen',
              role: 'destructive',
              icon: "trash",
              handler: () => this.deleteProfilePicture()
            },
            {
              text: 'Abbrechen',
              role: 'cancel'
            }
          ]
        };
      })
      .catch(function (error) {
        alert(error.message);
        console.log(error);
      });
  }

  deleteProfilePicture() {
    var that = this;
    // firebase.storage().ref().child('profilePictures/test.jpg').delete().then(function() {
    // firebase.storage().ref().child('profilePictures/' + this.utilities.userDataID + "/" + this.utilities.userDataID + '.jpg').delete().then(function () {
    firebase.storage().ref().child('profilePictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid + '.jpg').delete().then(function () {
      document.getElementById("profileImage").src = "assets/images/ic_account_circle_black_48dp_2x.png";

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.actionSheetOptions = {
        title: 'Profilbild ändern',
        buttons: [
          {
            text: "Kamera",
            icon: "camera",
            handler: () => that.takePicture()
          },
          {
            text: 'Fotos',
            icon: "images",
            handler: () => that.getPicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    }).catch(function (error) {
      alert(error.message);
    });
  }

  logout() {
    this.authData.logoutUser();
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

