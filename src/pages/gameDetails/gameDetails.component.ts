//todo
//Spiel/Mannschaftsbild größer
//Profil der anderen Spieler anklicken
//Remove Player
//4 men 2 women for isNotMini (Logik allgemein)
//Delete game (Lösung über matchID)

import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MyGamesService } from '../../providers/myGames.service';
import { AddTeamToMatchdayComponent } from '../matchday/addTeamToMatchday.component'
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';

@Component({
  selector: 'page-gameDetails',
  templateUrl: 'gameDetails.component.html',
  providers: [MyGamesService]
})
export class GameDetailsComponent implements OnInit{
  public profileForm;
  editMode: boolean = false;
  playerStatus: string = 'accepted';
  gameItem: any;
  playerArray: any;
  teamArray: any;
  formValid: boolean = true;

  opponentOld: string;
  teamOld: string;
  homeOld: boolean;
  streetOld: string;
  zipcodeOld: number;
  timeOld: string;

  opponentChanged: boolean;
  teamChanged: boolean;
  homeChanged: boolean;
  streetChanged: boolean;
  zipcodeChanged: boolean;
  timeChanged: boolean;

  ngOnInit() {
    this.playerArray = this.Utilities.allPlayers;
    this.teamArray = this.Utilities.allTeams;
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private MyGamesService: MyGamesService, private Utilities: Utilities, public formBuilder: FormBuilder, private alertCtrl: AlertController) {
    //Load data in array
    this.gameItem = navP.get('gameItem');
    this.profileForm = formBuilder.group({
      opponent: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      team: [],
      home: [],
      street: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
      zipcode: [],
      time: []
    })
  }

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.Utilities.allInvites) {
      if (i.match == match.id && i.sender == this.Utilities.user.uid && counter < 4){
          for(let j of this.Utilities.allPlayers){
            if(i.recipient == j.id){
              urlArray[counter] = j.picUrl;
              counter ++;
            }
          }
      }
    }
    return urlArray;
  }

  editProfile() {
    this.opponentOld = this.gameItem.opponent;
    this.teamOld = this.gameItem.team;
    this.homeOld = this.gameItem.home;
    this.streetOld = this.gameItem.location.street;
    this.zipcodeOld = this.gameItem.location.zipcode;
    this.timeOld = this.gameItem.time;
    this.editMode = true;
  }

  finishEditProfile() {
    if ((this.opponentChanged || this.teamChanged || this.homeChanged || this.streetChanged || this.zipcodeChanged || this.timeChanged) && this.formValid) {
      if (this.gameItem.home){
          if (this.gameItem.home == true){
          this.gameItem.home = true;
        } else {
          this.gameItem.home = false;
        }
      }
      if (this.timeChanged){
        /*this.gameItem.time = this.gameItem.time.substring(0, this.gameItem.time.length - 1);
        this.gameItem.time = this.gameItem.time.replace("T","-");
        this.gameItem.time = this.gameItem.time.replace(/:/g,"-");*/
      }
      firebase.database().ref('clubs/12/matches/' + this.gameItem.id).set({
        opponent: this.gameItem.opponent,
        team: this.gameItem.team,
        home: this.gameItem.home,
        time: this.gameItem.time
      });
      if(this.gameItem.acceptedPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          acceptedPlayers: this.gameItem.acceptedPlayers
        });   
      }
      if(this.gameItem.pendingPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          pendingPlayers: this.gameItem.pendingPlayers
        });   
      }
      if(this.gameItem.declinedPlayers){
        firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
          declinedPlayers: this.gameItem.declinedPlayers
        });   
      }
      firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/location').set({
        street: this.gameItem.location.street,
        zipcode: this.gameItem.location.zipcode
      });
    }
    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.editMode = false;
  }

  elementChanged(input) {
    let field = input.inputControl.name;
    if (this[field + "Old"] != this["profileForm"]["value"][field]) {
      this[field + "Changed"] = true;
    } else {
      this[field + "Changed"] = false;
    }
    if (this.profileForm.controls.opponent.valid && this.profileForm.controls.street.valid && this.profileForm.controls.zipcode.valid) {
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      this.teamChanged = true;
    } else {
      this.teamChanged = false;
    }
  }

  homeSelectChanged(input) {
    if (this.homeOld != input) {
      this.homeChanged = true;
    } else {
      this.homeChanged = false;
    }
  }

  zipcodeSelectChanged(input){
    if (this.zipcodeOld != input) {
      this.zipcodeChanged = true;
    } else {
      this.zipcodeChanged = false;
    }
  }

  timeSelectChanged(input) {
    if (this.timeOld != input) {
      this.timeChanged = true;
    } else {
      this.timeChanged = false;
    }
  }

  cancelEditProfile() {
    this.gameItem.opponent = this.opponentOld;
    this.gameItem.team = this.teamOld;
    this.gameItem.home = this.homeOld;
    this.gameItem.location.street = this.streetOld;
    this.gameItem.location.zipcode = this.zipcodeOld;
    this.gameItem.time = this.timeOld;

    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.editMode = false;
  }

  checkItem(item){
    console.log(item);
  }

  startsWithACapital(c: FormControl) {
    let NAME_REGEXP = new RegExp("[A-Z]");
    if (!NAME_REGEXP.test(c.value.charAt(0))) {
      return {"incorrectNameFormat": true}
    }
    return null;
  }

  goBack(){
    this.navCtrl.popToRoot();
  }

  addPlayers(){
    if (this.gameItem.team == "0"){
      let error = this.alertCtrl.create({
        title: 'Achtung!',
        message: 'Bitte Mannschaft auswählen, damit Spieler hinzugefügt werden können.',
        buttons: ['Okay']
      });
      error.present();
    } else {
      this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.gameItem, relevantTeamsItem: this.teamArray});
    }
  }
  
}

