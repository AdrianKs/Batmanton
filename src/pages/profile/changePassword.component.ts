/**
 * Created by Sebastian on 31.01.2017.
 */
import {Component} from '@angular/core';
import {NavController, ToastController, AlertController} from 'ionic-angular';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthData} from '../../providers/auth-data';

@Component({
  selector: 'page-changePassword',
  templateUrl: 'changePassword.component.html',
  providers: []
})
export class ChangePasswordComponent {

  public passwordForm;
  passwordOld: string = "";
  password: string = "";
  passwordConfirm: string = "";
  passwordOldChanged: boolean = false;
  passwordChanged: boolean = false;
  passwordConfirmChanged: boolean = false;
  passwordsAreSame: boolean = true;
  passwordOldIsSame: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public toastCtrl: ToastController, public authData: AuthData, public alertCtrl: AlertController) {
    this.passwordForm = formBuilder.group({
      passwordOld: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      passwordConfirm: []
    })
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
    this[field] = this["passwordForm"]["value"][field];
    if (!(field == "passwordOld")) {
      if (this.password == this.passwordConfirm) {
        this.passwordsAreSame = true;
      } else {
        this.passwordsAreSame = false;
      }
    }
    if(!(field == "passwordConfirm")){
      if (this.passwordOld == this.password) {
        this.passwordOldIsSame = true;
      } else {
        this.passwordOldIsSame = false;
      }
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  finish() {
    var that = this;
    this.authData.changePassword(this.password, this.passwordOld)
      .then(() => {
        let toast = this.toastCtrl.create({
          message: "Passwort erfolgreich geändert",
          duration: 2000,
          position: "top"
        });
        toast.present();
        this.navCtrl.pop();
      }, function () {
        let alert = that.alertCtrl.create({
          message: "Altes Passwort ist inkorrekt.",
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
