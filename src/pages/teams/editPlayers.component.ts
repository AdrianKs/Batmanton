import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';


@Component({
    templateUrl: 'editPlayers.component.html'
})
export class EditPlayerComponent implements OnInit {

    team: string = "";
    allPlayers: any[];
    allPlayersSearch: any[];
    geschlecht: string = "maenner";
    database: any;
    teams: any[];


    ngOnInit(): void {
        this.database = firebase.database();
        this.getPlayers();
        this.getTeams();
    }

    constructor(public nav: NavController, public nParam: NavParams) {
    }

    initializePlayers() {
        this.allPlayers = this.allPlayersSearch;
    }

    getPlayers(){
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            let playerArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                playerArray[counter] = snapshot.val()[i];
                counter++;
            }
            this.allPlayers = playerArray;
            this.allPlayersSearch = playerArray;
            console.log(this.allPlayers);
        });
    }

    getPlayerArray(){
        return this.allPlayers;
    }


    teamSelectChanged(team: any){
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



}