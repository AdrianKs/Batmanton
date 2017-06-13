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
    roleChanged: boolean;
    teamChanged: boolean = false;
    isDeleted: boolean;
    sameUser: boolean;
    editMode: boolean = false;
    teamOld: string;
    relevantTeams: Array<any> = [];

    /**
     * Constructor to initialize EditRoleComponent
     * @param NavController to handle navigation
     * @param NavParams to handle Parameters from other views
     * @param ToastController to handler toasts in the view
     * @param Utilities to reach the database functionalities
     */
    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        public utilities: Utilities) {

        this.player = navParams.get('player');
        this.isTrainerOld = this.player.isTrainer;
        this.isSpielerOld = this.player.isPlayer;
        this.roleChanged = false;
        this.isDeleted = false;
        this.sameUser = false;
        this.teamOld = this.player.team;
        this.relevantTeams = this.utilities.getRelevantTeams(this.player.birthday);

        if (this.player.id === this.utilities.user.uid) {
            this.sameUser = true;
        }
    }


    ionViewDidEnter() {
    }

  /**
   * Function to check if the selected team has been changed
   * @param input
   */
  teamSelectChanged(input) {
      if (this.teamOld != input) {
        this.teamChanged = true;
      } else {
        this.teamChanged = false;
      }
    }

    /**
     * Functions checks if change in isTrainer or isPlayer was changed
     * @param ev event-handler
     */
    changeValue(ev) {
        if (!(this.player.isPlayer == false && this.player.isTrainer == false)) {
            if (this.isSpielerOld != this.player.isPlayer || this.isTrainerOld != this.player.isTrainer) {
                this.roleChanged = true;
            } else {
                this.roleChanged = false;
            }
        } else {
            this.roleChanged = false;
        }
    }

    /* editRole(){
         this.editMode = true;
     }*/

    /**
     * Writes/Updates the new state of the player into the database
     * @param ev event-handler
     * @param player to update the right one
     */
    onDonePress(player) {
        let successFlag = true;

        firebase.database().ref('clubs/12/players/' + player.id).update({
            isTrainer: player.isTrainer,
            isPlayer: player.isPlayer,
            team: player.team
        }).catch(function (error) {
            console.log(error);
            successFlag = false;
        });

        if (successFlag) {
            if (this.sameUser) {
                this.utilities.setUserData();
                this.presentToast("Änderungen wurden gespeichert");
                if(this.player.isTrainer == true){
                  this.navigateBackToList();
                }else{
                  this.navCtrl.setRoot(MatchdayComponent);
                }
            } else {
                this.presentToast("Änderungen wurden gespeichert");
                this.navigateBackToList();
            }
        } else {
            this.presentToast("Error. Bitte versuchen Sie es erneut!");
        }

    }

    /**
     * Deletes the user from the database
     * @param player who will be deleted
     */
    deleteUser(player) {
        firebase.database().ref('clubs/12/players/' + player.id).remove();
        this.isDeleted = true;
        if (player.isDefault == true) {
            this.deleteDefaultPlayerFromMatches(player.id)
        } else {
            this.deleteInvites(player.id);
        }
        this.removePlayerFromTeam(player.team, player.id);
        this.navigateBackToList();
    }

    /**
     * Deletes all invites belonging to the player
     * @param playerId to delete the right invites
     */
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

    /**
     * Deletes the player from all matches
     * @param playerId to check if the player is part of the match
     * @param matchId to get the specific game
     * @param inviteState get the specifi match
     */
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

    /**
     * Delete Default Player from MatchdayComponent
     * @param playerId to find and delete the player
     */
    deleteDefaultPlayerFromMatches(playerId) {
        let tempMatchId;
        firebase.database().ref('clubs/12/matches').once('value', snapshot => {
            for (let i in snapshot.val()) {
                tempMatchId = i;
                for (let y in snapshot.val()[i].acceptedPlayers) {
                    if (playerId == snapshot.val()[i].acceptedPlayers[y]) {
                        firebase.database().ref('clubs/12/matches/'+ tempMatchId +'/acceptedPlayers/'+y).remove();
                    }
                }
            }
        })
    }

    /**
     * Deletes player from Team 
     * @param teamId to get specific team
     * @param playerId to delete the right player from the team
     */
    removePlayerFromTeam(teamId, playerId) {
        firebase.database().ref('clubs/12/teams/' + teamId).once('value', snapshot => {
            for (let i in snapshot.val().players) {
                if (playerId == snapshot.val().players[i]) {
                    return firebase.database().ref('clubs/12/teams/' + teamId + '/players/' + i).remove();
                }
            }
        });
    }

    /**
     * Navigates back to the root --> UsermanagementComponent
     */
    navigateBackToList() {
        this.navCtrl.pop();
    }

    /**
     * Shows toast if a action was successfull or not
     */
    presentToast(customMessage: string) {
        let toast = this.toastCtrl.create({
            message: customMessage,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }

    /**
     * Shows Confirm to ask the user if he/she is sure to delete the player
     * @param ev event-handler
     * @param player if yes then delete the player afterwards
     */
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
