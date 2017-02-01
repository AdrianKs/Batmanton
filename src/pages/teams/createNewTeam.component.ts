/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EditPlayerComponent } from './editPlayers.component';
import { document } from "@angular/platform-browser/src/facade/browser";
import { Camera } from 'ionic-native';


@Component({
    selector: 'create-new-team',
    templateUrl: 'createNewTeam.component.html',
    providers: [FirebaseProvider]
})
export class CreateTeamComponent implements OnInit {

    altersklasse: number = -1;
    teamArt: any;
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
    sKlasse:any;

    ngOnInit(): void {
        this.initActionSheet();
    }

    constructor(public navCtrl: NavController,
        public fbP: FirebaseProvider,
        public utilities: Utilities,
        public formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController) {
        this.addTeamForm = formBuilder.group({
            TeamName: ['', Validators.compose([Validators.required])],
            maxAlt: ['', Validators.compose([Validators.required])],
            altersBez: ['']
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

    initActionSheet() {
        this.actionSheetOptions = {
            title: 'Profilbild ändern',
            buttons: [
                {
                    text: 'Fotos',
                    icon: "images",
                    handler: () => this.getPicture()
                },
                {
                    text: 'Abbrechen',
                    role: 'cancel'
                }
            ]
        };
    }

    popToRoot() {
        this.navCtrl.popToRoot();
    }

    proceedProcess() {
        this.newTeamId = this.makeid();
        this.teamName = this.addTeamForm.value.TeamName;
        this.maxAlt = this.altersklasse;
       /* if (this.altersklasse <= 15 && this.altersklasse != 0) {
            this.altersBez = "Schüler";
        } else if (this.altersklasse <= 19 && this.altersklasse > 15) {
            this.altersBez = "Jugend";
        } else {
            this.altersBez = "Erwachsen";
        }
        //this.altersBez = this.addTeamForm.value.altersBez;
        if (this.altersBez == "Schüler") {
            this.altersBez = 1;
        } else if (this.altersBez == "Jugend") {
            this.altersBez = 0;
        } else {
            this.altersBez = 2;
        }
        let lokalTeam = {
                ageLimit: this.maxAlt,
                name: this.teamName,
                type: this.teamArt
            }*/
        this.database.ref('clubs/12/teams/').child(this.newTeamId).set({
            ageLimit: this.maxAlt,
            name: this.teamName,
            type: this.teamArt,
            sclass: this.sKlasse
        }).then(data => {
            this.showSuccessAlert();
        })
        /*this.database.ref('clubs/12/teams/').once('value', snapshot => {
            let lokalTeam = {
                ageLimit: this.maxAlt,
                name: this.teamName,
                type: this.altersBez
            }
            //TEAMS LOKAL IM ARRAY
            let teamArray = [];
            let counter;
            for (let i in snapshot.val()) {
                teamArray[i] = snapshot.val()[i];
            }
            teamArray.push(lokalTeam);
            for (let i in teamArray) {
                counter = i;
            }
            console.log(counter);
            this.newTeamId = counter;
            //Datenbank updaten
            firebase.database().ref('clubs/12/').update({
                teams: teamArray
            });

        }).then((data) => {
            this.showSuccessAlert();
        });*/
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

    getPicture() {
        let options = {
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            quality: 100,
            targetWidth: 500,
            targetHeight: 500
        };

        this.callCamera(options);
    }

    callCamera(options) {
        Camera.getPicture(options)
            .then((imageData) => {
                // imageData is a base64 encoded string
                this.base64Image = "data:image/jpeg;base64," + imageData;
                this.base64String = imageData;
                this.uploadPicture();
            }, (err) => {
                console.log(err);
            });
    }

    uploadPicture() {
        this.teamPicId = this.makeid();
        // firebase.storage().ref().child('profilePictures/' + this.utilities.userDataID + "/" + this.utilities.userDataID + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
        firebase.storage().ref().child('teamPictures/' + this.teamPicId + ".jpg").putString(this.base64String, 'base64', { contentType: 'image/JPEG' })
            .then(callback => {
                document.getElementById("teamPic").src = this.base64Image;
                this.picUrl = callback.downloadURL;
                this.changedPic = true;
                // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
                this.actionSheetOptions = {
                    title: 'Profilbild ändern',
                    buttons: [
                        {
                            text: 'Fotos',
                            icon: "images",
                            handler: () => this.getPicture()
                        },
                        {
                            text: 'Abbrechen',
                            role: 'cancel'
                        }
                    ]
                };
            })
            .catch(function (error) {
                alert(error.message);
                console.log(error);
            });
    }

    changeTeamPicture() {
        let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);
        actionSheet.present();
    }

}
