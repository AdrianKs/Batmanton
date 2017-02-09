import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';
import { TeamsProvider } from '../../providers/teams-provider';



@Component({
    templateUrl: 'editPlayers.component.html',
    providers: [TeamsProvider]
})
export class EditPlayerComponent implements OnInit {

    team: string = "";
    teamId: string = "";
    allPlayers: any[];
    allPlayersSearch: any[];
    geschlecht: string = "maenner";
    teams: any[];
    ageLimit: any = "";
    toRoot: any;
    womanCounter: any = 0;
    manCounter: any = 0;

    ngOnInit(): void {
    }

    ionViewWillEnter() {
        this.allPlayers = [];
        this.teamId = this.nParam.get("teamId");
        this.teamsProvider.teamId = this.teamId;
        this.teamsProvider.getRelevantPlayers(this.ageLimit).then(() => {
            this.allPlayers = this.teamsProvider.allPlayersEdit;
            this.allPlayersSearch = this.teamsProvider.allPlayersEdit;
            this.manCounter = this.teamsProvider.manCounterEdit;
            this.womanCounter = this.teamsProvider.womanCounterEdit;
            console.log(this.womanCounter);
        })
        this.teamsProvider.setTeams().then(() => {
            this.teams = this.teamsProvider.teams;
        })
    }

    constructor(
        public nav: NavController,
        public nParam: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public teamsProvider: TeamsProvider
    ) {
        this.teamId = nParam.get("teamId");
        this.ageLimit = nParam.get("maxAge");
        this.toRoot = nParam.get("toRoot");
    }

    backToEditMode() {

        this.nav.pop();
    }

    initializePlayers() {
        this.allPlayers = this.allPlayersSearch;
    }

    addPlayer(p: any) {
        this.teamsProvider.addPlayerToTeam(p, this.teamId).then(() => {
            this.teamsProvider.setTeams();
            this.allPlayers = this.teamsProvider.allPlayersEdit;
            this.presentToast("Spieler zum Team hinzugefügt");
        });
    }

    removePlayer(p: any) {
        this.teamsProvider.removePlayerFromTeam(p, this.teamId).then(() => {
            this.teamsProvider.setTeams();
            this.allPlayers = this.teamsProvider.allPlayersEdit;
            this.presentToast("Spieler vom Team entfernt");
        });
    }


    presentToast(customMessage: string) {
        let toast = this.toastCtrl.create({
            message: customMessage,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }


    getItemsAvailable(ev) {
        // Reset items back to all of the items
        this.initializePlayers();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1
                    || (item.firstname.toLowerCase().indexOf(val.toLowerCase()) > -1)
                    || (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1));
            })
        }
    }
}