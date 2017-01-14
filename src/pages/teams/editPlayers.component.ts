import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { ViewTeamComponent } from './viewTeam.component';
import firebase from 'firebase';


@Component({
    templateUrl: 'editPlayers.component.html'
})
export class EditPlayerComponent implements OnInit {

    team: string = "";
    teamId: string = "";
    spielerStatus: string = "chosen";
    allPlayers: any[];
    allPlayersMod: any;
    allPlayersModSearch: any[];
    allPlayersSearch: any[];
    geschlecht: string = "maenner";
    database: any;
    teams: any[];
    playersOfTeamPlaceholder: any;
    playersOfTeam: any;
    playersOfTeamSearch: any;
    ageLimit: any = "";
    playerAdded: boolean = false;

    ngOnInit(): void {
        //this.playersOfTeam = [];
        this.allPlayers = [];
        this.allPlayers = this.utilities.allPlayers;
        this.allPlayersSearch = this.utilities.allPlayers;
        this.addSwitchToPlayers();
        this.teams = this.utilities.allTeams;
        let counter = 0;
        let playerFound = false;
    }

    constructor(
        public nav: NavController,
        public nParam: NavParams,
        public utilities: Utilities,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ) {
        this.database = firebase.database();
        this.playersOfTeam = [];
        //NULL ABFRAGEN EINBAUEN
        this.playersOfTeamPlaceholder = nParam.get("param");
        this.teamId = nParam.get("teamId");
        this.ageLimit = nParam.get("maxAge");
        //this.getPlayers();
        //this.getTeams();
        this.checkIfUndefined();
    }

    backToEditMode(){
        this.nav.pop();
    }

    addSwitchToPlayers(){
        let player;
        let playerOfTeam;
        let teamsOfPlayer;
        for (let i in this.allPlayers){
            player = this.allPlayers[i];
            teamsOfPlayer = player.teams;
            player.isAdded = false;
            if(teamsOfPlayer!=undefined){
            for(let y in teamsOfPlayer){
                if(this.teamId==teamsOfPlayer[y]){
                    player.isAdded = true;
                }
            }
            }
        }
        console.log(this.allPlayers);
    }

    initializePlayers() {
        this.allPlayers = this.allPlayersSearch;
        this.playersOfTeam = this.playersOfTeamSearch;
    }

    checkLists(id: any, player: any) {

        let placeHolderArray = this.playersOfTeam;
        let uniqueId = 0;
        this.playersOfTeam = [];
        let playerFound = false;
        for (let i in placeHolderArray) {
            uniqueId = placeHolderArray[i].uniqueId;
            /* console.log("")
             console.log("ID: " + id + " und uniqueId: " + uniqueId);*/
            if (uniqueId == id) {
                playerFound = true;
            }
        }
        if (!playerFound) {
            return false;
            /*this.allPlayers.push(player);
            this.allPlayersSearch.push(player);*/
        } else {
            return true;
        }
    }


    

   

    getPlayers() {
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            let playerArray = [];
            let completePlayerArray = snapshot.val();
            //console.log("Cmplete Player Array");
            //console.log(completePlayerArray);
            let uniqueId = 0;
            let counter = 0;
            for (let i in completePlayerArray) {
                //console.log(i);
                playerArray[counter] = snapshot.val()[i];
                playerArray[counter].uniqueId = i;
                counter++;
            }
            this.allPlayers = playerArray;
            this.allPlayersSearch = playerArray;
            console.log(this.allPlayers);
        });
    }

    getPlayerArray() {
        return this.allPlayers;
    }

    teamSelectChanged(team: any) {
        //let val = ev.target.value;
        console.log("VALUE: " + team);
        let playersLocal = this.getPlayerArray();
        if (team && team.trim() != '') {
            playersLocal = playersLocal.filter((item1) => {
                return (item1.team.toLowerCase().indexOf(team.toLowerCase()) > -1);
            })
        }
    }

    getTeams(): void {
        firebase.database().ref('clubs/12/teams').once('value', snapshot => {
            let teamArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                teamArray[counter] = snapshot.val()[i];
                teamArray[counter].id = i;
                counter++;
            }
            this.teams = teamArray;
        })
    }


    getItemsTeamName(ev: any) {
        this.initializePlayers();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item1) => {
                return (item1.team.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    getItemsLastName(ev: any) {
        this.initializePlayers();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    addPlayer(p: any) {
        p.isAdded = true;
        this.utilities.addPlayerToTeam(this.teamId, p.id);
        this.presentToast("Spieler zum Team hinzugefügt");
    }

    getPlayersOfTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/players/").once('value', snapshot => {
            this.playersOfTeamPlaceholder = snapshot.val();
            this.checkIfUndefined();
        })
    }

    presentToast(customMessage: string) {
        let toast = this.toastCtrl.create({
            message: customMessage,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }

    checkIfUndefined() {
        for (let i in this.playersOfTeamPlaceholder) {
            let player = this.playersOfTeamPlaceholder[i];
            if (player != undefined && player != null) {
                this.playersOfTeam.push(player);
            }
        }
        this.playersOfTeamSearch = this.playersOfTeam;
    }

    getItemsAvailable(ev) {
        // Reset items back to all of the items
        this.initializePlayers();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    getItemsChosen(ev) {
        // Reset items back to all of the items
        this.initializePlayers();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.playersOfTeam = this.playersOfTeam.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }


}