/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { PopoverPage } from './popover.component';
import { EditTeamComponent } from './editTeam.component';
import { Utilities } from '../../app/utilities';
import { EditPlayerComponent } from './editPlayers.component';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { document } from "@angular/platform-browser/src/facade/browser";
import {Camera} from 'ionic-native';


@Component({
    templateUrl: 'viewTeam.component.html'
})
export class ViewTeamComponent implements OnInit {


    team: any = [];
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    teamForm: any;
    playerModel: any;
    justPlayers: any = [];
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
    actionSheetOptions: any;
    teamPicUrl: any;

    /**
     * OLD VALUES
     */
    teamNameOld: string;
    altersKOld: any;
    altersBezOld: string;

    base64Image: string;
    base64String: string;




    ngOnInit(): void {
        this.database = firebase.database();
        this.teamId = this.navP.get("teamId");
        this.initActionSheet();
        //this.getTeamPicture();
    }

    ionViewWillEnter(){
        this.justPlayers = [];
        this.buildTeam();
    }


    //TODO: Probieren ob ionViewLoaded() noch hilft um View zu refreshen
    ionViewDidEnter(){
        /*this.justPlayers = [];
        this.buildTeam();*/
    }


    constructor(
        public navCtrl: NavController,
        private navP: NavParams,
        public alertCtrl: AlertController,
        public utils: Utilities,
        public formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController) {


        this.teamForm = formBuilder.group({
            teamName: [],
            altersBez: [],
            altersK: []
        })

        

        //this.teamId = this.navP.get("teamId");
        //console.log(this.teamId);
        //this.buildTeam();
        //this.team = this.getTeam();
        //Test
        //this.team = [];
        //this.justPlayers = [];
        //this.team = this.navP.get("team");
        //this.justPlayersPlaceholder = this.team.players;
        //this.refreshArrays();
        //this.checkIfUndefined();
    }

    buildTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
            this.team = snapshot.val();
            console.log(this.team);
            //this.team = snapshot.val();
            if (this.team != null && this.team != undefined) {
                this.getPlayersOfTeamDb();
            }
            /*console.log(this.team);
            if (this.team != undefined) {
                this.justPlayersPlaceholder = this.team.players;
                this.checkIfUndefined();
            } else {
                //FEHLER MELDUNG AUSGEBEN
            }*/
            /*this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();*/
        })
    }


    updateTeamInfos() {
        if (this.validate()) {
            let teamName = this.teamForm.value.teamName;
            let altersK = this.teamForm.value.altersK;
            let altersBez = this.teamForm.value.altersBez;
            if (altersBez == "Mini") {
                altersBez = 1;
            } else if (altersBez == "Erwachsen") {
                altersBez = 0;
            } else {
                //besser erwachsen als mini
                altersBez = 0;
            }

            //UPDATE Database
            firebase.database().ref('clubs/12/teams/' + this.teamId).set({
                ageLimit: altersK,
                name: teamName,
                type: altersBez
            });

            //UPDATE Array 
            this.team.ageLimit = altersK;
            this.team.name = teamName;
            this.team.type = altersBez;

            console.log(this.team);
            //END Edit Mode
            this.editMode = false;
        }
    }

    validate() {

        //TODO: Bekommt NULL-Werte???? => Fixen
        let teamName = this.teamForm.value.teamName;
        let altersK = this.teamForm.value.altersK;
        let altersBez = this.teamForm.value.altersBez;
        if ((teamName != "" && altersK != "" && altersBez != "") && (teamName != null && altersK != null && altersBez != null)) {
            return true;
        } else {
            let alert = this.alertCtrl.create({
                title: 'Fehlende Angaben',
                subTitle: "Bitte tätigen Sie Eingabe für alle Felder!",
                buttons: ['OK']
            });
            alert.present();
            return false;
        }
    }

    getPlayersOfTeamDb() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/players/").once('value', snapshot => {
            let playerIDs = snapshot.val();
            if (playerIDs != null && playerIDs != undefined) {
                this.addPlayersToArray(playerIDs);
            }
            //return playerIDs;
            /*console.log(this.team);
            if (this.team != undefined) {
                this.justPlayersPlaceholder = this.team.players;
                this.checkIfUndefined();
            } else {
                //FEHLER MELDUNG AUSGEBEN
            }*/
            /*this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();*/
        })
    }


    addPlayersToArray(valueArray: any) {
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            this.justPlayers = [];
            let idPlaceholder = 0;
            let counter = 0;
            for (let i in valueArray) {
                idPlaceholder = valueArray[i];
                let player = snapshot.child("" + idPlaceholder).val();
                if ((player != null) && (player != undefined)) {
                    this.justPlayers[i] = player;
                    this.justPlayers[i].id = i;
                    this.justPlayers[i].uniqueId = idPlaceholder;
                    /*this.teams[i].players[y] = player;
                    this.teams[i].players[y].id = y;
                    this.teams[i].players[y].uniqueId = idPlaceholder;*/
                }
            }
            console.log(this.justPlayers);
            /*for (let i in valueArray) {
              for (let y in valueArray[i]) {
                idPlaceholder = valueArray[i][y];
                let player = snapshot.child("" + idPlaceholder).val();
                if ((player != null) && (player != undefined)) {
                  this.teams[i].players[y] = player;
                  this.teams[i].players[y].id = y;
                  this.teams[i].players[y].uniqueId = idPlaceholder;
                } else {
                  console.log("Spieler übersprungen, da null");
                }
              }
            }*/
        })

    }

    getTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
            let teamArray = snapshot.val();
            //this.team = snapshot.val();
            return teamArray;
            /*console.log(this.team);
            if (this.team != undefined) {
                this.justPlayersPlaceholder = this.team.players;
                this.checkIfUndefined();
            } else {
                //FEHLER MELDUNG AUSGEBEN
            }*/
            /*this.justPlayersPlaceholder = snapshot.val();
            this.checkIfUndefined();*/
        })
    }


    checkIfUndefined() {

        for (let i in this.justPlayersPlaceholder) {
            let player = this.justPlayersPlaceholder[i];
            if (player != undefined) {
                this.justPlayers.push(player);
            }
        }
    }

    editTeam() {
        this.editMode = true;
    }


    editPlayers() {
        this.navCtrl.push(EditPlayerComponent, {
            param: this.justPlayers,
            teamId: this.teamId,
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


        //TODO: Mannschaft aus clubs/12/players/ in Datenbank entfernen...wie?

        console.log(p);
        //this.justPlayers = []
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

        this.database.ref('clubs/12/teams/' + this.teamId + '/players/' + p.id).remove();
        this.database.ref('clubs/12/players/' + p.uniqueId + '/').update({
            team: ''
        });
        /*this.database.ref('clubs/12/players/' + p.id + '/teams/').once('value', snapshot => {
            let teamsOfPlayers = snapshot.val();
            let teamIdTemp;
            let idToBeDeleted;
            for (let i in teamsOfPlayers){
                teamIdTemp = teamsOfPlayers[i];
                if(teamIdTemp==this.teamId){
                    idToBeDeleted = i;
                }
            }
            if(idToBeDeleted!=undefined){
            this.deleteTeamFromPlayer(p.id, idToBeDeleted);
            }
        })*/
       
        this.playerDeleted = true;
        //this.getPlayersOfTeamDb();
        //this.getPlayersOfTeam();
    }


    deleteTeamFromPlayer(playerId: any, teamIdToBeDeleted: any){
         this.database.ref('clubs/12/players/' + playerId + '/teams/' + teamIdToBeDeleted).remove();
    }


    deleteTeam() {
        this.database.ref('clubs/12/teams/' + this.teamId).remove();
        this.navCtrl.popToRoot();
    }

    presentConfirm(p: any, action: string) {

        if (action == "delP") {
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
                        }
                    }
                ]

            });
            alert.present();
        } else if (action == "delT") {
            let alert = this.alertCtrl.create({
                title: 'Mannschaft löschen',
                message: 'Wollen Sie die Mannschaft wirklich löschen?',
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
                            this.deleteTeam();
                        }
                    }
                ]
            });
            alert.present();


        }




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

  makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 7; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

  uploadPicture() {
      let id = this.makeid();
      this.teamPicUrl = id;
    // firebase.storage().ref().child('profilePictures/' + this.utilities.userDataID + "/" + this.utilities.userDataID + ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
    firebase.storage().ref().child('teamPictures/' + id+ ".jpg").putString(this.base64String, 'base64', {contentType: 'image/JPEG'})
      .then(callback => {
        document.getElementById("teamPic").src = this.base64Image;
        this.storeUrl(callback.downloadURL);
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
              text: 'Profilbild löschen',
              role: 'destructive',
              icon: "trash",
              handler: () => this.deleteTeamPicture()
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
        if (this.editMode) {
            actionSheet.present();
        }
    }

    deleteTeamPicture() {
        var that = this;
        this.teamPicUrl = this.team.teamPicId;
    // firebase.storage().ref().child('profilePictures/test.jpg').delete().then(function() {
    // firebase.storage().ref().child('profilePictures/' + this.utilities.userDataID + "/" + this.utilities.userDataID + '.jpg').delete().then(function () {
    firebase.storage().ref().child('teamPictures/' + this.teamPicUrl+ '.jpg').delete().then(function () {
      document.getElementById("teamPic").src = "assets/images/ic_account_circle_black_48dp_2x.png";

      // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
      that.actionSheetOptions = {
        title: 'Profilbild ändern',
        buttons: [
          {
            text: 'Fotos',
            icon: "images",
            handler: () => that.getPicture()
          },
          {
            text: 'Abbrechen',
            role: 'cancel'
          }
        ]
      };
    }).catch(function (error) {
      alert(error.message);
    });
    }

    initActionSheet(){
        this.actionSheetOptions = {
                title: 'Teambild ändern',
                buttons: [
                    {
                        text: 'Fotos',
                        icon: "images",
                        handler: () => this.getPicture()
                    },
                    {
                        text: 'Profilbild löschen',
                        role: 'destructive',
                        icon: "trash",
                        handler: () => this.deleteTeamPicture()
                    },
                    {
                        text: 'Abbrechen',
                        role: 'cancel'
                    }
                ]
            };
    }

    getTeamPicture() {
        var that = this;
        // firebase.storage().ref().child("profilePictures/" + this.utilities.userDataID + "/" + this.utilities.userDataID + ".jpg").getDownloadURL().then(function (url) {
        firebase.storage().ref().child("teamPictures/" + this.teamId+"_"+this.team.name + "/" + this.teamId +"_"+this.team.name+ ".jpg").getDownloadURL().then(function (url) {
            document.getElementById("teamPic").src = url;
            // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
            that.actionSheetOptions = {
                title: 'Teambild ändern',
                buttons: [
                    {
                        text: 'Fotos',
                        icon: "images",
                        handler: () => that.getPicture()
                    },
                    {
                        text: 'Profilbild löschen',
                        role: 'destructive',
                        icon: "trash",
                        handler: () => that.deleteTeamPicture()
                    },
                    {
                        text: 'Abbrechen',
                        role: 'cancel'
                    }
                ]
            };
        }).catch(function (error) {
            document.getElementById("teamPic").src = "assets/images/ic_account_circle_black_48dp_2x.png";
            // Depending on whether an image is uploaded or not, display the delete image option in the action sheet or not
            that.actionSheetOptions = {
                title: 'Profilbild ändern',
                buttons: [
                    {
                        text: 'Fotos',
                        icon: "images",
                        handler: () => that.getPicture()
                    },
                    {
                        text: 'Abbrechen',
                        role: 'cancel'
                    }
                ]
            };
        });
    }

    storeUrl(url: string) {
    firebase.database().ref('clubs/12/teams/' + this.teamId).update({
        teamPicUrl: url,
        teamPicId: this.teamPicUrl
    });
  }


}






