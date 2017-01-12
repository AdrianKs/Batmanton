import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditRoleComponent } from '../editRole/editRole.component';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { File } from 'ionic-native';
import { document } from "@angular/platform-browser/src/facade/browser";

@Component({
  selector: 'page-userManagement',
  templateUrl: 'userManagement.component.html',
  providers: []
})
export class UserManagementComponent implements OnInit {

  ngOnInit() {
    this.dataPlayer = this.utilities.allPlayers;
    this.dataPlayerSearch = this.utilities.allPlayers;
  }

  ionViewDidEnter() {
  }

  geschlecht: string = "maenner";
  dataPlayer: any[];
  dataPlayerSearch: any;
  selectedPlayer: any;
  playerPictures: Array<any>;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    public utilities: Utilities) {
  }

  /*getPlayer(): void {
    firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        counter++;
      }
      this.dataPlayerSearch = playerArray;
      this.dataPlayer = playerArray;
    });
  }*/

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
        return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}

//TODO Liste sortieren nach Nachname
//     suche nach Vorname
//     Register Profile upload pic



