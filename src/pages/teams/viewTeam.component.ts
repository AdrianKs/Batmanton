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
    //allPlayers : any;
    playersOfTeam: any[];
    justPlayers: any;
    database: any;







    constructor(public navCtrl: NavController, private navP: NavParams, public popoverCtrl: PopoverController) {
        this.justPlayers = [];
        this.database = firebase.database();
        this.team = navP.get("team");
        console.log("TEAM IN VIEWTEAM VIEW");
        console.log(this.team);
        this.justPlayers = this.team.players;
        console.log("JUST PLAYERS ARRAY:");
        console.log(this.justPlayers);
    }

    fetchAllPlayers() {

        this.justPlayers = this.team.players;
        console.log("PLAYERS IN TEAM VIEW");
        console.log(this.justPlayers);





        

        /*this.database.ref("/clubs/12/players/").once('value', snapshot => {
            let allPlayers = snapshot.val();
            this.findPlayersOfTeam(allPlayers);
            //this.allPlayers = snapshot.val();
            //Wie kann man auf die ID im Snapshot zugreifen?
            let playerArray = [];
            let counter = 0;
            for (let y in this.justPlayers) { 
            for (let i in snapshot.val()) {
                let id = this.justPlayers.id;
                let id_snap = snapshot.val()[0];
                console.log("SNAPSHOT KEY: "+ id_snap);
                if (id == id_snap) {
                    playerArray[counter] = snapshot.val()[i];
                    playerArray[counter].id = i;
                }
                counter++;
            }
        }*/
        //})

    }

    findPlayersOfTeam(allPlayerArray: any) {
        for (let j in this.playersOfTeam) {
            let playerID = this.playersOfTeam[j];
            for (let i in allPlayerArray) {

            }
        }
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






