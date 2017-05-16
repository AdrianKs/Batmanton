//todo
//bilder
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { EditTemplateComponent } from './editTemplate.component';
import firebase from 'firebase';
import * as _ from 'lodash';

@Component({
  templateUrl: 'template.component.html',
})

export class TemplateComponent {

  ionViewWillEnter() {
    this.loadData(true, null);
  }

  dataTemplate: any;
  loading: any;
  counter: any;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

  openDetails(value) {
    let templateCopy = {club: value.club, street: value.street, zipcode: value.zipcode, id: value.id};
    this.navCtrl.push(EditTemplateComponent, { templateItem: templateCopy, createNew: false, allTemplates: this.dataTemplate});
  }

  createTemplate(){
    let emptyTemplateObject = {club: "", street: "", zipcode: ""};
    this.navCtrl.push(EditTemplateComponent, { templateItem: emptyTemplateObject, createNew: true, allTemplates: this.dataTemplate});
  }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    firebase.database().ref('clubs/12/templates').once('value', snapshot => {
      let templateArray = [];
      this.counter = 0;
      for (let i in snapshot.val()) {
        templateArray[this.counter] = snapshot.val()[i];
        templateArray[this.counter].id = i;
        templateArray[this.counter].deleted = false;
        this.counter++;
      }
      this.dataTemplate = templateArray;
      this.dataTemplate = _.sortBy(this.dataTemplate, "club");
    }).then((data) => {
      if (showLoading) {
      this.loading.dismiss().catch((error) => console.log("error caught"));
      }
      if(event!=null){
        event.complete();
      }
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
  }

  createAndShowErrorAlert(error) {
      let alert = this.alertCtrl.create({
        title: 'Fehler beim Empfangen der Daten',
        message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten :-(',
        buttons: ['OK']
      });
      alert.present();
    }

  createAndShowLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loading.present();
  }

  makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  doRefresh(refresher) {
    this.loadData(false, refresher);
  }

  deleteTemplate(templateItem) {
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
            firebase.database().ref('clubs/12/templates/' + templateItem.id).remove().then(function () {
              that.loadData(false, null);
            }, function (error) {
              alert(error.message);
            });
          }
        }
      ]
    });
    myAlert.present();
  }

  goBack(){
    this.navCtrl.pop();
  }
}

