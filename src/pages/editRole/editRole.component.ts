import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'edit-role',
    templateUrl: 'editRole.component.html'
})
export class EditRoleComponent {

    player: any;

    constructor(private navCtrl: NavController, private navParams: NavParams) {
        this.player = navParams.get('player');
    }

    
}