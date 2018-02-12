import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Utilities} from "../../app/utilities";

@Component({
    selector: 'page-player',
    templateUrl: 'player.component.html',
})
export class PlayerComponent {

    player: any;

    constructor(private navCtrl: NavController, private navParams: NavParams, public utilities: Utilities) {
        this.player = navParams.get('player');
    }

    goBack(){
        this.navCtrl.pop();
    }
}
