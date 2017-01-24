/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { CreateTeamComponent } from './createNewTeam.component';


@Component({
  templateUrl: 'teams.component.html'
})
export class TeamsComponent implements OnInit {

  teams: any[];
  teamsSearch: any[];
  database: any;
  playerArray: any[];
  error: boolean = false;
  loading: any;
  allPlayers: any;

  ngOnInit(): void {

  }

  ionViewWillEnter() {
    this.allPlayers = this.utilities.allPlayers;
    this.setTeams(true, null);
  }

  constructor(public navCtrl: NavController, public utilities: Utilities, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {


  }

  setTeams(showLoading: boolean, event) {
    if (showLoading) {
      this.createAndShowLoading();
    }
    firebase.database().ref('clubs/12/teams').once('value', snapshot => {
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.teams = teamArray;
      this.teamsSearch = teamArray;
      //this.teamsLoaded = true;
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

    let val = ev.target.value;
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
}