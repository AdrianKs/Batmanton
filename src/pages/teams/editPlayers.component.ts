import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';


@Component({
    templateUrl: 'editPlayers.component.html'
})
export class EditPlayerComponent implements OnInit {

    team: string = "";


    teamId: string = "";


    teamId: string = "";

    spielerStatus: string = "chosen";
    allPlayers: any[];
    allPlayersMod: any[];
    allPlayersModSearch: any[];
    allPlayersSearch: any[];
    geschlecht: string = "maenner";
    database: any;
    teams: any[];
    playersOfTeamPlaceholder: any;
    playersOfTeam: any;
    playersOfTeamSearch: any;

    ngOnInit(): void {
    }

    constructor(public nav: NavController, public nParam: NavParams, public utilities: Utilities) {
        this.database = firebase.database();
        this.playersOfTeam = [];
        //NULL ABFRAGEN EINBAUEN
        this.playersOfTeamPlaceholder = nParam.get("param");
        this.teamId = nParam.get("teamId");
        this.getPlayers();
        this.getTeams();
        this.checkIfUndefined();

    }

    constructor(public nav: NavController, public nParam: NavParams) {
        this.playersOfTeam = nParam.get("param");

    }

    initializePlayers() {
        this.allPlayers = this.allPlayersSearch;
        this.playersOfTeam = this.playersOfTeamSearch;
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

    doubleCheckLists() {
        let id1 = "";
        let id2 = "";
        let player;
        let player2;
        for (let i in this.playersOfTeam) {
            for (let y in this.allPlayers) {
                console.log("Geht rein");
                player = this.playersOfTeam[i];
                id1 = player.uniqueId;
                console.log("ID1 " + id1);
                player2 = this.allPlayers[y];
                console.log("auch hier geht er rein");
                id2 = player2.uniqueId;
                if (id1 != id2) {
                    //Aktueller Spieler ist nicht ausgewählt, also hinzufügen
                    this.allPlayersMod.push(player2);
                } else {
                    //Spieler gefunden, aus Schleife raus
                }
            }
        }
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


    removePlayer(p: any) {
        this.database.ref('clubs/12/teams/' + this.teamId + '/players/' + p.id).remove();
        this.getPlayersOfTeam();
    }

    addPlayer(p: any) {
        this.utilities.addPlayerToTeam(this.teamId, p.uniqueId);
    }

    getPlayersOfTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/players/").once('value', snapshot => {
            this.playersOfTeamPlaceholder = snapshot.val();
            this.checkIfUndefined();
        })
    }

    checkIfUndefined() {
        for (let i in this.playersOfTeamPlaceholder) {
            let player = this.playersOfTeamPlaceholder[i];
            if (player != undefined && player != null) {
                this.playersOfTeam.push(player);
            }
        }
        this.playersOfTeamSearch = this.playersOfTeam;
        //this.doubleCheckLists();
        /*console.log("JUST PLAYERS ARRAY:");
        console.log(this.playersOfTeam);*/
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


    removePlayer(p: any){
        


    }



}}