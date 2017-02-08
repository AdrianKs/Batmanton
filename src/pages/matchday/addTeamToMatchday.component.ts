//todo
//teams nicht aktuell
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';
import { PlayerComponent } from '../gameDetails/player.component';
import * as _ from 'lodash';

@Component({
  selector: 'page-addTeamToMatchday',
  templateUrl: 'addTeamToMatchday.component.html',
})

export class AddTeamToMatchdayComponent implements OnInit{
  geschlecht: string = 'maenner';
  match: any;
  loading: any;
  invite: any;
  teamSelection: any;
  teamPosition: number;
  counter: number = 0;
  matchesCounter: number;
  statusArray: any;
  counterArray: any;
  acceptedArray: any;
  pendingArray: any;
  declinedArray: any;
  deletedArray: any;
  acceptedCounter: any;
  acceptedMaleCounter: any;
  acceptedFemaleCounter: any;
  pendingCounter: any;
  declinedCounter: any;
  allTeams: any;
  relevantTeams: any;
  allPlayers: any;
  buttonDisabled: Array<boolean>;
  editMode: any;

  ngOnInit(){
    
  }

  ionViewWillEnter() {
    this.acceptedArray = this.statusArray.acceptedArray;
    this.pendingArray = this.statusArray.pendingArray;
    this.declinedArray = this.statusArray.declinedArray;
    this.deletedArray = this.statusArray.deletedArray;
    this.acceptedCounter = this.counterArray.acceptedCounter;
    this.acceptedMaleCounter = this.counterArray.acceptedMaleCounter;
    this.acceptedFemaleCounter = this.counterArray.acceptedFemaleCounter;
    this.pendingCounter = this.counterArray.pendingCounter;
    this.declinedCounter = this.counterArray.declinedCounter;
    console.log(this.pendingArray);
    if (this.editMode != true){
      this.loadData(true, null);
    }
    this.teamSelection = this.match.team;
    let counter = 0;
    for (let i in this.allTeams) {
        if (this.match.team == this.allTeams[i].id){
          this.teamPosition = counter;
          break;
        }
        counter ++;
      }
    if (this.match.team == 0){
      this.relevantTeams = this.getRelevantTeams(0, 1);
    } else {
      this.relevantTeams = this.getRelevantTeams(this.allTeams[this.teamPosition].ageLimit, this.allTeams[this.teamPosition].sclass);
    }  
  }

  constructor(private navCtrl: NavController, private navP: NavParams, private Utilities: Utilities, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.match = navP.get('matchItem');
    this.allPlayers = navP.get('playerArray');
    this.statusArray = navP.get('statusArray');
    this.counterArray = navP.get('counterArray');
    this.editMode = navP.get('editMode');
    this.allTeams = navP.get('relevantTeamsItem');
  }

  loadData(showLoading: boolean, event) {
    if (showLoading) {
      this.createAndShowLoading();
    }
    firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        playerArray[counter].accepted = false;
        playerArray[counter].pending = false;
        playerArray[counter].declined = false;
        playerArray[counter].deleted = false;
        if (playerArray[counter].team == this.match.team){
          playerArray[counter].isMainTeam = true;
        } else {
          playerArray[counter].isMainTeam = false;
        }
        if (this.match.acceptedPlayers){
          for (let i in this.acceptedArray){
            if (this.match.acceptedPlayers[i] == playerArray[counter].id){
              playerArray[counter].accepted = true;
            }
          }
        }
        if (this.match.pendingPlayers){
          for (let i in this.pendingArray){
            if (this.match.pendingPlayers[i] == playerArray[counter].id){
              playerArray[counter].pending = true;
            }
          }
        }
        if (this.match.declinedPlayers){
          for (let i in this.declinedArray){
            if (this.match.declinedPlayers[i] == playerArray[counter].id){
              playerArray[counter].declined = true;
            }
          }
        }
        counter++;
      }
      this.allPlayers = playerArray;
      this.allPlayers = _.sortBy(this.allPlayers, "lastname");
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

  getRelevantTeams(ageLimit, sclass) {
    let relevantTeams: Array<any> = [];
    this.allTeams.forEach(function (team) {
      if (team.ageLimit <= ageLimit && team.ageLimit != 0 && team.sclass >= sclass || ageLimit == 0 && team.sclass >= sclass) {
        relevantTeams.push(team);
      }
    });
    return relevantTeams;
  }

