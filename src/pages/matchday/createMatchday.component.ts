//todo
//Adressvorlagen bearbeiten
//Team (altersklasse, sklasse)
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';
import { AddTeamToMatchdayComponent } from './addTeamToMatchday.component';
import { TemplateComponent } from '../templates/template.component';
import { CreateMatchdayProvider } from '../../providers/createMatchday-provider';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [CreateMatchdayProvider]
})

export class CreateMatchdayComponent implements OnInit {
  public createMatchdayForm;
  templateChecked: boolean;
  dataTemplate: any;
  match = {id: this.id, opponent: this.opponent, team: this.team, home: this.home, location: {street: this.street, zipcode: this.zipcode}, time: this.time, pendingPlayers: this.pendingPlayersArray};
  id: any;
  opponent: string;
  team: any;
  home: any;
  street: string;
  zipcode: string;
  time: String;
  pendingPlayersArray = [];
  relevantTeams: any;
  formValid: boolean = true;
  counter: any;
  loading: any;

  opponentChanged: boolean;
  teamChanged: boolean;
  homeChanged: boolean;
  streetChanged: boolean;
  zipcodeChanged: boolean;
  timeChanged: boolean;

  ngOnInit(){
  }

  ionViewWillEnter() {
    this.loadData(true, null);
    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.templateChecked = false;
  }


