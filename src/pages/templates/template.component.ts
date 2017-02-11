//todo
//bilder
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-template',
  templateUrl: 'template.component.html',
})

export class TemplateComponent implements OnInit {

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.loadData(true, null);
  }

  dataTemplate: any;
  loading: any;
  counter: any;
  
  constructor(public navCtrl: NavController, private Utilities: Utilities, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    
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

  deleteTemplate(templateItem){
    templateItem.deleted = true;
    firebase.database().ref('clubs/12/templates/'+templateItem.id).remove();
    let toast = this.toastCtrl.create({
      message: 'Adressvorlage wurde gelöscht',
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  editTemplate(templateItem){
    let prompt = this.alertCtrl.create({
      title: 'Adresse bearbeiten',
      message: "Bitte Felder ausfüllen:",
      inputs: [
        {
          name: 'club',
          placeholder: templateItem.club
        },
        {
          name: 'street',
          placeholder: templateItem.street
        },
        {
          name: 'zipcode',
          placeholder: templateItem.zipcode
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          handler: data => {
          }
        },
        {
          text: 'Absenden',
          handler: data => {
            if (data.club == ""){
              data.club = templateItem.club;
            }
            if (data.street == ""){
              data.street = templateItem.street;
            }
            if (data.zipcode == ""){
              data.zipcode = templateItem.zipcode;
            }
            firebase.database().ref('clubs/12/templates/'+templateItem.id).set({
              club: data.club,
              street: data.street,
              zipcode: data.zipcode
            });
            this.loadData(false, null);
          }
        }
      ]
    });
    prompt.present();
  }

  createTemplate(){
    let prompt = this.alertCtrl.create({
      title: 'Adresse hinzufügen',
      message: "Bitte Felder ausfüllen:",
      inputs: [
        {
          name: 'club',
          placeholder: 'Vereinsname'
        },
        {
          name: 'street',
          placeholder: 'Adresse'
        },
        {
          name: 'zipcode',
          placeholder: 'PLZ'
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          handler: data => {
          }
        },
        {
          text: 'Absenden',
          handler: data => {
            let id = this.makeid();
            firebase.database().ref('clubs/12/templates/').child(id).set({
              club: data.club,
              street: data.street,
              zipcode: data.zipcode
            });
            this.loadData(false, null);
          }
        }
      ]
    });
    prompt.present();
  }

  goBack(){
    this.navCtrl.pop();
  }
}