  addPlayer(player){
    let counter = 0;
    console.log(this.allPlayers);
    if (player.isDefault == true){
      for (let i in this.acceptedArray) {
        counter++;
      }
      this.acceptedArray[counter]= player.id;
      for (let j in this.allPlayers){
        if (player.id==this.allPlayers[j].id && this.allPlayers[j].gender == "m"){
          this.acceptedMaleCounter++;
          break;
        }
        if (player.id==this.allPlayers[j].id && this.allPlayers[j].gender == "f"){
          this.acceptedFemaleCounter++;
          break;
        }
      }
      this.acceptedCounter++;
      player.accepted = true;
      player.deleted = false;
      if (player.isMainTeam == false){
        for (let i in this.allPlayers){
          if (this.allPlayers[i].id == player.id){
            this.allPlayers[i].helpCounter++;
          }
        }
        console.log(this.allPlayers)
      }
      if (player.helpCounter == 3){
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Dieser Spieler hat schon bereits bei 2 Spielen ausgeholfen.',
          buttons: ['OK']
        });
        alert.present();
      }
      console.log('accepted:');
      console.log(this.acceptedArray);
      console.log(this.acceptedCounter);
    } else {
      console.log('pls');
      for (let i in this.pendingArray) {
        counter++;
      }
      console.log('have');
      this.pendingArray[counter]= player.id;
      this.pendingCounter++;
      console.log('mercy');
      player.pending = true;
      player.deleted = false;
      if (player.isMainTeam == false){
        if (player.helpCounter == 2){
          let alert = this.alertCtrl.create({
            title: 'Achtung!',
            message: 'Dieser Spieler hat schon bereits bei 2 Spielen ausgeholfen.',
            buttons: ['OK']
          });
          alert.present();
        }
      }
      console.log('pending:');
      console.log(this.pendingArray);
      console.log(this.pendingCounter);
    }
    for (let i in this.deletedArray){
      if (this.deletedArray[i] == player.id){
        this.deletedArray[i] = null;
      }
    }
  }

  removePlayer(player){
    let counter = 0;
    if(player.pending == true){
      for (let i in this.pendingArray) {
        if (this.pendingArray[i] == player.id){
          this.pendingArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter ++;
        this.pendingCounter--;
      }
      player.pending = false;
      console.log('pending: ');
      console.log(this.pendingArray);
    }
    counter = 0;
    if(player.accepted == true){
      for (let i in this.acceptedArray) {
        if (this.acceptedArray[i] == player.id){
          this.acceptedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter ++;
        for (let j in this.allPlayers){
          if (player.id==this.allPlayers[j].id && this.allPlayers[j].gender == "m"){
            this.acceptedMaleCounter--;
            break;
          }
          if (player.id==this.allPlayers[j].id && this.allPlayers[j].gender == "f"){
            this.acceptedFemaleCounter--;
            break;
          }
        }
        this.acceptedCounter--;
      }
      if (player.isMainTeam == false){
        for (let i in this.allPlayers){
          if(player.id == this.allPlayers[i].id){
            this.allPlayers[i].helpCounter--;
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
        }
        counter ++;
        this.declinedCounter--;
      }
      player.declined = false;
      console.log('declined: ');
      console.log(this.declinedArray);
    }
    player.deleted = true;
  }

  makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

  confirmPlayer(){
    firebase.database().ref('clubs/12/matches/' + this.match.id + '/').update({
      pendingPlayers: this.pendingArray,
      acceptedPlayers: this.acceptedArray,
      declinedPlayers: this.declinedArray
    });

    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      console.log(this.allPlayers);
      for (let i in snapshot.val()){
        for (let j in this.allPlayers){
          if (this.allPlayers[j].id == i){
            console.log(this.allPlayers[j].helpCounter);
            firebase.database().ref('clubs/12/players/' + i ).update({
              helpCounter: this.allPlayers[j].helpCounter
            });
          }
        }
      }
    });

    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let i in snapshot.val()) {
        for (let j in this.deletedArray){
          if (snapshot.val()[i].match == this.match.id && snapshot.val()[i].recipient == this.deletedArray[j]){
            console.log("gefunden");
            console.log(i);
            firebase.database().ref('clubs/12/invites/' + i).remove();
          }
        }
      }      
    });
  
    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let k in this.pendingArray){
        for (let j in this.allPlayers){
          if (this.allPlayers[j].id == this.pendingArray[k] && this.allPlayers[j].isDefault == false){
            let inviteExists = false;
            for (let i in snapshot.val()) {
              if (snapshot.val()[i].match == this.match.id && snapshot.val()[i].recipient == this.pendingArray[k]){
                console.log("inviteExists now true");
                if (this.allPlayers[j].isMainTeam == false){
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
                match: this.match.id.toString(),
                recipient: this.pendingArray[k],
                sender: this.Utilities.user.uid,
                state: 0
              });
              if (this.allPlayers[j].isMainTeam == false){
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
    
    this.navCtrl.popToRoot();
  }

  goBack(){
    if (this.editMode != true){
      this.navCtrl.popToRoot();
    } else {
      console.log(this.allPlayers);
      this.navCtrl.pop();
    }
  }

  openProfile(item){
    this.navCtrl.push(PlayerComponent, { player: item});
  }
}

