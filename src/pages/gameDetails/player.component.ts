import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-player',
    templateUrl: 'player.component.html'
})
export class PlayerComponent {

    player: any;

    constructor(private navCtrl: NavController, private navParams: NavParams) {
        this.player = navParams.get('player');
    }

    goBack(){
        this.navCtrl.pop();
    }
}
