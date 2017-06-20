import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { GameDetailsComponent } from "../gameDetails/gameDetails.component";
import { MyGamesProvider } from '../../providers/myGames-provider';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-myGames',
  templateUrl: 'myGames.component.html',
  providers: [MyGamesProvider]
})

export class MyGamesComponent implements OnInit {

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.loadData(true, null);
  }


  gameStatus: string = "offene";
  loggedInUserID: string = this.Utilities.user.uid;
  dataGames: any;
  dataInvites: any;
  dataPlayer: any;
  counterPast: any;
  counterFuture: any;
  counterOpen: any;
  helpCounter: any;
  testRadioOpen: boolean;
  testRadioResult;
  declined: boolean;
  accepted: boolean;
  pending: boolean;
  loading: any;
  today: String = new Date().toISOString();

  constructor(public myGamesProvider: MyGamesProvider, public navCtrl: NavController, public alertCtrl: AlertController, private navP: NavParams, private Utilities: Utilities, private loadingCtrl: LoadingController) {

  }

  loadData(showLoading: boolean, event): void {
    if (showLoading) {
      this.createAndShowLoading();
    }
    this.counterPast = 0;
    this.counterFuture = 0;
    this.counterOpen = 0;
    this.myGamesProvider.setGames().then((data) => {
      this.dataGames = this.myGamesProvider.dataGames;
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
    this.myGamesProvider.setInvites().then((data) => {
      this.dataInvites = this.myGamesProvider.dataInvites;
      this.count();
    }).catch(function (error) {
      if (showLoading) {
        this.createAndShowErrorAlert(error);
      }
    });
    this.myGamesProvider.setPlayers().then((data) => {
      this.dataPlayer = this.myGamesProvider.dataPlayer;
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

  showLoadingElement() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten'
    })
    this.loading.present();
  }

  count(){
    for (let j in this.dataInvites){
      if(this.dataInvites[j].recipient == this.loggedInUserID){
        if(this.dataInvites[j].state == 0){
          this.counterOpen++;
        }
        if(this.dataInvites[j].state == 1){
          for (let i in this.dataGames){
            if (this.dataGames[i].id == this.dataInvites[j].match){
              if(this.dataGames[i].time < this.today && this.dataGames[i].time != '0'){
                this.counterPast++;
              } else {
                this.counterFuture++;
              }
            }
          }

        }
      }
    }
  }

   getFirstFourPicUrls(match) {
    let urlArray = [];
    let counter = 0;
    for (let i of this.dataInvites) {
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

  openDetails(ev, value, option, inviteItem) {
    this.navCtrl.push(GameDetailsComponent, { gameItem: value, option: option, inviteItem: inviteItem });
  }

  verifyAccept(event, inviteItem){
    event.stopPropagation();
    this.counterOpen--;
    for (let i in this.dataGames){
      if (this.dataGames[i].id == inviteItem.match){
        if(this.dataGames[i].time < this.today && this.dataGames[i].time != '0'){
          this.counterPast++;
        } else {
          this.counterFuture++;
        }
      }
    }
    firebase.database().ref('clubs/12/invites/' + inviteItem.id).update({
      state: 1
    }).then(() => {
      this.Utilities.countOpen();
    });;
    if (inviteItem.assist == true){
      for (let i in this.dataPlayer){
        if (this.dataPlayer[i].id == this.loggedInUserID){
          this.helpCounter = this.dataPlayer[i].helpCounter;
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

  doRadio(event, inviteItem, value) {
    event.stopPropagation();
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
          inviteItem.state = 2;
          if (value == 0){
            this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
          } else {
            this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
            if (inviteItem.assist == true){
              for (let i in this.dataPlayer){
                if (this.dataPlayer[i].id == this.loggedInUserID){
                  this.helpCounter = this.dataPlayer[i].helpCounter;
                  this.helpCounter--;
                  firebase.database().ref('clubs/12/players/' + this.loggedInUserID).update({
                    helpCounter: this.helpCounter
                  });
                }
              }
            }
          }
          this.counterOpen--;
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
                  }
                },
                {
                  text: 'Absenden',
                  handler: data => {
                    inviteItem.state = 2;
                    if (value == 0){
                      this.pendingToDeclined(inviteItem.match, this.loggedInUserID);
                    } else {
                      this.acceptedToDeclined(inviteItem.match, this.loggedInUserID);
                    if (inviteItem.assist == true){
                      for (let i in this.dataPlayer){
                        if (this.dataPlayer[i].id == this.loggedInUserID){
                          this.helpCounter = this.dataPlayer[i].helpCounter;
                          this.helpCounter--;
                          firebase.database().ref('clubs/12/players/' + this.loggedInUserID).update({
                            helpCounter: this.helpCounter
                          });
                        }
                      }
                    }
                    }
                    this.counterOpen--;
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

   doRefresh(refresher) {
      this.loadData(false, refresher);
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
