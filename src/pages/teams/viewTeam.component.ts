/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover.component';



@Component({
  templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent {

    team: any;
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    justPlayers = [];

  constructor(public navCtrl: NavController, private navP: NavParams, public popoverCtrl: PopoverController ) {
      this.team = navP.get("team");
      this.playersOfTeam = this.team.players;
      for ( var key in this.playersOfTeam){
          if(this.playersOfTeam.hasOwnProperty(key)){
              this.justPlayers.push(this.playersOfTeam[key]);
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
