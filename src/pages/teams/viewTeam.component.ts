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

  constructor(public navCtrl: NavController, private navP: NavParams) {
      this.team = navP.get("team");
  }

}
