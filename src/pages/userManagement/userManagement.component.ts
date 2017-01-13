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
    this.dataPlayerSearch = this.dataPlayer;
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
        return (
          (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1)
          );
      })
    }
  }
}

//TODO List in Gruppen einteilen https://www.joshmorony.com/an-introduction-to-lists-in-ionic-2/
//     suche nach Vorname



