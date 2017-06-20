import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CreateMatchdayProvider } from '../../providers/createMatchday-provider';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-addTeamToMatchday',
  templateUrl: 'addTeamToMatchday.component.html',
  providers: [CreateMatchdayProvider]
})

export class AddTeamToMatchdayComponent implements OnInit {
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

  ngOnInit() {

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
    if (this.editMode != true){
      this.loadData(true, null);
    }
    this.teamSelection = this.match.team;
    let counter = 0;
    for (let i in this.allTeams) {
      if (this.match.team == this.allTeams[i].id) {
        this.teamPosition = counter;
        break;
      }
      counter++;
    }
    if (this.match.team == 0) {
      this.relevantTeams = this.getRelevantTeams(0, 1);
    } else {
      this.relevantTeams = this.getRelevantTeams(this.allTeams[this.teamPosition].ageLimit, this.allTeams[this.teamPosition].rank);
    }
  }

  constructor(private navCtrl: NavController, public createMatchdayProvider: CreateMatchdayProvider, private navP: NavParams, private Utilities: Utilities, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public toastCtrl: ToastController) {
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
    this.createMatchdayProvider.setPlayer(this.Utilities, this.match, this.acceptedArray, this.pendingArray, this.declinedArray).then((data) => {
      this.allPlayers = this.createMatchdayProvider.playerArray;
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log("error caught"));
      }
      if (event != null) {
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

  getRelevantTeams(ageLimit, rank) {
    let relevantTeams: Array<any> = [];
    this.allTeams.forEach(function (team) {
      if (team.ageLimit <= ageLimit && team.ageLimit != 0 && team.rank >= rank || ageLimit == 0 && team.rank >= rank) {
        relevantTeams.push(team);
      }
    });
    return relevantTeams;
  }

  addPlayer(player) {
    let counter = 0;
    if (player.isDefault == true){
      for (let i in this.acceptedArray) {
        counter++;
      }
      this.acceptedArray[counter] = player.id;
      for (let j in this.allPlayers) {
        if (player.id == this.allPlayers[j].id && this.allPlayers[j].gender == "m") {
          this.acceptedMaleCounter++;
          break;
        }
        if (player.id == this.allPlayers[j].id && this.allPlayers[j].gender == "f") {
          this.acceptedFemaleCounter++;
          break;
        }
      }
      this.acceptedCounter++;
      player.accepted = true;
      player.deleted = false;
      if (player.isMainTeam == false) {
        for (let i in this.allPlayers) {
          if (this.allPlayers[i].id == player.id) {
            this.allPlayers[i].helpCounter++;
          }
        }
      }
      if (player.helpCounter == 3) {
        let alert = this.alertCtrl.create({
          title: 'Achtung!',
          message: 'Dieser Spieler hat schon bereits bei 2 Spielen ausgeholfen.',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {
      for (let i in this.pendingArray) {
        counter++;
      }
      this.pendingArray[counter]= player.id;
      this.pendingCounter++;
      player.pending = true;
      player.deleted = false;
      if (player.isMainTeam == false) {
        if (player.helpCounter == 2) {
          let alert = this.alertCtrl.create({
            title: 'Achtung!',
            message: 'Dieser Spieler hat schon bereits bei 2 Spielen ausgeholfen.',
            buttons: ['OK']
          });
          alert.present();
        }
      }
    }
    for (let i in this.deletedArray) {
      if (this.deletedArray[i] == player.id) {
        this.deletedArray[i] = null;
      }
    }
    this.presentToast("Spieler hinzugefügt");
  }

  removePlayer(player) {
    let counter = 0;
    if (player.pending == true) {
      for (let i in this.pendingArray) {
        if (this.pendingArray[i] == player.id) {
          this.pendingArray.splice(counter, 1);
          this.deletedArray.push(player.id);
        }
        counter++;
        this.pendingCounter--;
      }
      player.pending = false;
    }
    counter = 0;
    if (player.accepted == true) {
      for (let i in this.acceptedArray) {
        if (this.acceptedArray[i] == player.id) {
          this.acceptedArray.splice(counter, 1);
          this.deletedArray.push(player.id);
          for (let j in this.allPlayers) {
            if (player.id == this.allPlayers[j].id && this.allPlayers[j].gender == "m") {
              this.acceptedMaleCounter--;
              break;
            }
            if (player.id == this.allPlayers[j].id && this.allPlayers[j].gender == "f") {
              this.acceptedFemaleCounter--;
              break;
            }
          }
          this.acceptedCounter--;
        }
        counter++;
      }
      if (player.isMainTeam == false) {
        for (let i in this.allPlayers) {
          if (player.id == this.allPlayers[i].id) {
            this.allPlayers[i].helpCounter--;
          }
        }
      }
      player.accepted = false;
    }
    counter = 0;
    if (player.declined == true) {
      for (let i in this.declinedArray) {
        if (this.declinedArray[i] == player.id) {
          this.declinedArray.splice(counter, 1);
        }
        counter++;
        this.declinedCounter--;
      }
      player.declined = false;
    }
    player.deleted = true;
    this.presentToast("Spieler entfernt");
  }

  presentToast(customMessage: string) {
    let toast = this.toastCtrl.create({
      message: customMessage,
      duration: 1000,
      position: "top"
    });
    toast.present();
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 26; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  confirmPlayer() {
    let pushIDs = [];
    firebase.database().ref('clubs/12/matches/' + this.match.id + '/').update({
      pendingPlayers: this.pendingArray,
      acceptedPlayers: this.acceptedArray,
      declinedPlayers: this.declinedArray
    });

    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      for (let i in snapshot.val()){
        for (let j in this.allPlayers){
          if (this.allPlayers[j].id == i){
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
            firebase.database().ref('clubs/12/invites/' + i).remove();
          }
        }
      }
    });

    firebase.database().ref('clubs/12/invites').once('value', snapshot => {
      for (let k in this.pendingArray) {
        for (let j in this.allPlayers) {
          if (this.allPlayers[j].id == this.pendingArray[k] && this.allPlayers[j].isDefault == false) {
            let inviteExists = false;
            for (let i in snapshot.val()) {
              if (snapshot.val()[i].match == this.match.id && snapshot.val()[i].recipient == this.pendingArray[k]) {
                if (snapshot.val()[i].state != 0 || (this.allPlayers[j].isMainTeam == false && snapshot.val()[i].assist == false) || (this.allPlayers[j].isMainTeam == true && snapshot.val()[i].assist == false)) {
                  //push-Benachrichtigung an snapshot.val()[i].recipient
                  //Zugriff auf Spielerobjekt
                  for (let j in this.allPlayers) {
                    if (this.allPlayers[j].id == snapshot.val()[i].recipient) {
                      for (let pushID in this.allPlayers[j].pushid) {
                        pushIDs.push(pushID);
                      }
                    }
                  }
                }

                if (this.allPlayers[j].isMainTeam == false) {
                  firebase.database().ref('clubs/12/invites/').child(i).update({
                    assist: true
                  });
                } else {
                  firebase.database().ref('clubs/12/invites/').child(i).update({
                    assist: false
                  });
                }
                firebase.database().ref('clubs/12/invites/' + i).update({
                  state: 0
                });
                inviteExists = true;
              }
            }
            if (inviteExists == false) {
              let id = this.makeid();
              firebase.database().ref('clubs/12/invites/').child(id).set({
                assist: false,
                match: this.match.id.toString(),
                recipient: this.pendingArray[k],
                sender: this.Utilities.user.uid,
                state: 0
              });
              if (this.allPlayers[j].isMainTeam == false) {
                firebase.database().ref('clubs/12/invites/').child(id).update({
                  assist: true
                });
              }
              console.log("push-benachrichtigung an: " + this.pendingArray[k]);
              //push-Benachrichtigung an this.pendingArray[k]
              //Zugriff auf Spielerobjekt
              for (let l in this.allPlayers) {
                if (this.allPlayers[l].id == this.pendingArray[k]) {
                  for (let pushID in this.allPlayers[l].pushid) {
                    pushIDs.push(pushID);
                  }
                }
              }
            }
          }
        }
      }
      console.log(pushIDs);
      if (pushIDs.length != 0 && this.editMode != true) {
        console.log("ruft pushfunction");
        console.log(this.match.id);
        let matchInformationString = "am " + this.Utilities.transformTime(this.match.time) + " in " + this.match.location.street + ", " + this.match.location.zipcode + ", gegen " + this.match.opponent
        this.Utilities.sendPushNotification(pushIDs, 'Sie haben eine Einladung zu einem Spiel ' + matchInformationString + ' erhalten');
        if (this.match.delayedNotificationID != undefined) {
          this.Utilities.cancelPushNotification(this.match.delayedNotificationID);
        }
        this.Utilities.sendGameReminderDayBefore(pushIDs, "Denken Sie an Ihr Spiel am " + matchInformationString, this.match.time, this.match.id);
      }
    });
    if (this.editMode == true) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.popToRoot();
    }
  }

}

