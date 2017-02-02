/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit, Injectable } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, LoadingController, ModalController } from 'ionic-angular';
import { PopoverPage } from './popover.component';
import { EditTeamComponent } from './editTeam.component';
import { Utilities } from '../../app/utilities';
import { EditPlayerComponent } from './editPlayers.component';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { document } from "@angular/platform-browser/src/facade/browser";
import { EditRoleComponent } from '../editRole/editRole.component';
import * as _ from 'lodash';


@Component({
    selector: 'page-viewTeam',
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
    teamName: any;
    altersK: any;
    altersBez: any;
    currentUser: any;
    currentUserID: any;
    isAdmin: boolean;
    allPlayers: any;
    teamHasPlayers: boolean = true;
    originalPlayers: any;
    originalMatches: any;
    sKlasse: any;
    manCounter: any = 0;
    womanCounter: any = 0;
    /**
     * OLD VALUES
     */
    teamNameOld: string;
    altersKOld: any;
    altersBezOld: any;

    base64Image: string;
    base64String: string;

    altersklasse: number;
    teamArt: any;
    loading: any;




    /**
     * Diese Methode wird beim erstmaligen Initialisieren der Komponente aufgerufen.
     */
    ngOnInit(): void {
        this.database = firebase.database();
    }

    /**
     * Diese Methode wird verwendet, um die Rolle des aktuellen Benutzers abzufragen.
     */
    isTrainer() {
        this.currentUser = this.utils.user;
        this.database.ref("/clubs/12/players/" + this.currentUser.uid + "/").once('value', snapshot => {
            let data = snapshot.val();
            this.isAdmin = data.isTrainer;
        })
    }

    /**
     * Diese Methode wird jedes Mal ausgeführt, sobald die View aufgebaut wird und sorgt so für den Refresh der Daten.
     */
    ionViewWillEnter() {
        this.teamHasPlayers = true;
        this.isTrainer();
        this.teamId = this.navP.get("teamId");
        this.createAndPresentLoading();
        this.manCounter = 0;
        this.womanCounter = 0;
        this.buildTeam().then(() => {
            this.loading.dismiss().catch((error) => console.log("error caught"));
        });
    }


    doRefresh(event) {
        this.teamHasPlayers = true;
        this.isTrainer();
        this.manCounter = 0;
        this.womanCounter = 0;
        this.buildTeam().then(() => {
            event.complete();
        });
    }

    constructor(
        public navCtrl: NavController,
        private navP: NavParams,
        public alertCtrl: AlertController,
        public utils: Utilities,
        public formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController) {


        this.teamForm = formBuilder.group({
            teamName: [],
            altersBez: [],
            altersK: []
        })

    }

    checkIfTeamsHasPlayers() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
            let array = snapshot.val();
            let playerArray = array.players;
            if (playerArray == undefined || playerArray.length == 0) {
                this.teamHasPlayers = false;
            }
        }).then((data) => {
            this.countGenders();
        })
    }

    countGenders() {
        this.database.ref('/clubs/12/players/').once('value', snapshot => {
            let players = snapshot.val();
            let player;
            let age;
            for (let i in players) {
                player = players[i];
                if (player.team == this.teamId) {
                    if (player.gender == "m") {
                        this.manCounter++;
                    } else {
                        this.womanCounter++;
                    }
                }
            }
        })
    }

    createAndPresentLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'ios',
            content: 'Lade Daten...'
        })
        this.loading.present();
    }

    buildTeam() {
        return this.database.ref("/clubs/12/teams/" + this.teamId + "/").once('value', snapshot => {
            this.team = snapshot.val();
            this.teamNameOld = this.team.name;
            this.altersKOld = this.team.ageLimit;
            this.altersklasse = this.team.ageLimit;
            this.teamArt = this.team.type;
            this.sKlasse = this.team.sclass;
            /*this.altersBezOld = this.team.type;
            if (this.altersBezOld == 1) {
                this.altersBezOld = "Schüler";
            } else if (this.altersBezOld == 0) {
                this.altersBezOld = "Jugend";
            } else {
                this.altersBezOld = "Erwachsen";
            }*/
        }).then((data) => {
            if (this.team != null && this.team != undefined) {
                this.refreshPlayers();
            } else {
                this.loading.dismiss().catch((error) => {
                    console.log("error caught");
                })
                let alert = this.alertCtrl.create({
                    title: 'Fehler',
                    message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten.',
                    buttons: ['OK']
                })
            }
        })
    }

    refreshPlayers() {
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            let playerArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                playerArray[counter] = snapshot.val()[i];
                playerArray[counter].id = i;
                counter++;
            }
            this.allPlayers = playerArray;
            this.allPlayers = _.sortBy(this.allPlayers, "lastname");
        }).then((data) => {
            this.checkIfTeamsHasPlayers();
        })
    }

    viewPlayer(p: any) {
        this.navCtrl.push(EditRoleComponent, {
            player: p
        })
    }


    updateTeamInfos(infosChanged: boolean) {
        if (infosChanged) {
            //UPDATE Database
            firebase.database().ref('clubs/12/teams/' + this.teamId).update({
                ageLimit: this.altersK,
                name: this.teamName,
                type: this.teamArt,
                sclass: this.sKlasse
            });

            //UPDATE Array
            this.team.ageLimit = this.altersK;
            this.team.name = this.teamName;
            this.team.type = this.teamArt;
            this.team.sclass = this.sKlasse;
            console.log(this.team);

        }
        //END Edit Mode
        this.editMode = false;
    }

    getFormData() {

        this.teamName = this.teamForm.value.teamName;
        this.altersK = this.altersklasse;

        if (this.teamName == null) {
            //Keine Änderung
            this.teamNameChanged = false;
            this.teamName = this.teamNameOld;
        } else {
            this.teamNameChanged = true;
        }
        if (this.altersK == null) {
            //Keine Änderung
            this.altersKChanged = false;
            this.altersK = this.altersKOld;
        } else {
            this.altersKChanged = true;
        }
        if (this.altersBez == null) {
            this.altersBezChanged = false;
            this.altersBez = this.altersBezOld;
        } else {
            this.altersBezChanged = true;
        }

        /*  if (this.altersklasse <= 15 && this.altersklasse != 0) {
              this.altersBez = 1;
          } else if (this.altersklasse <= 19 && this.altersklasse > 15) {
              this.altersBez = 0;
          } else {
              this.altersBez = 2;
          }*/

        if ((!this.altersKChanged) && (!this.altersBezChanged) && (!this.teamNameChanged)) {
            //Keine Änderung
            this.updateTeamInfos(false);
        } else {
            this.updateTeamInfos(true);
        }

    }

    editTeam() {
        this.editMode = true;
    }


    editPlayers() {
        this.navCtrl.push(EditPlayerComponent, {
            toRoot: 'no',
            //param: this.justPlayers,
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
        console.log(p.id);
        let playerId = p.id;
        let deleteId = "";
        this.database.ref('/clubs/12/teams/' + this.teamId + '/players/').once('value', snapshot => {
            let justPlayersOfTeam = snapshot.val();
            for (let i in justPlayersOfTeam) {
                let ID = justPlayersOfTeam[i];
                if (p.id == ID) {
                    deleteId = i;
                }
            }
            console.log("DELETE ID: " + deleteId);
            if (deleteId != "") {
                this.doDelete(p.id, deleteId);
            } else {
                //USER MITTEILEN DASS SPIELER NICHT MITGLIED DES TEAMS IST
            }
        });
        this.playerDeleted = true;

    }

    doDelete(stringID, intID) {
        this.database.ref('clubs/12/teams/' + this.teamId + '/players/' + intID).remove();
        this.database.ref('clubs/12/players/' + stringID + '/').update({
            team: '0'
        });
        this.refreshArray(stringID);

    }

    refreshArray(ID) {
        for (let i in this.allPlayers) {
            if (this.allPlayers[i].id == ID) {
                this.allPlayers[i].team = "";
            }
        }
        console.log(this.allPlayers);
    }

    deleteTeamFromPlayers() {
        this.database.ref('clubs/12/players').once('value', snapshot => {
            this.originalPlayers = snapshot.val();
        }).then((data) => {
            let player;
            for (let i in this.originalPlayers) {
                player = this.originalPlayers[i];
                if (player.team == this.teamId) {
                    player.team = '0';
                }
            }
            console.log(this.originalPlayers);
            this.database.ref('clubs/12/').update({
                players: this.originalPlayers
            }).then((data) => {
                this.deleteTeamFromMatches();
            });
        });
    }

    deleteTeamFromMatches() {
        this.database.ref('clubs/12/matches').once('value', snapshot => {
            this.originalMatches = snapshot.val();
        }).then((data) => {
            let match;
            for (let i in this.originalMatches) {
                match = this.originalMatches[i];
                if (match.team == this.teamId) {
                    match.team = '0';
                }
            }
            this.database.ref('clubs/12/').update({
                matches: this.originalMatches
            }).then(data => {
                this.navCtrl.popToRoot();
            })
        })
    }

    deleteTeam() {
        this.database.ref('clubs/12/teams/' + this.teamId).remove();
        this.deleteTeamFromPlayers();
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

    getFirstFourPicUrls() {
        let urlArray = [];
        let counter = 0;
        for (let i in this.allPlayers) {
            let player = this.allPlayers[i];
            if (counter < 4) {
                if (this.teamId == player.team) {
                    urlArray[counter] = player.picUrl;
                    counter++;
                }
            }
        }
        return urlArray;
    }


}
