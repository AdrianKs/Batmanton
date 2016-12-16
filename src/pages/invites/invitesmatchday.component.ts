/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

//import {ViewMatchdayComponent} from "../matchday/viewmatchday.component";

@Component({
  selector: 'page-invitesmatchday',
  templateUrl: 'invitesmatchday.component.html'
})
export class InvitesMatchdayComponent {

  constructor(public navCtrl: NavController) {

  }


 goToPage(){
    //this.navCtrl.push(ViewMatchdayComponent);
  }

}
