/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController, ActionSheetController } from 'ionic-angular';
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

    ngOnInit(): void {
        this.initActionSheet();
    }

    constructor(public navCtrl: NavController,
        public fbP: FirebaseProvider,
        public utilities: Utilities,
        public formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController) {
        this.addTeamForm = formBuilder.group({
            TeamName: ['', Validators.compose([Validators.required])],
            maxAlt: ['', Validators.compose([Validators.required])],
            altersBez: ['', Validators.compose([Validators.required])]
        });
        this.database = firebase.database();
    }

    makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 7; i++)
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
        this.teamName = this.addTeamForm.value.TeamName;
        this.maxAlt = this.addTeamForm.value.maxAlt;
        this.altersBez = this.addTeamForm.value.altersBez;
        if (this.altersBez == "Mini") {
            this.altersBez = 1;
        } else {
            this.altersBez = 0;
        }
        this.database.ref('clubs/12/teams/').once('value', snapshot => {
            if(!this.changedPic){
                this.picUrl = '';
                this.teamPicId = '';
            }
            let lokalTeam = {
                ageLimit: this.maxAlt,
                name: this.teamName,
                type: this.altersBez,
                teamPicUrl: this.picUrl,
                teamPicId: this.teamPicId
            }
            //TEAMS LOKAL IM ARRAY
            let teamArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                teamArray[i] = snapshot.val()[i];
                counter++;
            }
            teamArray.push(lokalTeam);
            //Datenbank updaten
            firebase.database().ref('clubs/12/').update({
                teams: teamArray
            });
            this.navCtrl.popToRoot();
        });
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

    changeTeamPicture(){
        let actionSheet = this.actionSheetCtrl.create(this.actionSheetOptions);
            actionSheet.present();
    }

}
