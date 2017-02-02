import { Component } from '@angular/core';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {Validators, FormBuilder} from "@angular/forms";
import {AuthData} from "../../providers/auth-data";
import {MatchdayComponent} from "../matchday/matchday.component";
import {LoginComponent} from "../login/login.component";
import {Utilities} from "../../app/utilities";

/*
  Generated class for the ClubPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-clubPassword',
  templateUrl: 'clubPassword.component.html'
})
export class ClubPasswordComponent {
  public clubPasswordForm;
  clubPasswordChanged: boolean = false;
  submitAttempt: boolean = false;
  hashedPassword = 19045090;

  constructor(public authData: AuthData, public formBuilder: FormBuilder,
              public navCtrl: NavController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, public utilities: Utilities) {

    this.clubPasswordForm = formBuilder.group({
      clubPassword: ['', Validators.compose([Validators.required])],
    })
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  setClubPassword() {
    let enteredPassword = this.clubPasswordForm.value.clubPassword;
    console.log(enteredPassword);
    console.log(this.hashPassword(enteredPassword));
    if(this.hashPassword(enteredPassword) == this.hashedPassword){
      window.localStorage.setItem(this.utilities.LOCAL_TOKEN_KEY, '' + this.hashedPassword);
      if(this.utilities.loggedIn){
        this.navCtrl.setRoot(MatchdayComponent);
      } else {
        this.navCtrl.setRoot(LoginComponent);
      }
    }
  }

  hashPassword(password): any {
    let hash = 0, i, chr, len;
    if (password.length === 0) return hash;
    for (i = 0, len = password.length; i < len; i++) {
      chr   = password.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };



}
