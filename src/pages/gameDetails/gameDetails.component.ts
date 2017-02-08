//todo
//4 men 2 women for isNotMini (Logik allgemein)
//aushilfscounter
//check createMatchday
//Alarm bei Zeitänderung
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { AddTeamToMatchdayComponent } from '../matchday/addTeamToMatchday.component';
import { TemplateComponent } from '../matchday/template.component'
import { PlayerComponent } from './player.component';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-gameDetails',
  templateUrl: 'gameDetails.component.html',
})
export class GameDetailsComponent implements OnInit{

  editMode: boolean = false;
  playerStatus: string = 'accepted';
  isAdmin: boolean;
  currentUser: any;
  loading: any;
  gameItem: any;
  playerArray: any;
  teamArray: any;
  dataTemplate: any;
  counter: any;
  statusArray: any;
  counterArray: any;
  acceptedArray = [];
  pendingArray = [];
  declinedArray = [];
  deletedArray = [];
  acceptedCounter: any;
  acceptedMaleCounter: any;
  acceptedFemaleCounter: any;
  pendingCounter: any;
  declinedCounter: any;


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
  templateChecked: boolean = false;
  dataLoaded: boolean = false;
  playersEdited: boolean;


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isTrainer();
    this.loadData(true, null);
    if (this.dataLoaded == true){
      this.setCounter();
    }
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private Utilities: Utilities,  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.gameItem = navP.get('gameItem');
  }

  isTrainer() {
      this.currentUser = this.Utilities.user;
      firebase.database().ref("/clubs/12/players/" + this.currentUser.uid + "/").once('value', snapshot => {
          let data = snapshot.val();
          if (this.isAdmin = data.isTrainer){
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }
      })
  }

  loadData(showLoading: boolean, event) :void{
    if (showLoading) {
      this.createAndShowLoading();
    }
    if(this.editMode==false){
    firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        playerArray[counter].age = this.Utilities.calculateAge(snapshot.val()[i].birthday);
        playerArray[counter].accepted = false;
        playerArray[counter].pending = false;
        playerArray[counter].declined = false;
        playerArray[counter].deleted = false;
        if (playerArray[counter].team == this.gameItem.team){
          playerArray[counter].isMainTeam = true;
        } else {
          playerArray[counter].isMainTeam = false;
        }
        if (this.gameItem.acceptedPlayers){
          for (let i in this.gameItem.acceptedPlayers){
            if (this.gameItem.acceptedPlayers[i] == playerArray[counter].id){
              playerArray[counter].accepted = true;
            }
          }
        }
        if (this.gameItem.pendingPlayers){
          for (let i in this.gameItem.pendingPlayers){
            if (this.gameItem.pendingPlayers[i] == playerArray[counter].id){
              playerArray[counter].pending = true;
            }
          }
        }
        if (this.gameItem.declinedPlayers){
          for (let i in this.gameItem.declinedPlayers){
            if (this.gameItem.declinedPlayers[i] == playerArray[counter].id){
              playerArray[counter].declined = true;
            }
          }
        }
        counter++;
      }
      this.playerArray = playerArray;
      this.playerArray = _.sortBy(this.playerArray, "lastname");
      console.log("Player loaded");
      if (this.gameItem.acceptedPlayers){
        for (let i in this.gameItem.acceptedPlayers){
          this.acceptedArray[i]=this.gameItem.acceptedPlayers[i];
        }
      }
      if (this.gameItem.pendingPlayers){
        for (let i in this.gameItem.pendingPlayers){
          this.pendingArray[i]=this.gameItem.pendingPlayers[i];
        }
      }
      if (this.gameItem.declinedPlayers){
        for (let i in this.gameItem.declinedPlayers){
          this.declinedArray[i]=this.gameItem.declinedPlayers[i];
        }
      }
      this.setCounter();
      this.dataLoaded = true;
      console.log(this.acceptedCounter);
      console.log(this.pendingCounter);
      console.log(this.declinedCounter);
      console.log(this.acceptedMaleCounter);
      console.log(this.acceptedFemaleCounter);
      console.log('pending:');
      console.log(this.pendingArray);
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
      this.teamArray = teamArray;
      this.teamArray = teamArray;
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

  getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.Utilities.allInvites) {
      if (i.match == match.id && counter < 4){
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

  setCounter(){
    this.acceptedCounter = 0;
    this.acceptedMaleCounter = 0;
    this.acceptedFemaleCounter = 0;
    this.pendingCounter = 0;
    this.declinedCounter = 0;
    for (let i in this.acceptedArray){
      for (let j in this.playerArray){
        if (this.acceptedArray[i]==this.playerArray[j].id && this.playerArray[j].gender == "m"){
          this.acceptedMaleCounter++;
        }
        if (this.acceptedArray[i]==this.playerArray[j].id && this.playerArray[j].gender == "f"){
          this.acceptedFemaleCounter++;
        }
      }
      this.acceptedCounter++;
    }
    for (let i in this.pendingArray){
      this.pendingCounter++;
    }
    for (let i in this.declinedArray){
      this.declinedCounter++;
    }
  }

  makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
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
    if (this.opponentChanged || this.teamChanged || this.homeChanged || this.streetChanged || this.zipcodeChanged || this.timeChanged || this.templateChecked || this.playersEdited) {
      if (this.templateChecked == true){
        let id = this.makeid();
        firebase.database().ref('clubs/12/templates/').child(id).set({
          club: this.gameItem.opponent,
          street: this.gameItem.location.street,
          zipcode: this.gameItem.location.zipcode
        })
      }
      if (this.gameItem.home == "true"){
        this.gameItem.home = true;
      }
      if (this.gameItem.home == "false"){
        this.gameItem.home = false;
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
      this.confirmPlayer();
    }
    this.opponentChanged = false;
    this.teamChanged = false;
    this.homeChanged = false;
    this.streetChanged = false;
    this.zipcodeChanged = false;
    this.timeChanged = false;
    this.editMode = false;
    this.playersEdited = false;
  }

  opponentEnteredChanged(input) {
    if (this.opponentOld != input) {
      this.opponentChanged = true;
    } else {
      this.opponentChanged = false;
    }
  }

  streetEnteredChanged(input) {
    if (this.streetOld != input) {
      this.streetChanged = true;
    } else {
      this.streetChanged = false;
    }
  }

  teamSelectChanged(input) {
    if (this.teamOld != input) {
      if (this.teamChanged == false){
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Durch die Änderung des Teams werden die Zahlen für die Aushilfen beeinflusst.',
          buttons: ['OK']
        });
        alert.present();
      }
      this.teamChanged = true;
      for (let i in this.playerArray){
        if (this.playerArray[i].team == this.gameItem.team){
          this.playerArray[i].isMainTeam = true;
        } else {
          this.playerArray[i].isMainTeam = false;
        }
        for (let j in this.acceptedArray){
          if (this.acceptedArray[j] == this.playerArray[i].id){
            console.log("Helpcounter changed.");
            if (this.playerArray[i].isMainTeam == true){
              this.playerArray[i].helpCounter--;
            }
            if (this.playerArray[i].isMainTeam == false){
              this.playerArray[i].helpCounter++;
            }
          }
        }
      }
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
      if (this.timeChanged == false){
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Durch die Änderung der Zeit werden alle Einladungen nochmal versendet.',
          buttons: ['OK']
        });
        alert.present();
      }
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
    this.templateChecked = false;
    this.editMode = false;
    this.playersEdited = false;
    this.loadData(true, null);
    this.deletedArray = [];
  }

  openProfile(item){
    this.navCtrl.push(PlayerComponent, { player: item});
  }

  goBack(){
    this.navCtrl.pop();
  }

  addPlayers(){
    this.playersEdited = true;
    this.statusArray = {acceptedArray: this.acceptedArray, pendingArray: this.pendingArray, declinedArray: this.declinedArray, deletedArray:this.deletedArray};
    this.counterArray = {acceptedCounter: this.acceptedCounter, acceptedMaleCounter: this.acceptedMaleCounter, acceptedFemaleCounter: this.acceptedFemaleCounter, pendingCounter: this.pendingCounter, declinedCounter: this.declinedCounter};
    this.navCtrl.push(AddTeamToMatchdayComponent, {matchItem: this.gameItem, statusArray: this.statusArray, counterArray: this.counterArray, playerArray: this.playerArray, relevantTeamsItem: this.teamArray, editMode: true});
  }

  removePlayer(player){
    let counter = 0;
    if(player.pending == true){
      for (let i in this.pendingArray) {
        if (this.pendingArray[i] == player.id){
          this.pendingArray.splice(counter, 1);
          this.deletedArray.push(player.id);
          this.pendingCounter--;
        }
        counter ++;
      }
      player.pending = false;
      console.log('pending: ');
      console.log(this.pendingArray);
      console.log('deleted: ');
      console.log(this.deletedArray);
    }
    counter = 0;
    if(player.accepted == true){
      for (let i in this.acceptedArray) {
        if (this.acceptedArray[i] == player.id){
          this.acceptedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
          for (let j in this.playerArray){
            if (player.id==this.playerArray[j].id && this.playerArray[j].gender == "m"){
              this.acceptedMaleCounter--;
              break;
            }
            if (player.id==this.playerArray[j].id && this.playerArray[j].gender == "f"){
              this.acceptedFemaleCounter--;
              break;
            }
          }
          this.acceptedCounter--;
        }
        counter ++;
      }
      if (player.isMainTeam == false){
        for (let i in this.playerArray){
          if(player.id == this.playerArray[i].id){
            this.playerArray[i].helpCounter--;
          }
        }
      }
      player.accepted = false;
      console.log('accepted: ');
      console.log(this.acceptedArray);
      console.log('deleted: ');
      console.log(this.deletedArray);
    }
    counter = 0;
    if(player.declined == true){
      for (let i in this.declinedArray) {
        if (this.declinedArray[i] == player.id){
          this.declinedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
          this.declinedCounter--;
        }
        counter ++;
      }
      player.declined = false;
      console.log('declined: ');
      console.log(this.declinedArray);
      console.log('deleted: ');
      console.log(this.deletedArray);
    }
    player.deleted = true;
    this.playersEdited = true;
  }

  confirmPlayer(){
    if (this.timeChanged == true){
      for (let i in this.acceptedArray){
        for (let j in this.playerArray){
          if (this.acceptedArray[i] == this.playerArray[j].id && this.playerArray[j].isDefault == false){
            this.pendingArray.push(this.acceptedArray[i]);
            if (this.playerArray[j].isMainTeam == false){
              this.playerArray[j].helpCounter--;
            }
            this.acceptedArray[i] = null;
          }
        }              
      }
      for (let i in this.acceptedArray){
        this.acceptedArray[i]=this.acceptedArray[i];
      }
      for (let i in this.declinedArray){
        this.pendingArray.push(this.declinedArray[i]);
      }
      this.declinedArray = [];
      console.log(this.acceptedArray);
      console.log(this.pendingArray);
      console.log(this.declinedArray);
    }

    firebase.database().ref('clubs/12/matches/' + this.gameItem.id + '/').update({
      pendingPlayers: this.pendingArray,
      acceptedPlayers: this.acceptedArray,
      declinedPlayers: this.declinedArray
    });

    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      console.log(this.playerArray);
      for (let i in snapshot.val()){
        for (let j in this.playerArray){
          if (this.playerArray[j].id == i){
            console.log(this.playerArray[j].helpCounter);
            firebase.database().ref('clubs/12/players/' + i ).update({
              helpCounter: this.playerArray[j].helpCounter
            });
          }
        }
      }
    });

    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let i in snapshot.val()) {
        for (let j in this.deletedArray){
          if (snapshot.val()[i].match == this.gameItem.id && snapshot.val()[i].recipient == this.deletedArray[j]){
            console.log("gefunden");
            console.log(i);
            firebase.database().ref('clubs/12/invites/' + i).remove();
          }
        }
      }      
    });
    
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let k in this.pendingArray){
        for (let j in this.playerArray){
          if (this.playerArray[j].id == this.pendingArray[k] && this.playerArray[j].isDefault == false){
            let inviteExists = false;
            for (let i in snapshot.val()) {
              if (snapshot.val()[i].match == this.gameItem.id && snapshot.val()[i].recipient == this.pendingArray[k]){
                console.log("inviteExists now true");
                console.log(this.playerArray[j]);
                console.log(this.playerArray[j].isMainTeam);
                if (this.playerArray[j].isMainTeam == false){
                  firebase.database().ref('clubs/12/invites/').child(i).update({
                    assist: true
                  });
                } else {
                  firebase.database().ref('clubs/12/invites/').child(i).update({
                    assist: false
                  });
                }
                if (snapshot.val()[i].state != 0){
                  //push-Benachrichtigung an snapshot.val()[i].recipient
                  //Zugriff auf Spielerobjekt
                  /*for (let j in this.allPlayers){
                    let player;
                    if (this.allPlayers[j].id == snapshot.val()[i].recipient){
                      player = this.allPlayers[j];
                    }
                  }*/
                }
                firebase.database().ref('clubs/12/invites/' + i).update({
                  state: 0
                });
                inviteExists = true;
              }     
            }
            if (inviteExists == false){
              let id = this.makeid();
              firebase.database().ref('clubs/12/invites/').child(id).set({
                assist: false,
                match: this.gameItem.id.toString(),
                recipient: this.pendingArray[k],
                sender: this.Utilities.user.uid,
                state: 0
              });
              if (this.playerArray[j].isMainTeam == false){
                firebase.database().ref('clubs/12/invites/').child(id).update({
                  assist: true
                });
              }
              //push-Benachrichtigung an this.pendingArray[k]
              //Zugriff auf Spielerobjekt
              /*for (let l in this.allPlayers){
                let player;
                if (this.allPlayers[l].id == this.pendingArray[k]){
                  player = this.allPlayers[l];
                  console.log(player);
                }
              }*/
            }
          }
        }
      }
    });
  }

  deleteGame(){
    let confirm = this.alertCtrl.create({
      title: 'Warnung',
      message: 'Daten können nach Löschvorgang nicht wiederhergestellt werden. Fortfahren?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
          }
        },
        {
          text: 'Ja',
          handler: () => {
            firebase.database().ref('clubs/12/players').once('value', snapshot => {
              for (let i in snapshot.val()){
                for (let j in this.gameItem.acceptedPlayers){
                  if (this.gameItem.acceptedPlayers[j] == i && snapshot.val()[i].team != this.gameItem.team){
                    let newHelpCounter = snapshot.val()[i].helpCounter;
                    newHelpCounter--;
                    firebase.database().ref('clubs/12/players/' + i).update({
                      helpCounter: newHelpCounter
                    });
                  }
                }
              }  
            });
            firebase.database().ref('clubs/12/invites').once('value', snapshot => {
              for (let i in snapshot.val()) {
                if (snapshot.val()[i].match == this.gameItem.id){
                  firebase.database().ref('clubs/12/invites/' + i).remove();
                }     
              }      
            });
            firebase.database().ref('clubs/12/matches/' + this.gameItem.id).remove();
            this.navCtrl.popToRoot();
          }
        }
      ]
    });
    confirm.present();
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
      this.gameItem.location.street = snapshot.val().street;
      this.gameItem.location.zipcode = snapshot.val().zipcode;
    });
  }

  editTemplates(){
    this.navCtrl.push(TemplateComponent);
  }
  
}

