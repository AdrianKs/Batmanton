/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { CreateTeamComponent } from './createNewTeam.component';
import { TeamsProvider } from '../../providers/teams-provider';


@Component({
  templateUrl: 'teams.component.html',
  providers: [TeamsProvider]
})
export class TeamsComponent implements OnInit {

  teams: any = [];
  teamsSearch: any[];
  playerArray: any[];
  error: boolean = false;
  database: any;
  loading: any;
  allPlayers: any;
  currentUser: any;
  isAdmin: any;


  ngOnInit(): void {

  }

  ionViewWillEnter() {
    this.isTrainer();
    this.allPlayers = this.utilities.allPlayers;
    this.setTeams(true, null);
  }

  constructor(public navCtrl: NavController, public teamProvider: TeamsProvider, public utilities: Utilities, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {


  }

  isTrainer() {
    this.currentUser = this.utilities.userData;
    this.isAdmin = this.currentUser.isTrainer;
  }

  setTeams(showLoading: boolean, event) {
    if (showLoading) {
      this.createAndShowLoading();
    }
    this.teamProvider.setTeams().then(() => {
      this.teams = this.teamProvider.teams;
      this.teamsSearch = this.teamProvider.teams;
      if (showLoading) {
        this.loading.dismiss().catch((error) => console.log("error caught"));
      }
      if (event != null) {
        event.complete();
      }
    }).catch((error) => {
      if (showLoading) {
        this.createAndShowErrorAlert(error.message);
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

  viewTeam(ev, value) {
    this.navCtrl.push(ViewTeamComponent, {
      teamId: value.id
    });
  }

  pushToAddNewTeam() {
    this.navCtrl.push(CreateTeamComponent);
  }

  initializeTeams() {
    this.teams = this.teamsSearch;
  }

  getItems(ev) {
    this.initializeTeams();

    let val = ev;
    if (val && val.trim() != '') {
      this.teams = this.teams.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getFirstFourPicUrls(team) {
    let teamId = team.id;
    let urlArray = [];
    let counter = 0;
    for (let i in this.allPlayers) {
      let player = this.allPlayers[i];
      if (counter < 4) {
        if (teamId == player.team) {
          urlArray[counter] = player.picUrl;
          counter++;
        }
      }
    }
    return urlArray;
  }

  doRefresh(ev) {
    this.allPlayers = this.utilities.allPlayers;
    this.setTeams(false, ev);
  }

  presentConfirm(teamId) {
    let alert = this.alertCtrl.create({
      title: 'Mannschaft löschen',
      message: 'Wollen Sie die Mannschaft wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: () => {
            this.deleteTeam(teamId);
          }
        }
      ]
    });
    alert.present();
  }

  deleteTeam(teamId) {
    firebase.database().ref('clubs/12/teams/' + teamId).remove();
    this.deleteTeamFromPlayers(teamId);
  }
  deleteTeamFromPlayers(teamId) {
    let originalPlayers;
    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      originalPlayers = snapshot.val();
    }).then(() => {
      let player;
      for (let i in originalPlayers) {
        player = originalPlayers[i];
        if (player.team == teamId) {
          player.team = '0';
        }
      }
      firebase.database().ref('clubs/12/').update({
        players: originalPlayers
      }).then((data) => {
        this.deleteTeamFromMatches(teamId);
      });
    });
  }

  deleteTeamFromMatches(teamId) {
    let originalMatches;
    firebase.database().ref('clubs/12/matches').once('value', snapshot => {
      originalMatches = snapshot.val();
    }).then((data) => {
      let match;
      for (let i in originalMatches) {
        match = originalMatches[i];
        if (match.team == teamId) {
          match.team = '0';
        }
      }
      firebase.database().ref('clubs/12/').update({
        matches: originalMatches
      }).then(data => {
        this.doRefresh(event);
      })
    })
  }
}
