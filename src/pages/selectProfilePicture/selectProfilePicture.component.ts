/**
 * Created by kochsiek on 15.12.2016.
 */
import { Component } from '@angular/core';
import {Camera} from 'ionic-native';

import { NavController } from 'ionic-angular';
import {MatchdayComponent} from "../matchday/matchday.component";

@Component({
  selector: 'page-selectProfilePicture',
  templateUrl: 'selectProfilePicture.component.html'
})
export class SelectProfilePictureComponent {

  public base64Image: string;

  constructor(public navCtrl: NavController) {

  }

  callCamera(options) {
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
      }, (err) => {
        console.log(err);
      });
  }

  getPicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }

  takePicture() {
    let options = {
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500
    };

    this.callCamera(options);
  }


  uploadPicture() {
    this.navCtrl.setRoot(MatchdayComponent);
  }

  goToStartPage(){
    this.navCtrl.setRoot(MatchdayComponent);
  }
}
