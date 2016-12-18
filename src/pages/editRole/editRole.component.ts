import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@Component({
    selector: 'edit-role',
    templateUrl: 'editRole.component.html'
})
export class EditRoleComponent {

    player: any;

    constructor(private navCtrl: NavController, private navParams: NavParams) {
        this.player = navParams.get('player');
    }

    changeRole(ev, player) {
        console.log(player);
       firebase.database().ref('clubs/12/players/' + player.id).set({
            birthday: player.birthday,
            email: player.email,
            firstname: player.firstname,
            gender: player.gender,
            isTrainer: player.isTrainer,
            isPlayer: player.isPlayer,
            lastname: player.lastname,
            pushid: player.pushid,
            state: player.state,
            team: player.team
        });
       //TODO navigation back to list
       //maybe alert for success or error
    }


}