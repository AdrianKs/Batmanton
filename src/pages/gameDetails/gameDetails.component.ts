//todo
//4 men 2 women for isNotMini (Logik allgemein)
//aushilfscounter
//check createMatchday
//Alarm bei Zeitänderung
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ActionSheetController, ToastController, ModalController } from 'ionic-angular';
import { AddTeamToMatchdayComponent } from '../matchday/addTeamToMatchday.component';
import { TemplateComponent } from '../templates/template.component'
import { CreateMatchdayProvider } from '../../providers/createMatchday-provider';
import firebase from 'firebase';
import {Utilities} from '../../app/utilities';
import * as _ from 'lodash';

@Component({
  selector: 'page-gameDetails',
  templateUrl: 'gameDetails.component.html',
  providers: [CreateMatchdayProvider]
})
export class GameDetailsComponent implements OnInit{

  editMode: boolean = false;
  playerStatus: string = 'accepted';
  isAdmin: boolean;
  loggedInUserID: string = this.Utilities.user.uid;
  currentUser: any;
  maxYear: any;
  loading: any;
  gameItem: any;
  inviteItem: any;
  option: any;
  playerArray: any;
  teamArray: any;
  dataTemplate: any;
  counter: any;
  helpCounter: any;
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
  testRadioOpen: boolean;
  testRadioResult;


  opponentOld: string;
  teamOld: string;
  homeOld: boolean;
  streetOld: string;
  zipcodeOld: number;
  timeOld: string;

