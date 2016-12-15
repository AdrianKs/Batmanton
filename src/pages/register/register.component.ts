/**
 * Created by kochsiek on 08.12.2016.
 */
import {Component, OnInit} from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { MatchdayComponent } from '../matchday/matchday.component';
import firebase from 'firebase';
import {SelectProfilePictureComponent} from "../selectProfilePicture/selectProfilePicture.component";


@Component({
  selector: 'page-register',
  templateUrl: 'register.component.html',
  providers: [AuthData]
})
export class RegisterComponent implements OnInit{

  ngOnInit(): void {
    this.getTeams();
  }

  teams: Array<any>;

  public signupForm;
  gender: string = '';
  team: string = '';
  firstnameChanged: boolean = false;
  lastnameChanged: boolean = false;
  birthdayChanged: boolean = false;
  genderChanged: boolean = false;
  teamChanged: boolean = false;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController,
              public authData: AuthData,
              public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController)
  {
    this.signupForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      birthday: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, this.isAMail])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  getTeams(): void {
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.teams = teamArray;
    })
  }

  /**
   * This method checks if a input field was changed
   * @param input Input field to check
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * This function is needed, since the select box can for some reason not be validated in formcontrol,
   * so ngModel had to be used, so a special validation is needed
   */
  genderSelectChanged(input){
    this.gender = input;
    this.genderChanged = true;
  }

  teamSelectChanged(input){
    this.team = input;
    this.teamChanged = true;
  }

  /**
   * This function checks, if the input field starts with a capital letter
   */
  startsWithACapital(c: FormControl){
    let NAME_REGEXP = new RegExp("[A-Z]");
    //let NAME_REGEXP = /^[A-Z]*/i;
    if(!NAME_REGEXP.test(c.value)){
      return { "incorrectNameFormat": true}
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
      return { "incorrectMailFormat": true };
    }

    return null;
  }

  /**
   * This function signs up the user in firebase and creates a userprofile in the databse
   * All connections to firebase are managed in the provider auth-data
   * The field gender is not managed with the signupForm, because of an error that occured in the
   * combination of formcontrol with ion-select
   */
  signupUser(){
    this.submitAttempt = true;

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
      console.log("gender: " + this.gender);
      console.log("team: " + this.team);
    } else {
      this.authData.signupUser(
        this.signupForm.value.email,
        this.signupForm.value.password,
        this.signupForm.value.firstname,
        this.signupForm.value.lastname,
        this.signupForm.value.birthday,
        this.gender,
        this.team
      ).then(() => {
        this.navCtrl.setRoot(SelectProfilePictureComponent);
      }, (error) => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

}
