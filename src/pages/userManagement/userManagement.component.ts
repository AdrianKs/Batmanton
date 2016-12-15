import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditRoleComponent } from '../editRole/editRole.component';
import { UserManagementService } from '../../providers/userManagament.service';
import firebase from 'firebase';

@Component({
  selector: 'page-userManagement',
  templateUrl: 'userManagement.component.html',
  providers: [UserManagementService]
})
export class UserManagementComponent {

  geschlecht: string = "maenner";
  testDataPlayer: any[];
  dataPlayer: any;
  dataPlayerSearch: any;

  constructor(private navCtrl: NavController, private userManagementService: UserManagementService) {
    //Load data in array
    /* this.userManagementService.getPlayers()
       .subscribe(players => {
         this.dataPlayer = players;
       });*/   
    this.getPlayer();
    this.initializeItems();
  }

  getPlayer(): void {
    firebase.database().ref('clubs/12/players').once('value', snapshot => {
      let playerArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        playerArray[counter] = snapshot.val()[i];
        playerArray[counter].id = i;
        counter++;
      }
      this.dataPlayerSearch = playerArray;
       console.log(this.dataPlayerSearch);
      this.dataPlayer = playerArray;
    })
  }

  initializeItems() {
    this.dataPlayer = this.dataPlayerSearch;
  }

  openEditor(ev, value) {
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


//Firebase Login
//manuel-entenmann@web.de
//Test123

//Spielerliste mit Tabs

