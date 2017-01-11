/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PopoverPage } from './popover.component';
import { EditTeamComponent } from './editTeam.component';
import { Utilities } from '../../app/utilities';
import { EditPlayerComponent } from './editPlayers.component';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
    templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent implements OnInit {

    team: any;
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    teamForm: any;
    playerModel: any;
    justPlayers: any;
    justPlayersPlaceholder: any;
    database: any;
    editMode: boolean = false;
    isChanged: boolean = false;
    teamId: any;
    playerDeleted: boolean = false;
    teamNameChanged: boolean = false;
    altersKChanged: boolean = false;
    altersBezChanged: boolean = false;
    formValid: boolean = false;


    /**
     * OLD VALUES
     */
    teamNameOld: string;
    altersKOld: any;
    altersBezOld: string;


    ngOnInit(): void {

    }

    constructor(
        public navCtrl: NavController,
        private navP: NavParams,
        public alertCtrl: AlertController,
        public utils: Utilities,
        public formBuilder: FormBuilder) {

        this.teamForm = formBuilder.group({
            teamName: [],
            altersBez: [],
            altersK: []
        })

        this.database = firebase.database();
        this.team = [];
        this.justPlayers = [];
        this.team = this.navP.get("team");
        this.justPlayersPlaceholder = this.team.players;
        this.checkIfUndefined();

    }

    getTeamDetails(teamId: any) {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
            this.team = snapshot.val();
            console.log(this.team);
            if (this.team != undefined) {
                this.justPlayersPlaceholder = this.team.players;
                this.checkIfUndefined();
            } else {
                //FEHLER MELDUNG AUSGEBEN
            }
            /*this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();*/
        })
    }

    detectChange() {

    }

    getPlayersOfTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/players/").once('value', snapshot => {
            this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();
        })
    }

    elementChanged(input) {
        let field = input.inputControl.name;
        if (this[field + "Old"] != this["teamForm"]["value"][field]) {
            this[field + "Changed"] = true;
        } else {
            this[field + "Changed"] = false;
        }
        if (this.teamForm.controls.teamName.valid && this.teamForm.controls.altersK.valid && this.teamForm.controls.altersBez.valid) {
            this.formValid = true;
        } else {
            this.formValid = false;
        }
    }

    checkIfUndefined() {

        for (let i in this.justPlayersPlaceholder) {
            let player = this.justPlayersPlaceholder[i];
            if (player != undefined) {
                this.justPlayers.push(player);
            }
        }
        /*console.log("JUST PLAYERS ARRAY:");
        console.log(this.justPlayers);*/
        //this.playerModel = this.justPlayers;
    }

    editTeam() {
        this.editMode = true;
    }

    editPlayers() {
        this.navCtrl.push(EditPlayerComponent, {
            param: this.justPlayers,
            teamId: this.team.id,
            maxAge: this.team.ageLimit
        })
    }

    toggleEditMode() {
        this.editMode = false;
    }

    popToRoot() {
        this.navCtrl.popToRoot();
    }

    removePlayer(p: any) {
        let placeHolderArray = this.justPlayers;
        let uniqueId = 0;
        let deleteId = p.uniqueId;
        this.justPlayers = [];
        for (let i in placeHolderArray) {
            uniqueId = placeHolderArray[i].uniqueId;
            if (uniqueId != deleteId) {
                this.justPlayers.push(placeHolderArray[i]);
            }
        }
        this.database.ref('clubs/12/teams/' + this.team.id + '/players/' + p.id).remove();
        this.playerDeleted = true;
        //this.getPlayersOfTeam();
    }


    public updateJustPlayerList(p: any) {
        let placeHolderArray = this.justPlayers;
        let uniqueId = 0;
        let deleteId = p.uniqueId;
        this.justPlayers = [];
        for (let i in placeHolderArray) {
            uniqueId = placeHolderArray[i].uniqueId;
            if (uniqueId != deleteId) {
                this.justPlayers.push(placeHolderArray[i]);
            }
        }
    }


    presentConfirm(p: any) {
        let alert = this.alertCtrl.create({
            title: 'Spieler aus Mannschaft entfernen',
            message: 'Wollen Sie den Spieler wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Löschen',
                    handler: () => {
                        this.removePlayer(p);
                        //console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }

}






