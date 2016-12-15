/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover.component';

import firebase from 'firebase';




@Component({
  templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent {

    team: any;
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    justPlayers: any;
    database: any;




   



    constructor(public navCtrl: NavController, private navP: NavParams, public popoverCtrl: PopoverController) {
        this.justPlayers = [];
        this.database = firebase.database();
        this.team = navP.get("team");
        this.playersOfTeam = this.team.players;
        for (var key in this.playersOfTeam) {
            if (this.playersOfTeam.hasOwnProperty(key)) {
                this.justPlayers.push(this.playersOfTeam[key]);
            }
        }
        this.fetchPlayersByID();
    }

    fetchPlayersByID() {
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            //Wie kann man auf die ID im Snapshot zugreifen?
            let playerArray = [];
            let counter = 0;
            for (let y in this.justPlayers) {
                for (let i in snapshot.val()) {
                    let id = this.justPlayers.id;
                    let id_snap = snapshot.val()[0];
                    console.log("SNAPSHOT KEY: " + id_snap);
                    if (id == id_snap) {
                        playerArray[counter] = snapshot.val()[i];
                        playerArray[counter].id = i;
                    }
                    counter++;
                }
            }
        })
    }



   presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, 
    {
        value: this.team
    });
    popover.present({
      ev: myEvent
    });
  }



}





