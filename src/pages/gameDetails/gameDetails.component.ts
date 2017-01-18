/**
 * Created by kochsiek on 08.12.2016.
 */
//todo
//Spiel/Mannschaftsbild
//edit game
//Delete game
//back button
//Add/remove player
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyGamesService } from '../../providers/myGames.service';
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

  constructor(private navCtrl: NavController, private navP: NavParams, private MyGamesService: MyGamesService, private Utilities: Utilities, public formBuilder: FormBuilder) {
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
      if (this.gameItem.home == true){
        this.gameItem.home = true;
      } else {
        this.gameItem.home = false;
      }
      firebase.database().ref('clubs/12/matches/' + this.gameItem.id).set({
        opponent: this.gameItem.opponent,
        team: this.gameItem.team,
        home: this.gameItem.home,
        time: this.gameItem.time
      });
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
}

