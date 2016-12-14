/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {InvitesMatchdayComponent} from "../invites/invitesmatchday.component";

@Component({
  selector: 'page-invites',
  templateUrl: 'invites.component.html'
})
export class InvitesComponent {

  constructor(public navCtrl: NavController) {

  }

 goToPage(){
    this.navCtrl.push(InvitesMatchdayComponent);
  }

}
