import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EditRoleComponent } from '../editRole/editRole.component';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { document } from "@angular/platform-browser/src/facade/browser";


@Component({
  selector: 'page-userManagement',
  templateUrl: 'userManagement.component.html',
  providers: []
})
export class UserManagementComponent implements OnInit {

  loading: any;

  ngOnInit() {
  }

  /*ionViewDidEnter() {
    this.createAndPresentLoading();
    this.dataPlayer = this.utilities.allPlayers;
    this.dataPlayerSearch = this.dataPlayer;
    this.loading.dismiss().catch((error) => console.log("error caught"));
  }*/

  ionViewWillEnter() {
    this.createAndPresentLoading();
    this.utilities.setPlayers().then(() => {
      this.dataPlayer = this.utilities.allPlayers;
      this.dataPlayerSearch = this.dataPlayer;
      this.loading.dismiss().catch((error) => console.log("error caught"));
    });
  }

  geschlecht: string = "maenner";
  dataPlayer: any[];
  dataPlayerSearch: any;
  selectedPlayer: any;

  constructor(private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    public utilities: Utilities) {
  }

  createAndPresentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Lade Daten...'
    })
    this.loading.present();
  }

  initializeItems() {
    this.dataPlayer = this.dataPlayerSearch;
  }

  openEditor(ev, value) {
    this.selectedPlayer = value;
    this.navCtrl.push(EditRoleComponent, { player: value });
  }

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

  doRefresh(ref) {
    this.utilities.setPlayers();
    this.dataPlayer = this.utilities.allPlayers;
    this.dataPlayerSearch = this.dataPlayer;
    setTimeout(() => {
      ref.complete();
    }, 1000);
  }

}





