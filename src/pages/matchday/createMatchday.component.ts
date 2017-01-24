//todo
//Formcontroll ggf. überarbeiten...
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AddTeamToMatchdayComponent } from './addTeamToMatchday.component'
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [MatchdayService]
})

export class CreateMatchdayComponent implements OnInit {
  public createMatchdayForm;
  match = {opponent: this.opponent, team: this.team, home: this.home, location: {street: this.street, zipcode: this.zipcode}, time: this.time, pendingPlayers: this.pendingPlayersArray};
  opponent: string;
  team: any;
  home: any;
  street: string;
  zipcode: string;
  time: String;
  pendingPlayersArray = [];
  relevantTeams = this.Utilities.allTeams;
  formValid: boolean = true;

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
  }

  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService, private Utilities: Utilities, private alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.createMatchdayForm = formBuilder.group({
      opponent: [],
      team: [],
      home: [],
      street: [],
      zipcode: [],
      time: []
    })
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

  createGame(){
    if (this.opponentChanged && this.teamChanged && this.formValid){
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

      if (this.match.team == 0){
        this.pendingPlayersArray[0] = "Keiner";
        this.match.pendingPlayers = this.pendingPlayersArray;
        firebase.database().ref('clubs/12/matches').once('value', snapshot => {
          let matchesArray = [];
          let counter = 0;
          for (let i in snapshot.val()) {
            matchesArray[counter] = snapshot.val()[i];
            counter++;
          }
          matchesArray.push(this.match);
          firebase.database().ref('clubs/12').update({
              matches: matchesArray
          });
          firebase.database().ref('clubs/12/matches/' + counter + '/pendingPlayers').remove();
        });
        this.navCtrl.popToRoot();
      } else {
        this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.match, relevantTeamsItem: this.relevantTeams});
      }
    } else {
      let error = this.alertCtrl.create({
        title: 'Warnung',
        message: 'Bitte mindestens das Gegner- sowie Teamfeld ausfüllen.',
        buttons: ['Okay']
      });
      error.present();
    }
  }

  goBack(){
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
  }

}