import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
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

    constructor(private navCtrl: NavController,
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

    goBack() {
        this.navCtrl.popToRoot();
    }

    createPlayer() {
        this.submitAttempt = true;

        if (!this.createPlayerForm.valid) {
            console.log('Form not valid');
        } else {
            this.playerId = this.makeid();
            this.playerData = {
                birthday: this.createPlayerForm.value.birthday,
                email: "",
                firstname: this.createPlayerForm.value.firstname,
                gender: this.gender,
                isDefault: true,
                isPlayer: true,
                isTrainer: false,
                lastname: this.createPlayerForm.value.lastname,
                picUrl: "",
                platform: "",
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

    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 26; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    /**
 * This method checks if a input field was changed
 * @param input Input field to check
 */
    elementChanged(input) {
        let field = input.inputControl.name;
        this[field + "Changed"] = true;
    }

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