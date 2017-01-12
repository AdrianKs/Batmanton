/**
 * Created by kochsiek on 15.12.2016.
 */
import { Component } from '@angular/core';
import { Camera } from 'ionic-native';

import { NavController, MenuController } from 'ionic-angular';
import { MatchdayComponent } from "../matchday/matchday.component";
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
  selector: 'page-selectProfilePicture',
  templateUrl: 'selectProfilePicture.component.html'
})
export class SelectProfilePictureComponent {

  public base64Image: string;
  public base64String: string;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public utilities: Utilities) {

  }

  callCamera(options) {
    Camera.getPicture(options)
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64String = imageData;
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
    firebase.storage().ref().child('profilePictures/' + this.utilities.user.uid + "/" + this.utilities.user.uid + ".jpg").putString(this.base64String, 'base64', { contentType: 'image/JPEG' })
      .then(callback => {
        console.log("Image upload success");
        this.storeUrl(callback.downloadURL);
        this.goToStartPage();
      })
      .catch(function (error) {
        alert(error.message);
        console.log(error);
      });
  }

  goToStartPage() {
    this.navCtrl.setRoot(MatchdayComponent);
    this.menuCtrl.enable(true, 'mainMenu');
  }

  storeUrl(url: string) {
    firebase.database().ref('clubs/12/players/' + this.utilities.user.uid).update({
        picUrl: url
    });
  }

}
