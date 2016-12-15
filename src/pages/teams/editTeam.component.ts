import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';


@Component({
    templateUrl: 'editTeam.component.html'
})
export class EditTeamComponent{

    team: any;
    players: any[];

    constructor(public nav: NavController, public nParam: NavParams){
        this.team = nParam.get("value");
        console.log(this.team);
        this.players = this.team.players;
    }   
}