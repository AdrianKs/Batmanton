import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';


@Component({
    templateUrl: 'editTeam.component.html'
})
export class EditTeamComponent implements OnInit{

    team: any;
    justPlayers: any[];
    geschlecht: string = "maenner";
    database: any;

    ngOnInit(): void {
    this.database = firebase.database();
    }

    constructor(public nav: NavController, public nParam: NavParams){
        this.team = nParam.get("value");
        console.log(this.team);
        this.justPlayers = this.team.players;
    }   

    removePlayer(player: any){
        //REMOVE PLAYER
    }
    
}
