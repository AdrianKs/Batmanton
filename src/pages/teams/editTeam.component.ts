import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { EditPlayerComponent } from './editPlayers.component';

import firebase from 'firebase';


@Component({
    templateUrl: 'editTeam.component.html'
})
export class EditTeamComponent implements OnInit{

    team: any;
    justPlayersPlaceholder: any[];
    justPlayers: any;
    geschlecht: string = "maenner";
    database: any;

    ngOnInit(): void {
    this.database = firebase.database();
    }

    constructor(public nav: NavController, public nParam: NavParams){
        this.justPlayers = []; 
        this.team = nParam.get("value");
        console.log(this.team);
        //ERROR HANDLING EINFÜGEN
        this.justPlayersPlaceholder = this.team.players;
        this.checkIfUndefined();
    }   

    removePlayer(player: any){
        //REMOVE PLAYER
    }


    checkIfUndefined(){
        for(let i in this.justPlayersPlaceholder){
            let player = this.justPlayersPlaceholder[i];
            if(player!=undefined){
                this.justPlayers.push(player);
            }
        }
        console.log("JUST PLAYERS ARRAY:");
        console.log(this.justPlayers);
    }

    editPlayers(){
        this.nav.push(EditPlayerComponent, {
            param: this.justPlayers
        });
    }
    
}
