//todo
//Zurück button
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';

@Component({
    selector: 'page-player',
    templateUrl: 'player.component.html'
})
export class PlayerComponent {

    player: any;

    constructor(private navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController, public utilities: Utilities) {
        this.player = navParams.get('player');
    }

    goBack(){
        this.navCtrl.pop();
    }
}