  constructor(public navCtrl: NavController, public createMatchdayProvider: CreateMatchdayProvider, private Utilities: Utilities, private alertCtrl: AlertController, public formBuilder: FormBuilder, private loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController) {
    this.createMatchdayForm = formBuilder.group({
      opponent: [],
      team: [],
      home: [],
      street: [],
      zipcode: [],
      time: []
    })
  }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }

    this.loadTemplateData(showLoading, event);

    this.createMatchdayProvider.setTeams().then((data) => {
      this.relevantTeams = this.createMatchdayProvider.dataTeam;
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

  loadTemplateData(showLoading: boolean, event){
    this.createMatchdayProvider.setTemplates().then((data) => {
      this.dataTemplate = this.createMatchdayProvider.dataTemplate;
      this.counter = this.createMatchdayProvider.counter;
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

  elementChanged(input) {
    let field = input.inputControl.name;
    if (this[field + "Old"] != this["createMatchdayForm"]["value"][field]) {
      this[field + "Changed"] = true;
    } else {
      this[field + "Changed"] = false;
    }
    if (this.createMatchdayForm.controls.opponent.valid && this.createMatchdayForm.controls.street.valid) {
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  teamSelectChanged() {
    this.teamChanged = true;
  }

  homeSelectChanged() {
    this.homeChanged = true;
  }

  zipcodeSelectChanged(){
    this.zipcodeChanged = true;
  }

  timeSelectChanged() {
    this.timeChanged = true;
  }

  makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  createGame(){
    if (this.opponentChanged && this.teamChanged && this.formValid){
      if (this.templateChecked == true){
        let id = this.makeid();
        firebase.database().ref('clubs/12/templates/').child(id).set({
          club: this.match.opponent,
          street: this.match.location.street,
          zipcode: this.match.location.zipcode
        })
      }

      if (this.homeChanged == false){
        this.match.home = "unknown";
      } else {
        if (this.match.home == "true"){
          this.match.home = true;
        } else {
          this.match.home = false;
        }
      }
      if (this.streetChanged == false){
        this.match.location.street = "";
      }
      if (this.zipcodeChanged == false){
        this.match.location.zipcode = "";
      }
      if (this.timeChanged == false){
        this.match.time = "0";
      }

      this.match.id = this.makeid();
      firebase.database().ref('clubs/12/matches/').child(this.match.id).set({
        opponent: this.match.opponent,
        team: this.match.team,
        home: this.match.home,
        time: this.match.time
      })
      firebase.database().ref('clubs/12/matches/' + this.match.id + '/location').set({
        street: this.match.location.street,
        zipcode: this.match.location.zipcode
      })
      let alert = this.alertCtrl.create({
          message: 'Der Spieltag wurde erfolgreich angelegt.' +
          'Möchten Sie dem Spiel direkt Spieler zuweisen?',
          title: 'Spieltag angelegt',
          buttons: [
              {
                  text: 'Später',
                  handler: () => {
                      this.navCtrl.popToRoot();
                  }
              },
              {
                  text: 'Spieler hinzufügen',
                  handler: () => {
                      this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.match, statusArray: {acceptedArray: [], pendingArray: [], declinedArray: [], deletedArray: []}, counterArray: {acceptedCounter: 0, acceptedMaleCounter: 0, acceptedFemaleCounter: 0, pendingCounter:0, declinedCounter:0}, playerArray: null, relevantTeamsItem: this.relevantTeams, editMode: false});
                  }
              }
          ]
      });
      alert.present();
    } else {
      let error = this.alertCtrl.create({
        title: 'Warnung',
        message: 'Bitte mindestens das Gegner- sowie Mannschaftsfeld ausfüllen.',
        buttons: ['Okay']
      });
      error.present();
    }
  }

  goBack(){
    if (this.opponentChanged || this.teamChanged || this.homeChanged || this.streetChanged || this.zipcode || this.time) {
      let confirm = this.alertCtrl.create({
        title: 'Warnung',
        message: 'Beim Verlassen des Fensters gehen alle Veränderungen verloren. Fortfahren?',
        buttons: [
          {
            text: 'Nein',
            handler: () => {
            }
          },
          {
            text: 'Ja',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.navCtrl.pop();
    }
  }

  openTemplatesActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Adressvorlage speichern",
          icon: "archive",
          handler: () => this.saveTemplate()
        },
        {
          text: 'Adressvorlage laden',
          icon: "open",
          handler: () => this.showTemplates()
        },
        {
          text: "Adressvorlagen verwalten",
          icon: "settings",
          handler: () => this.editTemplates()
        },
        {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  showTemplates(){
    let alert = this.alertCtrl.create();
    let dataAvailable = false;
    alert.setTitle('Vorlage auswählen');

    for (let i in this.dataTemplate){
      alert.addInput({
        type: 'radio',
        label: this.dataTemplate[i].club + ": " + this.dataTemplate[i].street + ", " + this.dataTemplate[i].zipcode,
        value: this.dataTemplate[i].id,
        checked: false
      });
      dataAvailable = true;
    }
    if(this.counter == 0){
      alert.setMessage('Keine Adressvorlage vorhanden.');
    }
    alert.addButton('Abbrechen');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data == null){

        } else {
          this.updateTemplate(data);
          this.streetChanged = true;
          this.zipcodeChanged = true;
        }
      }
    });
    alert.present();
  }

  updateTemplate(clubID){
    if(this.match.opponent == "" || this.match.opponent == undefined){
      firebase.database().ref('clubs/12/templates/'+clubID).once('value', snapshot => {
        this.match.opponent = snapshot.val().club;
        this.match.location.street = snapshot.val().street;
        this.match.location.zipcode = snapshot.val().zipcode;
      });
    }else{
      firebase.database().ref('clubs/12/templates/'+clubID).once('value', snapshot => {
        this.match.location.street = snapshot.val().street;
        this.match.location.zipcode = snapshot.val().zipcode;
      });
    }
  }

  saveTemplate() {
    let that = this;
    // Get all templates
    let templateArray = [];
    let templateArrayVal = [];
    return firebase.database().ref('clubs/12/templates').once('value').then((snapshot) => {
      let counter = 0;
      templateArrayVal = snapshot.val();
      for (let i in snapshot.val()) {
        templateArray[counter] = snapshot.val()[i];
        templateArray[counter].id = i;
        counter++;
      }
    }).then(function() {
      //Check if template for this team already exists
      let templateExists = false;
      let templateId;
      for(let i in templateArray){
        if(templateArray[i].club == that.match.opponent){
          templateId = templateArray[i].id;
          templateExists = true;
          break;
        }
      }

      // if template already exists, ask user whether the template should be overwritten, a new template should be created, or the action should be cancelled
      if(templateExists){
        let alert = that.alertCtrl.create({
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
                firebase.database().ref('clubs/12/templates/' + templateId).update({
                  club: that.match.opponent,
                  street: that.match.location.street,
                  zipcode: that.match.location.zipcode
                }).then(function() {
                  let toast = that.toastCtrl.create({
                    message: "Adressvorlage überschrieben",
                    duration: 2000,
                    position: "top"
                  });
                  toast.present();
                  that.loadTemplateData(true, null)
                })
              }
            },
            {
              text: 'Zusätzliche Vorlage',
              handler: () => {
                let id = that.makeid();
                firebase.database().ref('clubs/12/templates/').child(id).set({
                  club: that.match.opponent + "(2)",
                  street: that.match.location.street,
                  zipcode: that.match.location.zipcode
                }).then(function() {
                  let toast = that.toastCtrl.create({
                    message: "Adressvorlage gespeichert",
                    duration: 2000,
                    position: "top"
                  });
                  toast.present();
                  that.loadTemplateData(true, null)
                })
              }
            }
          ]
        });
        alert.present();
      }else{
        let id = that.makeid();
        firebase.database().ref('clubs/12/templates/').child(id).set({
          club: that.match.opponent,
          street: that.match.location.street,
          zipcode: that.match.location.zipcode
        }).then(function() {
          let toast = that.toastCtrl.create({
            message: "Adressvorlage gespeichert",
            duration: 2000,
            position: "top"
          });
          toast.present();
          that.loadTemplateData(true, null)
        })
      }
    })
  }
  editTemplates(){
    this.navCtrl.push(TemplateComponent);
  }
}

