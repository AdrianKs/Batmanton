import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { Utilities } from '../../app/utilities';

@Component({
    selector: 'page-createPlayer',
    templateUrl: 'createPlayer.component.html',
    providers: []
})
export class CreatePlayerComponent implements OnInit {

    createPlayerForm;
    playerId: any;
    team: string = '';
    teams: any = [];
    gender: string = '';
    relevantTeams = this.utilities.allTeams;
    firstnameChanged: boolean = false;
    lastnameChanged: boolean = false;
    birthdayChanged: boolean = false;
    genderChanged: boolean = false;
    teamChanged: boolean = false;
    submitAttempt: boolean = false;
    playerData: any;

    /**
     * Constructor to initialize the Component and the Create-Player form
     */
    constructor(private navCtrl: NavController,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder,
        private utilities: Utilities) {

        this.createPlayerForm = formBuilder.group({
            firstname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
            lastname: ['', Validators.compose([Validators.required, Validators.minLength(2), this.startsWithACapital])],
            birthday: ['', Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {

    }

    /**
     * Shows alert message when view will be entered
     */
    ionViewWillEnter() {
        this.showAlertMessage();
    }

    /**
     * Show alert Message
     */
    showAlertMessage() {
        let alert = this.alertCtrl.create({
            title: 'Hinweis',
            subTitle: "Die hier erstellten Spieler, werden als Default-User ohne bestehenden Login-Account angelegt",
            buttons: ['OK']
        });
        alert.present();
    }

    /**
     * Navigates back to root --> UserManagementComponent
     */
    goBack() {
        this.navCtrl.popToRoot();
    }

    /**
     * Creates a player and writes it to the database if the form is valid
     */
    createPlayer() {
        this.submitAttempt = true;

        if (!this.createPlayerForm.valid || !this.gender || !this.team) {
            console.log('Form not valid');
        } else {
            this.playerId = this.makeid();
            this.playerData = {
                birthday: this.createPlayerForm.value.birthday,
                email: "",
                firstname: this.createPlayerForm.value.firstname,
                gender: this.gender,
                helpCounter: 0,
                isDefault: true,
                isPlayer: true,
                isTrainer: false,
                lastname: this.createPlayerForm.value.lastname,
                picUrl: "",
                platform: "sonstige",
                pushid: "",
                state: 0,
                team: this.team
            }
            this.utilities.createPlayer(this.playerId, this.playerData).then(() => {
                this.utilities.addPlayerToTeam(this.team, this.playerId);
                console.log("Spieler erstellt");
                this.navCtrl.popToRoot();
            });
        }
    }

    /**
     * Function to create a unique id for the created player
     */
    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 26; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    /**
 * This function checks if a input field was changed
 * @param input Input field to check
 */
    elementChanged(input) {
        let field = input.inputControl.name;
        this[field + "Changed"] = true;
    }

    /**
     * Checks if the selection of the birthday was changed
     */
    birthdaySelectChanged() {
        this.relevantTeams = this.utilities.getRelevantTeams(this.createPlayerForm.value.birthday);
        if (this.team != undefined && this.utilities.allTeamsVal[this.team] != undefined) {
            if (this.team != "0" && this.utilities.allTeamsVal[this.team].ageLimit != 0) {
                if (this.utilities.allTeamsVal[this.team].ageLimit < this.utilities.calculateAge(this.createPlayerForm.value.birthday)) {
                    this.team = "0";
                }
            }
        }
    }

    /**
 * This function is needed, since the select box can for some reason not be validated in formcontrol,
 * so ngModel had to be used, so a special validation is needed
 */
    genderSelectChanged(input) {
        this.gender = input;
        this.genderChanged = true;
    }

    teamSelectChanged(input) {
        this.team = input;
        this.teamChanged = true;
    }


    /**
 * This function checks, if the input field starts with a capital letter
 * @param formcontrol to check the value
 */
    startsWithACapital(c: FormControl) {
        let NAME_REGEXP = new RegExp("[A-Z]");
        if (!NAME_REGEXP.test(c.value.charAt(0))) {
            return { "incorrectNameFormat": true }
        }
        let field = "firstname";
        return null;
    }

}