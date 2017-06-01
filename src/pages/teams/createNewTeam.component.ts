/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController, AlertController } from 'ionic-angular';
import { TeamsProvider } from '../../providers/teams-provider';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EditPlayerComponent } from './editPlayers.component';
import { document } from "@angular/platform-browser/src/facade/browser";
import { Camera } from 'ionic-native';


@Component({
    selector: 'create-new-team',
    templateUrl: 'createNewTeam.component.html',
    providers: [TeamsProvider]
})
export class CreateTeamComponent implements OnInit {

    altersklasse: number = -1;
    teamArt: any = "";
    database: any;
    addTeamForm: any;
    teamName: any;
    maxAlt: any = 0;
    altersBez: any;
    base64Image: any;
    base64String: any;
    actionSheetOptions: any;
    picUrl: any;
    teamPicId: any;
    changedPic: boolean = false;
    newTeamId: any;
    rank: number;

    ngOnInit(): void {

    }

    constructor(public navCtrl: NavController,
        public teamsProvider: TeamsProvider,
        public utilities: Utilities,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController) {
        this.addTeamForm = formBuilder.group({
            TeamName: ['', Validators.compose([Validators.required])],
            maxAlt: ['', Validators.compose([Validators.required])],
            altersBez: [''],
            rank: []
        });
        this.database = firebase.database();
    }

    selectAltersklasse(value) {
        this.altersklasse = value;
    }

    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 26; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    popToRoot() {
        this.navCtrl.popToRoot();
    }

    proceedProcess() {
        this.newTeamId = this.makeid();
        this.teamName = this.addTeamForm.value.TeamName;
        this.maxAlt = this.altersklasse;
        if (this.teamName != "" && this.maxAlt != "" && this.teamArt != "" && this.rank != 0) {
            this.teamsProvider.addNewTeam(this.newTeamId, this.maxAlt, this.teamName, this.teamArt, this.rank).then(() => {
                this.utilities.setTeams();
                this.showSuccessAlert();
            })
        }else{
            let alert = this.alertCtrl.create({
                message: 'Bitte füllen Sie alle Felder aus.',
                title: 'Unvollständige Eingaben',
                buttons:['OK']
            })
            alert.present();
        }
    }

    showSuccessAlert() {
        let alert = this.alertCtrl.create({
            message: 'Die Mannschaft wurde erfolgreich angelegt! Möchten Sie der Mannschaft direkt Spieler zuweisen?',
            title: 'Mannschaft angelegt',
            buttons: [
                {
                    text: 'Später',
                    handler: () => {
                        this.toRoot()
                    }
                },
                {
                    text: 'Spieler hinzufügen',
                    handler: () => {
                        this.addPlayers();
                    }
                }
            ]
        });
        alert.present();
    }

    toRoot() {
        this.navCtrl.pop();
    }

    addPlayers() {
        this.navCtrl.push(EditPlayerComponent, {
            toRoot: 'yes',
            teamId: this.newTeamId,
            maxAge: this.maxAlt
        });
    }

    altersBezChanged(input) {
        this.altersBez = input;
    }
}
