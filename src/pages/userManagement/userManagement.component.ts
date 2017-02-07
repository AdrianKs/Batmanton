import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { EditRoleComponent } from '../editRole/editRole.component';
import { CreatePlayerComponent } from './createPlayer.component';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { document } from "@angular/platform-browser/src/facade/browser";


@Component({
  selector: 'page-userManagement',
  templateUrl: 'userManagement.component.html',
  providers: []
})
export class UserManagementComponent implements OnInit {

  geschlecht: string = "maenner";
  dataPlayer: any[];
  dataPlayerSearch: any;
  selectedPlayer: any;
  loading: any;
  countWoman: any = 0;
  countMan: any = 0;
  countIos: any = 0;
  countAndroid: any = 0;
  countWeb: any = 0;
  countSonst: any = 0;

  /**
   * Constructor to initialize Items
   */
  constructor(private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    public utilities: Utilities) {
  }

  ngOnInit() {
  }

  /**
   * Functions loads player from Database
   */
  ionViewWillEnter() {
    this.createAndPresentLoading();
    this.utilities.setPlayers().then(() => {
      this.dataPlayer = this.utilities.allPlayers;
      this.dataPlayerSearch = this.dataPlayer;
      this.checkPlayers();
      this.checkPlatform();
      // this.loading.dismiss().catch((error) => console.log("error caught"));
      this.loading.dismiss();
    });
  }

  /**
   * Navigates to CreatePlayerComponent
   */
  createPlayer() {
    this.navCtrl.push(CreatePlayerComponent);
  }

  /**
   * Counts amount of woman and man in player list
   */
  checkPlayers() {
    this.countMan = 0;
    this.countWoman = 0;
    for (let i = 0; i <= this.dataPlayer.length - 1; i++) {
      if (this.dataPlayer[i].gender == 'm') {
        this.countMan++;
      } else if (this.dataPlayer[i].gender == 'f') {
        this.countWoman++;
      }
    }
  }

  /**
   * Counts different types of used platforms by the user
   */
  checkPlatform() {
    this.countIos = 0;
    this.countAndroid = 0;
    for (let i = 0; i <= this.dataPlayer.length - 1; i++) {
      if (this.dataPlayer[i].platform == 'ios') {
        this.countIos++;
      } else if (this.dataPlayer[i].platform == 'android') {
        this.countAndroid++;
      } else if (this.dataPlayer[i].platform == 'web') {
        this.countWeb++;
      } else if (this.dataPlayer[i].platform == 'sonstige') {
        this.countSonst++;
      }
    }
  }

  /**
   * Show Loading-Spinner in View
   */
  createAndPresentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten...'
    })
    this.loading.present();
  }

  /**
   * Initialize items to support search function
   */
  initializeItems() {
    this.dataPlayer = this.dataPlayerSearch;
  }

  /**
   * Navigates to EditRoleComponent if a player has been selectedPlayer
   * @param ev event-handler
   * @param player value 
   */
  openEditor(ev, value) {
    this.selectedPlayer = value;
    this.navCtrl.push(EditRoleComponent, { player: value });
  }

  /**
   * Opens message box to display amount of user and their used platforms
   */
  openInfo() {
    let alert = this.alertCtrl.create({
      title: 'Übersicht User',
      subTitle: "Anzahl der User: " + this.dataPlayer.length + "<br><br>iOS: " + this.countIos + "<br>Android: " + this.countAndroid + "<br>Web: " + this.countWeb + "<br>Sonstige: " + this.countSonst,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * implemts the search functionality into the view
   * @param ev event-handler
   */
  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.dataPlayer = this.dataPlayer.filter((item) => {
        return ((item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

  /**
   * implements the manual refresh action
   * @param ref reference for the refresh action
   */
  doRefresh(ref) {
    this.utilities.setPlayers();
    this.dataPlayer = this.utilities.allPlayers;
    this.dataPlayerSearch = this.dataPlayer;
    setTimeout(() => {
      ref.complete();
    }, 1000);
  }

}





