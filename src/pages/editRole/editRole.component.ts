import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';
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

    constructor(private navCtrl: NavController,
                private navParams: NavParams,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public viewCtrl: ViewController) {

        this.player = navParams.get('player');
        this.isTrainerOld = this.player.isTrainer;
        this.isSpielerOld = this.player.isPlayer;
        this.isChanged = false;
        this.isDeleted = false;
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
        }).catch(function (error) {
            console.log(error);
            successFlag = false;
        });

        if (successFlag) {
            this.presentToast("Rolle wurde erfolgreich bearbeitet");
            this.navigateBackToList();
        } else {
            this.presentToast("Error. Bitte versuchen Sie es erneut!");
        }

    }

    deleteUser(player) {
        firebase.database().ref('clubs/12/players/' + player.id).remove();
        this.isDeleted = true;
        this.navigateBackToList();
    }


    navigateBackToList() {
        this.navCtrl.popToRoot();
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

//TODO delete and update list without db connection