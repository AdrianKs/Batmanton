/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.component.html'
})
export class AboutComponent {

  constructor(public navCtrl: NavController) {

  }

  sendPush() {
    window["plugins"].OneSignal.getIds(function(ids) {
      var notificationObj = { contents: {en: "message body"},
        include_player_ids: [ids.userId]};
      window["plugins"].OneSignal.postNotification(notificationObj,
        function(successResponse) {
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse) {
          console.log("Notification Post Failed: ", failedResponse);
          alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        }
      );
    });
  }

}
