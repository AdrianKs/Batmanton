/**
 * Created by Sebastian on 11.02.2017.
 */
import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import {FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: 'editTemplate.component.html',
})

export class EditTemplateComponent implements OnInit {
  public templateForm;
  templateItem: any;
  createNew: boolean = false;

  clubOld: string;
  streetOld: string;
  zipcodeOld: string;

  clubChanged: boolean = false;
  streetChanged: boolean = false;
  zipcodeChanged: boolean = false;

  ngOnInit() {
    console.log(this.templateItem);
    this.clubOld = this.templateItem.club;
    this.streetOld = this.templateItem.street;
    this.zipcodeOld = this.templateItem.zipcode;
  }

  constructor(public navCtrl: NavController, private navP: NavParams, private alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.templateItem = navP.get('templateItem');
    this.createNew = navP.get('createNew');
    this.templateForm = formBuilder.group({
      club: ['', Validators.compose([Validators.required])],
      street: [],
      zipcode: []
    })
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    if (this[field + "Old"] != this["templateForm"]["value"][field]) {
      this[field + "Changed"] = true;
    } else {
      this[field + "Changed"] = false;
    }
  }

  finish() {
    var that = this;
    if ((this.clubChanged || this.streetChanged || this.zipcodeChanged) && this.templateForm.controls.club.valid) {
      if (this.createNew) {
        let id = this.makeid();
        firebase.database().ref('clubs/12/templates/').child(id).set({
          club: this.templateItem.club,
          street: this.templateItem.street,
          zipcode: this.templateItem.zipcode
        }).then(function () {
          that.navCtrl.pop();
        }, function (error) {
          alert(error.message);
        });
      } else {
        firebase.database().ref('clubs/12/templates/' + this.templateItem.id).update({
          club: this.templateItem.club,
          street: this.templateItem.street,
          zipcode: this.templateItem.zipcode
        }).then(function () {
          that.navCtrl.pop();
        }, function (error) {
          alert(error.message);
        });
      }
    }
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 26; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  goBack() {
    this.navCtrl.pop();
  }


  deleteTemplate() {
    var that = this;

    let myAlert = this.alertCtrl.create({
      title: 'Adressvorlage löschen',
      message: 'Wollen Sie die Adressvorlage wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            firebase.database().ref('clubs/12/templates/' + this.templateItem.id).remove().then(function () {
              that.navCtrl.pop();
            }, function (error) {
              alert(error.message);
            });
          }
        }
      ]
    });
    myAlert.present();
  }
}
