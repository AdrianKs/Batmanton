import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { MatchdayComponent } from '../matchday/matchday.component';
import firebase from 'firebase';

@Component({
    selector: 'edit-role',
    templateUrl: 'editRole.component.html'
})
export class EditRoleComponent {

    player: any;
    isTrainerOld: boolean;
    isSpielerOld: boolean;
    isChanged: boolean;
    isDeleted: boolean;
    sameUser: boolean;
    editMode: boolean = false;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public utilities: Utilities) {

        this.player = navParams.get('player');
        this.isTrainerOld = this.player.isTrainer;
        this.isSpielerOld = this.player.isPlayer;
        this.isChanged = false;
        this.isDeleted = false;
        this.sameUser = false;

        if (this.player.id === this.utilities.user.uid) {
            this.sameUser = true;
        }
    }


    ionViewDidEnter() {
    }

    changeValue(ev) {
        if (!(this.player.isPlayer == false && this.player.isTrainer == false)) {
            if (this.isSpielerOld != this.player.isPlayer || this.isTrainerOld != this.player.isTrainer) {
                this.isChanged = true;
            } else {
                this.isChanged = false;
            }
        } else {
            this.isChanged = false;
        }
    }

    /* editRole(){
         this.editMode = true;
     }*/

    changeRole(ev, player) {
        let successFlag = true;

        firebase.database().ref('clubs/12/players/' + player.id).update({
            isTrainer: player.isTrainer,
            isPlayer: player.isPlayer
        }).catch(function (error) {
            console.log(error);
            successFlag = false;
        });

        if (successFlag) {
            if (this.sameUser) {
                this.utilities.setUserData();
                this.presentToast("Rolle wurde erfolgreich bearbeitet");
                // this.navCtrl.push(MatchdayComponent);
            } else {
                this.presentToast("Rolle wurde erfolgreich bearbeitet");
                this.navigateBackToList();
            }
        } else {
            this.presentToast("Error. Bitte versuchen Sie es erneut!");
        }

    }

    deleteUser(player) {
        firebase.database().ref('clubs/12/players/' + player.id).remove();
        this.isDeleted = true;
        //this.utilities.setPlayers();
        this.deleteInvites(player.id);

        this.navigateBackToList();
    }

    deleteInvites(playerId) {
        firebase.database().ref('clubs/12/invites').once('value', snapshot => {
            for (let i in snapshot.val()) {
                if (snapshot.val()[i].recipient == playerId) {
                    this.deletePlayerFromMatches(playerId, snapshot.val()[i].match, snapshot.val()[i].state);
                    firebase.database().ref('clubs/12/invites/' + i).remove();
                }
            }
        });
    }

    deletePlayerFromMatches(playerId, matchId, inviteState) {
        firebase.database().ref('clubs/12/matches/' + matchId).once('value', snapshot => {
            //pending state
            if (inviteState == 0) {
                for (let i in snapshot.val().pendingPlayers) {
                    if (playerId == snapshot.val().pendingPlayers[i]) {
                        firebase.database().ref('clubs/12/matches/' + matchId + '/pendingPlayers/' + i).remove();
                    }
                }
                //accepted state
            } else if (inviteState == 1) {
                for (let i in snapshot.val().acceptedPlayers) {
                    if (playerId == snapshot.val().acceptedPlayers[i]) {
                       firebase.database().ref('clubs/12/matches/' + matchId + '/acceptedPlayers/' + i).remove();
                    }
                }
                //declined state
            } else if (inviteState == 2) {
                for (let i in snapshot.val().declinedPlayers) {
                    if (playerId == snapshot.val().declinedPlayers[i]) {
                        firebase.database().ref('clubs/12/matches/' + matchId + '/declinedPlayers/' + i).remove();
                    }
                }
            }
        });
    }

    navigateBackToList() {
        this.navCtrl.pop();
    }

    presentToast(customMessage: string) {
        let toast = this.toastCtrl.create({
            message: customMessage,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }

    showConfirm(ev, player) {
        let confirm = this.alertCtrl.create({
            title: 'Benutzer löschen',
            message: 'Wollen Sie den Benutzer wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: () => {
                        console.log('abbrechen clicked');
                    }
                },
                {
                    text: 'Löschen',
                    handler: () => {
                        this.deleteUser(player);
                    }
                }
            ]
        });
        confirm.present();
    }
}
