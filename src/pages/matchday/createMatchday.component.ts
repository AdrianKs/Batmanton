//todo
//Adressvorlagen bearbeiten
//Team (altersklasse, sklasse)
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AddTeamToMatchdayComponent } from './addTeamToMatchday.component';
import { TemplateComponent } from './template.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
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
    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.templateChecked = false;
  }

  ionViewWillEnter() {
    this.loadData(true, null);
  }

  
  constructor(public navCtrl: NavController, private Utilities: Utilities, private alertCtrl: AlertController, public formBuilder: FormBuilder, private loadingCtrl: LoadingController) {
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
    firebase.database().ref('clubs/12/templates').once('value', snapshot => {
      let templateArray = [];
      this.counter = 0;
      for (let i in snapshot.val()) {
        templateArray[this.counter] = snapshot.val()[i];
        templateArray[this.counter].id = i;
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
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.relevantTeams = teamArray;
      this.relevantTeams = teamArray;
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
        if (this.match.home == true){
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
          message: 'Das Spiel wurde erfolgreich angelegt! Möchten Sie dem Spiel direkt Spieler zuweisen?',
          title: 'Mannschaft angelegt',
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
                      this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.match, relevantTeamsItem: this.relevantTeams});
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
    

    alert.addButton('Abbruch');
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
    firebase.database().ref('clubs/12/templates/'+clubID).once('value', snapshot => {
      this.match.location.street = snapshot.val().street;
      this.match.location.zipcode = snapshot.val().zipcode;
    });
  }

  editTemplates(){
    this.navCtrl.push(TemplateComponent);
  }

}