  opponentChanged: boolean;
  teamChanged: boolean;
  homeChanged: boolean;
  streetChanged: boolean = false;
  zipcodeChanged: boolean = false;
  timeChanged: boolean = false;
  templateChecked: boolean = false;
  dataLoaded: boolean = false;
  playersEdited: boolean;


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isTrainer();
    this.maxYear = (parseInt(new Date().toISOString().slice(0,4))+1).toString();
    this.loadData(true, null);
    if (this.dataLoaded == true){
      this.setCounter();
    }
  }

  constructor(private navCtrl: NavController, public createMatchdayProvider: CreateMatchdayProvider, private navP: NavParams, private Utilities: Utilities,  private alertCtrl: AlertController, private loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public modalCtrl: ModalController) {
    this.gameItem = navP.get('gameItem');
    this.option = navP.get('option');
    this.inviteItem = navP.get('inviteItem');
    console.log(this.option);
    console.log(this.inviteItem);
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
      this.createMatchdayProvider.setPlayer(this.Utilities, this.gameItem, this.acceptedArray, this.pendingArray, this.declinedArray).then((data) => {
        this.playerArray = this.createMatchdayProvider.playerArray;
        this.setCounter();
        this.dataLoaded = true;
        console.log(this.acceptedCounter);
        console.log(this.pendingCounter);
        console.log(this.declinedCounter);
        console.log(this.acceptedMaleCounter);
        console.log(this.acceptedFemaleCounter);
        console.log('pending:');
        console.log(this.pendingArray);
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

    this.loadTemplateData(showLoading, event);

    this.createMatchdayProvider.setTeams().then((data) => {
      this.teamArray = this.createMatchdayProvider.dataTeam;
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
    if (this.gameItem.opponent == ""){
      let alert = this.alertCtrl.create({
        title: 'Achtung!',
        message: 'Bitte das Feld für die gegnerische Mannschaft ausfüllen.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if (this.opponentChanged || this.teamChanged || this.homeChanged || this.streetChanged || this.zipcodeChanged || this.timeChanged || this.playersEdited) {
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
      if (this.streetChanged == false){
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Durch die Änderung der Adresse werden alle Einladungen nochmal versendet.',
          buttons: ['OK']
        });
        alert.present();
      }
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
      if (this.zipcodeChanged == false){
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Durch die Änderung der PLZ werden alle Einladungen nochmal versendet.',
          buttons: ['OK']
        });
        alert.present();
      }
      this.zipcodeChanged = true;
    } else {
      this.zipcodeChanged = false;
    }
  }

  timeSelectChanged(input) {
    if (this.timeOld != input && input != undefined) {
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

    console.log('accepted: ' + this.acceptedArray);
    console.log('pending: ' + this.pendingArray);
    console.log('declined: ' + this.declinedArray);
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
              break
            }
            if (player.id==this.playerArray[j].id && this.playerArray[j].gender == "f"){
              this.acceptedFemaleCounter--;
              break
            }
          }
          console.log(this.acceptedArray[i]);
          console.log(this.acceptedCounter);
          this.acceptedCounter--;
          console.log("einmal");
          console.log(this.acceptedCounter);
        }
        counter++;
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
    if (this.timeChanged == true || this.streetChanged == true || this.zipcodeChanged == true){
      for (let i in this.acceptedArray){
        for (let j in this.playerArray){
          if (this.acceptedArray[i] == this.playerArray[j].id && this.playerArray[j].isDefault == false){
            this.pendingArray.push(this.acceptedArray[i]);
            this.acceptedCounter--;
            if (this.playerArray[j].gender == "m"){
              this.acceptedMaleCounter--;
            }
            if (this.playerArray[j].gender == "F"){
              this.acceptedFemaleCounter--;
            }
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
        this.declinedCounter--;
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

    console.log("timeChanged: "+ this.timeChanged);
    if(this.timeChanged == true || this.streetChanged == true || this.zipcodeChanged == true){
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
                  console.log("push-benachrichtigung an: "+snapshot.val()[i].recipient);
                  //push-Benachrichtigung an snapshot.val()[i].recipient
                  //Zugriff auf Spielerobjekt
                  /*for (let j in this.allPlayers){
                    let player;
                    if (this.allPlayers[j].id == snapshot.val()[i].recipient){
                      player = this.allPlayers[j];
                    }
                  }*/
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
                console.log("push-benachrichtigung an: "+this.pendingArray[k]);
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
    } else {
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
                    console.log("push-benachrichtigung an: "+snapshot.val()[i].recipient);
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
                console.log("push-benachrichtigung an: "+this.pendingArray[k]);
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
    let templatesAvailable = false;
    let alert = this.alertCtrl.create();
    alert.setTitle('Vorlage auswählen');

    for (let i in this.dataTemplate){
      if(this.dataTemplate[i].street == "" || this.dataTemplate[i].street == ""){
        alert.addInput({
          type: 'radio',
          label: this.dataTemplate[i].club + ": " + this.dataTemplate[i].street + this.dataTemplate[i].zipcode,
          value: this.dataTemplate[i].id,
          checked: false
        });
      }else{
        alert.addInput({
          type: 'radio',
          label: this.dataTemplate[i].club + ": " + this.dataTemplate[i].street + " - " + this.dataTemplate[i].zipcode,
          value: this.dataTemplate[i].id,
          checked: false
        });
      }

      templatesAvailable = true;
    }
    if(!templatesAvailable){
      alert.setMessage('Keine Adressvorlage vorhanden.');
    }else{
      alert.setCssClass('templates-alert');
      alert.addButton('Abbrechen');
    }
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data != null){
          this.updateTemplate(data);
          this.streetChanged = true;
          this.zipcodeChanged = true;
        }
      }
    });
    alert.present();
  }

  updateTemplate(clubID){
    if(this.gameItem.opponent == "" || this.gameItem.opponent == undefined){
      firebase.database().ref('clubs/12/templates/'+clubID).once('value', snapshot => {
        this.gameItem.opponent = snapshot.val().club;
        this.gameItem.location.street = snapshot.val().street;
        this.gameItem.location.zipcode = snapshot.val().zipcode;
      });
    }else{
      firebase.database().ref('clubs/12/templates/'+clubID).once('value', snapshot => {
        this.gameItem.location.street = snapshot.val().street;
        this.gameItem.location.zipcode = snapshot.val().zipcode;
      });
    }
  }

  saveTemplate() {
    let that = this;
    let templateExists = false;
    let templateId;

    for(let i in this.dataTemplate){
      if(this.dataTemplate[i].club == that.gameItem.opponent){
        templateId = this.dataTemplate[i].id;
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
                club: that.gameItem.opponent,
                street: that.gameItem.location.street,
                zipcode: that.gameItem.location.zipcode
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
                club: that.gameItem.opponent + "(2)",
                street: that.gameItem.location.street,
                zipcode: that.gameItem.location.zipcode
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
        club: that.gameItem.opponent,
        street: that.gameItem.location.street,
        zipcode: that.gameItem.location.zipcode
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
  editTemplates(){
    this.navCtrl.push(TemplateComponent);
  }

  verifyAccept(inviteItem){
    this.option = 2;
    firebase.database().ref('clubs/12/invites/' + inviteItem.id).update({
      state: 1
    }).then(() => {
      this.Utilities.countOpen();
    });;
    if (inviteItem.assist == true){
      for (let i in this.playerArray){
        if (this.playerArray[i].id == this.loggedInUserID){
          this.helpCounter = this.playerArray[i].helpCounter;
          this.helpCounter++;
          firebase.database().ref('clubs/12/players/' + this.loggedInUserID).update({
            helpCounter: this.helpCounter
          });
        }
      }
    }
    inviteItem.state = 1;
    this.pendingToAccepted(inviteItem.match, this.loggedInUserID);
    let alert = this.alertCtrl.create({
      title: 'Zugesagt',
      message: 'Du wirst diesem Spieltag zugeteilt.',
      buttons: ['Ok']
    });
    alert.present();
    //push-Benachrichtigung an alle Admins
    //Zugriff auf Spielerobjekt
    /*for (let j in this.allPlayers){
      let player;
      if (this.allPlayers[j].isAdmin == true){
        player = this.allPlayers[j];
      }
    }*/
    this.loadData(false, null);
  }

  doRadio(inviteItem, value) {
    this.option = null;
    let alert = this.alertCtrl.create();
    alert.setTitle('Grund der Abwesenheit:');

    alert.addInput({
      type: 'radio',
      label: 'Erkältet',
      value: 'sick',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Verletzt',
      value: 'injured'
    });

    alert.addInput({
      type: 'radio',
      label: 'Schule/Studium/Beruf',
      value: 'education'
    });

    alert.addInput({
      type: 'radio',
      label: 'Privat',
      value: 'private'
    });

    alert.addInput({
      type: 'radio',
      label: 'Sonstige',
      value: 'miscellaneous'
    });

    alert.addButton('Abbrechen');
    alert.addButton({
      text: 'Absenden',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        if(this.testRadioResult == 'sick' || this.testRadioResult == 'education' || this.testRadioResult == 'private'){
          console.log('Radio data:', data);
          inviteItem.state = 2;
          if (value == 0){
            this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
          } else {
            this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
            if (inviteItem.assist == true){
              for (let i in this.playerArray){
                if (this.playerArray[i].id == this.loggedInUserID){
                  this.helpCounter = this.playerArray[i].helpCounter;
                  this.helpCounter--;
                  firebase.database().ref('clubs/12/players/' + this.loggedInUserID).update({
                    helpCounter: this.helpCounter
                  });
                }
              }
            }
          }
          firebase.database().ref('clubs/12/invites/' + inviteItem.id).update({
            excuse: this.testRadioResult,
            state: 2
          }).then(() => {
            this.Utilities.countOpen();
          });
          //push-Benachrichtigung an alle Admins
          //Zugriff auf Spielerobjekt
          /*for (let j in this.allPlayers){
            let player;
            if (this.allPlayers[j].isAdmin == true){
              player = this.allPlayers[j];
            }
          }*/
          this.loadData(false, null);
        }
        if(this.testRadioResult == 'injured' || this.testRadioResult == 'miscellaneous'){
            let prompt = this.alertCtrl.create({
              title: 'Verletzt/Sonstige',
              message: "Bitte näher ausführen:",
              inputs: [
                {
                  name: 'extra',
                  placeholder: 'Wie lange wirst du ausfallen?'
                },
              ],
              buttons: [
                {
                  text: 'Abbrechen',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Absenden',
                  handler: data => {
                    console.log('Radio data:', this.testRadioResult + ': ' +data.extra);
                    inviteItem.state = 2;
                    if (value == 0){
                      this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
                    } else {
                      this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
                    if (inviteItem.assist == true){
                      for (let i in this.playerArray){
                        if (this.playerArray[i].id == this.loggedInUserID){
                          this.helpCounter = this.playerArray[i].helpCounter;
                          this.helpCounter--;
                          firebase.database().ref('clubs/12/players/' + this.loggedInUserID).update({
                            helpCounter: this.helpCounter
                          });
                        }
                      }
                    }
                    }
                    firebase.database().ref('clubs/12/invites/' + inviteItem.id).update({
                      excuse: this.testRadioResult + ': ' +data.extra,
                      state: 2
                    }).then(() => {
                      this.Utilities.countOpen();
                    });
                    //push-Benachrichtigung an alle Admins
                    //Zugriff auf Spielerobjekt
                    /*for (let j in this.allPlayers){
                      let player;
                      if (this.allPlayers[j].isAdmin == true){
                        player = this.allPlayers[j];
                      }
                    }*/
                    this.loadData(false, null);
                  }
                }
              ]
            });
            prompt.present();
          }
       }
     });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
  }
  pendingToAccepted(matchID, userID){
    if (matchID != undefined && matchID != "0") {
      firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers').once('value', snapshot => {
        let playerArray = [];
        let counter = 0;
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          playerArray[counter] = snapshot.val()[i];
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              playerArray[counter] = null;
              counter--;
            }
          counter++;
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers/' + userPosition).remove();
        }
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          pendingPlayers: playerArray
        });
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          acceptedPlayers: playersArray
        });
      });
    }
  }

  pendingToDeclined(matchID, userID){
    if (matchID != undefined && matchID != "0") {
      firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers').once('value', snapshot => {
        let playerArray = [];
        let counter = 0;
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          playerArray[counter] = snapshot.val()[i];
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              playerArray[counter] = null;
              counter--;
            }
          counter++;
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/pendingPlayers/' + userPosition).remove();
        }
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          pendingPlayers: playerArray
        });
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/declinedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          declinedPlayers: playersArray
        });
      });
    }
  }

  acceptedToDeclined(matchID, userID){
      firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers').once('value', snapshot => {
        let playerArray = [];
        let counter = 0;
        let userPosition;
        for (var i = 0; i < snapshot.val().length; i++) {
          playerArray[counter] = snapshot.val()[i];
          if (snapshot.val()[i] != undefined) {
            if (snapshot.val()[i] === userID) {
              userPosition = i;
              playerArray[counter] = null;
              counter--;
            }
          counter++;
          }
        }
        if (userPosition != undefined) {
          firebase.database().ref('clubs/12/matches/' + matchID + '/acceptedPlayers/' + userPosition).remove();
        }
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          acceptedPlayers: playerArray
        });
      });
      firebase.database().ref('clubs/12/matches/' + matchID + '/declinedPlayers').once('value', snapshot => {
        let playersArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
          playersArray[counter] = snapshot.val()[i];
          counter++;
        }
        playersArray.push(userID);
        firebase.database().ref('clubs/12/matches/' + matchID).update({
          declinedPlayers: playersArray
        });
      });
  }
}

