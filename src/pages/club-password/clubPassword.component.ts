import { Component } from '@angular/core';
import {NavController, AlertController, LoadingController} from 'ionic-angular';
import {Validators, FormBuilder} from "@angular/forms";
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
  submitAttempt: boolean = false;
  passwordChanged: boolean = false;

  constructor(public formBuilder: FormBuilder,
              public navCtrl: NavController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, public utilities: Utilities) {

    this.clubPasswordForm = formBuilder.group({
      clubPassword: ['', Validators.compose([Validators.required])],
    })
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
    this.passwordChanged = true;
  }

  setClubPassword() {
    this.submitAttempt = true;
    let enteredPassword = this.clubPasswordForm.value.clubPassword;
    if(this.utilities.hashPassword(enteredPassword) == this.utilities.hashedPassword){
      window.localStorage.setItem(this.utilities.LOCAL_TOKEN_KEY, enteredPassword);
      if(this.utilities.loggedIn){
        this.navCtrl.setRoot(MatchdayComponent);
      } else {
        this.navCtrl.setRoot(LoginComponent);
      }
    }else if(this.clubPasswordForm.controls.clubPassword.valid){
      let alert = this.alertCtrl.create({
        message: "Vereinspasswort ist falsch.",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }

  }
}
