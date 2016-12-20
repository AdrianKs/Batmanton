/**
 * Created by kochsiek on 08.12.2016.
 */
// todo:
// Label-/ Inputausrichtungen?
// Geschlecht ändern?
// Einstellungsscreen (Benachrichtigungen, Verein ändern, PW ändern)
// Error Handling (global)
// Teams
// "Profil aufnehmen" --> "Profilbild ändern" in Register Screen
// kleinere Fonts

import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {NavController, ActionSheetController} from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {loggedInUser} from "../../app/globalVars";
import {AuthData} from '../../providers/auth-data';
import {Camera} from 'ionic-native';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
  providers: [AuthData]
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    this.getPlayer();
    this.getProfilePicture();
  }

  public profileForm;
  loggedInUserID: string = loggedInUser.uid;
  player: any = "";
  profilePictureUrl: string;
  editMode: boolean = false;
  actionSheetOptions: any;
  dataLoaded: boolean = false;
  formValid: boolean = true;

  /**
   * Indicates whether the data for the view has been successfully loaded or not. If true, the profile-form in the template can be displayed
   * @type {boolean}
   */
  today: String = new Date().toISOString();

  /**
   *  Save values from form before entering edit view to check for changes
   */
  firstnameOld: string;
  lastnameOld: string;
  emailOld: string;
  birthdayOld: string;
  teamOld: string;

  /**
   *  Flags to check whether a field has been changed or not
   */
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  emailChanged: boolean = false;
  birthdayChanged: boolean = false;
  teamChanged: boolean = false;

  /**
   * Variables to change and save profile image
   */
  public base64Image: string;
  public base64String: string;


  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public authData: AuthData, public actionSheetCtrl: ActionSheetController) {
    this.profileForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      birthday: [],
      team: []
    })
  }

  /**
   * Gets the data for the logged in player from the database and sets the "dataLoaded" flag to "true" so the "edit-button" for the profile can be displayed.
   */
  getPlayer(): void {
    firebase.database().ref('clubs/12/players/' + this.loggedInUserID).once('value', snapshot => {
      this.player = snapshot.val();
      this.dataLoaded = true;
    })
  }

  /**
   * Gets the url to the profile picture. If no profile picture has been uploaded, the default picture is set to the src url
   */
  getProfilePicture(){
    var that = this;
    firebase.storage().ref().child("profilePictures/" + this.loggedInUserID + "/" + this.loggedInUserID + ".jpg").getDownloadURL().then(function(url) {
      that.profilePictureUrl = url;
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
    }).catch(function(error) {
      that.profilePictureUrl = "assets/images/ic_account_circle_black_48dp_2x.png";
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
    this.firstnameOld = this.player.firstname;
    this.lastnameOld = this.player.lastname;
    this.emailOld = this.player.email;
    this.birthdayOld = this.player.birthday;
    this.teamOld = this.player.team;
    this.editMode = true;
  }

  finishEditProfile() {
    if ((this.firstnameChanged || this.lastnameChanged || this.emailChanged || this.birthdayChanged || this.teamChanged) && this.formValid) {
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
    if(this.profileForm.controls.firstname.valid && this.profileForm.controls.lastname.valid && this.profileForm.controls.email.valid){
      this.formValid = true;
    } else{
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

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      this.teamChanged = true;
    } else {
      this.teamChanged = false;
    }
  }

  changeProfilePicture(){
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
    firebase.storage().ref().child('profilePictures/' + this.loggedInUserID + "/" + this.loggedInUserID + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
      .then(callback => {
        this.profilePictureUrl = this.base64Image;
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

  deleteProfilePicture(){
    var that = this;
    // firebase.storage().ref().child('profilePictures/test.jpg').delete().then(function() {
    firebase.storage().ref().child('profilePictures/' + this.loggedInUserID + "/" + this.loggedInUserID + '.jpg').delete().then(function() {
      that.profilePictureUrl = "assets/images/ic_account_circle_black_48dp_2x.png";

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
    }).catch(function(error) {
      alert(error.message);
    });
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

