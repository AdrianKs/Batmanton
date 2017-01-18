/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { MatchdayComponent } from '../matchday/matchday.component';
import {RegisterComponent} from "../register/register.component";
import { ResetPasswordComponent } from '../resetPassword/resetPassword.component';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  providers: [AuthData]
})
export class LoginComponent {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(public navCtrl: NavController, public authData: AuthData,
              public formBuilder: FormBuilder,public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public menuCtrl: MenuController) {


    this.menuCtrl.close('mainMenu');
    this.menuCtrl.enable(false, 'mainMenu');

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  loginUser(){
    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        this.authData.changePushid(authData.uid);
        this.navCtrl.setRoot(MatchdayComponent);
        this.menuCtrl.enable(true, 'mainMenu');
      }, error => {
        this.loading.dismiss().then( () => {
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
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  goToSignup(){
    this.navCtrl.push(RegisterComponent);
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordComponent);
  }

}
