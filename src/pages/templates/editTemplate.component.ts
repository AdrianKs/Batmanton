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
  allTemplates: any;

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
    this.allTemplates = navP.get('allTemplates');
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
    // let that = this;
    if ((this.clubChanged || this.streetChanged || this.zipcodeChanged) && this.templateForm.controls.club.valid) {
      // if the club has been changed, check whether a template for this club already exists
      if(this.clubChanged){
        let templateExists = false;
        let templateId;

        for(let i in this.allTemplates){
          if(this.allTemplates[i].club == this.templateItem.club){
            templateId = this.allTemplates[i].id;
            templateExists = true;
            break;
          }
        }

        // if template already exists, ask user whether the template should be overwritten, a new template should be created, or the action should be cancelled
        if(templateExists){
          let myAlert = this.alertCtrl.create({
            title: 'Adressvorlage für diesen Gegner existiert bereits',
            message: 'Die Adressvorlage für diesen Gegner existiert bereits. Möchten Sie sie überschreiben oder eine zusätzliche Adressvorlage für diesen Gegner erstellen?',
            buttons: [
              {
                text: 'Abbrechen',
                role: 'cancel'
              },
              {
                text: 'Überschreiben',
                handler: () => {
                  this.updateTemplate(this.templateItem.id);
                  firebase.database().ref('clubs/12/templates/' + templateId).remove().then(function () {
                  }, function (error) {
                    alert(error.message);
                  });
                }
              },
              {
                text: 'Zusätzliche Vorlage',
                handler: () => {
                  if (this.createNew) {
                    this.createNewTemplate(" (2)");
                  } else {
                    this.updateTemplate(this.templateItem.id);
                  }
                }
              }
            ]
          });
          myAlert.present();
        }else{
          if (this.createNew) {
            this.createNewTemplate("");
          } else {
            this.updateTemplate(this.templateItem.id);
          }
        }

      }else{
        if (this.createNew) {
          this.createNewTemplate("");
        } else {
          this.updateTemplate(this.templateItem.id);
        }
      }
    }
  }

  updateTemplate(id){
    var that = this;
    firebase.database().ref('clubs/12/templates/' + id).update({
      club: this.templateItem.club,
      street: this.templateItem.street,
      zipcode: this.templateItem.zipcode
    }).then(function () {
      that.navCtrl.pop();
    }, function (error) {
      alert(error.message);
    });
  }

  createNewTemplate(suffix){
    var that = this;
    let id = this.makeid();
    firebase.database().ref('clubs/12/templates/').child(id).set({
      club: this.templateItem.club + suffix,
      street: this.templateItem.street,
      zipcode: this.templateItem.zipcode
    }).then(function () {
      that.navCtrl.pop();
    }, function (error) {
      alert(error.message);
    });
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
