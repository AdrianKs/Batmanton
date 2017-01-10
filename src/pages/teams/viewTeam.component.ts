/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover.component';
import { EditTeamComponent } from './editTeam.component';
import { Utilities } from '../../app/utilities';
import { EditPlayerComponent } from './editPlayers.component';
import firebase from 'firebase';







@Component({
    templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent {

    team: any;
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    playerModel: any;
    justPlayers: any;
    justPlayersPlaceholder: any;
    database: any;
    editMode: boolean = false;
    isChanged: boolean = false;

    constructor(public navCtrl: NavController, private navP: NavParams, public popoverCtrl: PopoverController) {
        this.justPlayers = [];
        this.database = firebase.database();
        this.team = navP.get("team");
        console.log("TEAM IN VIEWTEAM VIEW");
        console.log(this.team);
        this.justPlayersPlaceholder = this.team.players;
        this.checkIfUndefined();

    }

    getPlayersOfTeam() {
        this.database.ref("/clubs/12/teams/" + this.team.id + "/players/").once('value', snapshot => {
            this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();
        })
    }

    checkIfUndefined() {
        for (let i in this.justPlayersPlaceholder) {
            let player = this.justPlayersPlaceholder[i];
            if (player != undefined) {
                this.justPlayers.push(player);
            }
        }
        console.log("JUST PLAYERS ARRAY:");
        console.log(this.justPlayers);
        this.playerModel = this.justPlayers;
    }

    editTeam() {
        this.editMode = true;
    }

    editPlayers(){
        this.navCtrl.push(EditPlayerComponent, {
            param: this.justPlayers,
            teamId: this.team.id
        })
    }

    toggleEditMode() {
        this.editMode = false;
    }

    popToRoot(){
        this.navCtrl.popToRoot();
    }

    removePlayer(p: any) {

        this.database.ref('clubs/12/teams/' + this.team.id + '/players/' + p.id).remove();
        this.getPlayersOfTeam();
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






