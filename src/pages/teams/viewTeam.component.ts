/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { EditPlayerComponent } from './editPlayers.component';
import { FormBuilder} from '@angular/forms';
import { EditRoleComponent } from '../editRole/editRole.component';
import { TeamsProvider } from '../../providers/teams-provider';


@Component({
    selector: 'page-viewTeam',
    templateUrl: 'viewTeam.component.html',
    providers: [TeamsProvider]
})
export class ViewTeamComponent implements OnInit {


    team: any = [];
    geschlecht: string = "maenner";
    playersOfTeam: any[];
    teamForm: any;
    playerModel: any;
    justPlayers: any = [];
    justPlayersPlaceholder: any;
   
    editMode: boolean = false;
    isChanged: boolean = false;
    teamId: any;
    playerDeleted: boolean = false;
    teamNameChanged: boolean = false;
    altersKChanged: boolean = false;
    altersBezChanged: boolean = false;
    formValid: boolean = false;
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
      
    }

    /**
     * Diese Methode wird verwendet, um die Rolle des aktuellen Benutzers abzufragen.
     */
    isTrainer() {
        this.currentUser = this.utils.userData;
        this.isAdmin = this.currentUser.isTrainer;
        /*this.database.ref("/clubs/12/players/" + this.currentUser.uid + "/").once('value', snapshot => {
            let data = snapshot.val();
            this.isAdmin = data.isTrainer;
        })*/
    }

    /**
     * Diese Methode wird jedes Mal ausgeführt, sobald die View aufgebaut wird und sorgt so für den Refresh der Daten.
     */
    ionViewWillEnter() {
        this.teamId = this.navP.get("teamId");
        this.teamsProvider.teamId = this.teamId;
        this.teamHasPlayers = true;
        this.isTrainer();
        this.createAndPresentLoading();
        this.manCounter = 0;
        this.womanCounter = 0;
        this.teamsProvider.buildTeam().then(() => {
            if (this.team != null && this.team != undefined) {
                this.teamsProvider.refreshPlayers().then(() => {
                    this.teamsProvider.checkIfTeamsHasPlayers().then(() => {
                        this.teamsProvider.countGenders().then(() => {
                            this.team = this.teamsProvider.team;
                            this.teamNameOld = this.team.name;
                            this.altersKOld = this.team.ageLimit;
                            this.altersklasse = this.team.ageLimit;
                            this.teamArt = this.team.type;
                            this.sKlasse = this.team.sclass;
                            this.allPlayers = this.teamsProvider.allPlayers;
                            this.teamHasPlayers = this.teamsProvider.teamHasPlayers;
                            this.manCounter = this.teamsProvider.manCounter;
                            this.womanCounter = this.teamsProvider.womanCounter;
                            this.loading.dismiss().catch((error) => console.log("error caught"));
                        });
                    });
                });
            } else {
                this.loading.dismiss().catch((error) => {
                    console.log("error caught");
                })
                let alert = this.alertCtrl.create({
                    title: 'Fehler',
                    message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten.',
                    buttons: ['OK']
                })
                alert.present();
            }
        });
    }

    doRefresh(event) {
        this.teamHasPlayers = true;
        this.isTrainer();
        this.manCounter = 0;
        this.womanCounter = 0;
        this.teamsProvider.buildTeam().then(() => {
            if (this.team != null && this.team != undefined) {
                this.teamsProvider.refreshPlayers().then(() => {
                    this.teamsProvider.checkIfTeamsHasPlayers().then(() => {
                        this.teamsProvider.countGenders().then(() => {
                            this.team = this.teamsProvider.team;
                            this.teamNameOld = this.team.name;
                            this.altersKOld = this.team.ageLimit;
                            this.altersklasse = this.team.ageLimit;
                            this.teamArt = this.team.type;
                            this.sKlasse = this.team.sclass;
                            this.allPlayers = this.teamsProvider.allPlayers;
                            this.teamHasPlayers = this.teamsProvider.teamHasPlayers;
                            this.manCounter = this.teamsProvider.manCounter;
                            this.womanCounter = this.teamsProvider.womanCounter;
                            event.complete();
                        });
                    });
                });
            } else {
                event.complete();
                let alert = this.alertCtrl.create({
                    title: 'Fehler',
                    message: 'Beim Empfangen der Daten ist ein Fehler aufgetreten.',
                    buttons: ['OK']
                })
                alert.present();
            }
        });
    }

    constructor(
        public navCtrl: NavController,
        private navP: NavParams,
        public alertCtrl: AlertController,
        public utils: Utilities,
        public formBuilder: FormBuilder,
        public loadingCtrl: LoadingController,
        public teamsProvider: TeamsProvider) {


        this.teamForm = formBuilder.group({
            teamName: [],
            altersBez: [],
            altersK: []
        })

    }

   


    createAndPresentLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'ios',
            content: 'Lade Daten...'
        })
        this.loading.present();
    }



    viewPlayer(p: any) {
        this.navCtrl.push(EditRoleComponent, {
            player: p
        })
    }


    updateTeamInfos(infosChanged: boolean) {
        if (infosChanged) {
            this.teamsProvider.updateTeamInfos(this.altersK, this.teamName, this.teamArt, this.sKlasse).then(()=>{
                this.team = this.teamsProvider.team;
            })
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
        this.teamsProvider.removePlayer(p).then(()=>{
            let deleteId = this.teamsProvider.deleteID;
            if(deleteId!=undefined){
                this.teamsProvider.deletePlayerFromTeam(deleteId).then(()=>{
                    this.teamsProvider.resetTeamOfPlayer(p.id).then(()=>{
                        this.allPlayers = [];
                        this.allPlayers = this.teamsProvider.allPlayers;
                    })
                })
            }
            
        });
    }


    deleteTeam() {
        this.createAndPresentLoading();
        this.teamsProvider.deleteTeam().then(() => {
            this.teamsProvider.deleteTeamFromPlayers().then(() => {
                this.originalPlayers = this.teamsProvider.playerDBArray;
                this.teamsProvider.updateDatabaseWithArray("players", this.originalPlayers).then(()=>{
                    this.teamsProvider.deleteTeamFromMatches().then(()=>{
                        this.originalMatches = this.teamsProvider.matchesDBArray;
                        this.teamsProvider.updateDatabaseWithArray("matches", this.originalMatches).then(()=>{
                            this.loading.dismiss().catch((error)=>console.log(error.message));
                            this.navCtrl.popToRoot();
                        })
                    })
                })
            })
        })
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
