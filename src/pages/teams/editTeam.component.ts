import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { EditPlayerComponent } from './editPlayers.component';

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
        //ERROR HANDLING EINFÜGEN
        this.justPlayers = this.team.players;
    }   

    removePlayer(player: any){
        //REMOVE PLAYER
    }

    editPlayers(){
        this.nav.push(EditPlayerComponent, {
            param: this.justPlayers
        });
    }
    
}
