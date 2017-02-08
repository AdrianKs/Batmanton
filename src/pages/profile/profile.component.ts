/**
 * Created by kochsiek on 08.12.2016.
 */
// todo:
// Fix infinite loading indicator iPhone
// handle error wenn keine internetverbindung besteht
// ViewTeam: "Fertig" Button ausgrauen, wenn keine Changes gemacht wurden
// unnötige css klassen löschen
// Invites: Label wenn keine Einladungen verfügbar sind
// Art der Mannschaft in teams Liste anzeigen
// Mannschaft in Spieltageliste anzeigen
// Mannschaften: Remove player image from thumbnails, when user leaves team
// Spieler Items on Profilbild click --> open player details
// gameDetails: Checkliste schöner machen
// gameDetails && viewTeam: Delete Button ganz unten
// gameDetails && viewTeam: Edit Players Button nur wenn man auf bearbeiten klickt
// viewTeam:  wenn man ein team bearbeitet, was zB S Klasse 3 hat, dann wird die S-Klasse nicht in der checkbox selektiert, wenn man auf bearbeiten klickt

import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "../login/login.component";
import {ChangePasswordComponent} from "./changePassword.component";
import {NavController, ActionSheetController, LoadingController, AlertController} from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {AuthData} from '../../providers/auth-data';
import {Camera} from 'ionic-native';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.component.html',
  providers: [AuthData]
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    this.setActionSheetOptions();
    this.utilities.setUserData();
  }

  public profileForm;
  editMode: boolean = false;
  actionSheetOptions: any;
  formValid: boolean = true;
  relevantTeams: Array<any> = [];
  today: String = new Date().toISOString();
  loading: any;

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


  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public authData: AuthData, public actionSheetCtrl: ActionSheetController, public utilities: Utilities, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.profileForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      birthday: [],
      gender: [],
      team: []
    })
  }

  setActionSheetOptions() {
    if (this.utilities.userData.picUrl == "" || this.utilities.userData.picUrl == undefined) {
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
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    } else {
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
    }
  }

  editProfile() {
    this.firstnameOld = this.utilities.userData.firstname;
    this.lastnameOld = this.utilities.userData.lastname;
    this.emailOld = this.utilities.userData.email;
    this.birthdayOld = this.utilities.userData.birthday;
    this.teamOld = this.utilities.userData.team;
    this.genderOld = this.utilities.userData.gender;
    this.editMode = true;
    this.relevantTeams = this.utilities.getRelevantTeams(this.utilities.userData.birthday);
  }

  finishEditProfile() {
    if ((this.firstnameChanged || this.lastnameChanged || this.emailChanged || this.birthdayChanged || this.genderChanged || this.teamChanged) && this.formValid) {
      firebase.database().ref('clubs/12/players/' + this.utilities.user.uid).update({
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
    if (this.teamChanged) {
      this.utilities.removePlayerFromTeam(this.teamOld, this.utilities.user.uid);
      this.utilities.addPlayerToTeam(this.utilities.userData.team, this.utilities.user.uid);
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
    this.relevantTeams = this.utilities.getRelevantTeams(this.utilities.userData.birthday);
    if (this.utilities.userData.team != undefined && this.utilities.allTeamsVal[this.utilities.userData.team] != undefined) {
      if (this.utilities.userData.team != "0" && this.utilities.allTeamsVal[this.utilities.userData.team].ageLimit != 0) {
        if (this.utilities.allTeamsVal[this.utilities.userData.team].ageLimit < this.utilities.calculateAge(this.utilities.userData.birthday)) {
          this.utilities.userData.team = "0";
        }
      }
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
    var that = this;
    var uploadTask = firebase.storage().ref().child('profilePictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'});

    uploadTask.on('state_changed', function (snapshot) {
      that.loading = that.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      that.loading.present();

    }, function (error) {
      alert(error.message);
    }, function () {
      that.utilities.userData.picUrl = uploadTask.snapshot.downloadURL;
      firebase.database().ref('clubs/12/players/' + that.utilities.user.uid).update({
        picUrl: that.utilities.userData.picUrl
      });

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.setActionSheetOptions()
    });
  }

  deleteProfilePicture() {
    var that = this;
    firebase.storage().ref().child('profilePictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid + '.jpg').delete().then(function () {
      // Change remote and local picUrl
      that.utilities.userData.picUrl = "";
      firebase.database().ref('clubs/12/players/' + that.utilities.user.uid).update({
        picUrl: ""
      });

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.setActionSheetOptions()
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

  deleteProfile() {
    let alert = this.alertCtrl.create({
      title: 'Profil löschen',
      message: 'Wollen Sie Ihr Profil wirklich löschen? Der Vorgang kann nicht rückgängig gemacht werden.' +
      'Bitte geben Sie Ihr Passwort ein, um fortzufahren.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: data => {
            this.utilities.setInRegister();
            var that = this;
            this.authData.deleteUser(data.password).then(() => {
              firebase.database().ref('clubs/12/players/' + this.utilities.user.uid).remove();
              this.logout();
              this.utilities.setInRegister();
            }, function () {
              let alert = that.alertCtrl.create({
                message: "Passwort ist inkorrekt.",
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          }
        }
      ],
      inputs: [
        {
          id: 'passwordConfirmInput',
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ]
    });
    alert.present();
  }

  changePassword() {
    this.navCtrl.push(ChangePasswordComponent);
  }
}

