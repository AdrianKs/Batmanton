import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
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
            }
            this.presentToast("Rolle wurde erfolgreich bearbeitet");
            this.navigateBackToList();
        } else {
            this.presentToast("Error. Bitte versuchen Sie es erneut!");
        }

    }

    deleteUser(player) {
        firebase.database().ref('clubs/12/players/' + player.id).remove();
        this.isDeleted = true;
       // this.utilities.setPlayers();
        this.navigateBackToList();
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
