/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent {

    team: any;
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    justPlayers = [];

  constructor(public navCtrl: NavController, private navP: NavParams) {
      this.team = navP.get("team");
      this.playersOfTeam = this.team.spieler;
      for ( var key in this.playersOfTeam){
          if(this.playersOfTeam.hasOwnProperty(key)){
              this.justPlayers.push(this.playersOfTeam[key]);
          }
      }
  }



}
