import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { ViewTeamComponent } from './viewTeam.component';
import firebase from 'firebase';


@Component({
    templateUrl: 'editPlayers.component.html'
})
export class EditPlayerComponent implements OnInit {

    team: string = "";
    teamId: string = "";
    spielerStatus: string = "chosen";
    allPlayers: any[];
    allPlayersMod: any;
    allPlayersModSearch: any[];
    allPlayersSearch: any[];
    geschlecht: string = "maenner";
    database: any;
    teams: any[];
    playersOfTeamPlaceholder: any;
    playersOfTeam: any;
    playersOfTeamSearch: any;
    ageLimit: any = "";
    playerAdded: boolean = false;
    groupedPlayers: any = [];
    allPlayersG;

    ngOnInit(): void {
        //this.playersOfTeam = [];
        this.database = firebase.database();
    }

    ionViewWillEnter() {
        this.allPlayers = [];
        this.setPlayers();
        /*this.allPlayers = this.utilities.allPlayers;
        this.allPlayersSearch = this.utilities.allPlayers;*/
        //this.addSwitchToPlayers();
        this.teams = this.utilities.allTeams;
        let counter = 0;
        let playerFound = false;
    }

    constructor(
        public nav: NavController,
        public nParam: NavParams,
        public utilities: Utilities,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ) {

        this.playersOfTeam = [];
        //NULL ABFRAGEN EINBAUEN
        this.playersOfTeamPlaceholder = nParam.get("param");
        this.teamId = nParam.get("teamId");
        this.ageLimit = nParam.get("maxAge");
        //this.getPlayers();
        //this.getTeams();
        //this.checkIfUndefined();
    }

    backToEditMode() {
        this.nav.pop();
    }

    setPlayers() {
        firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
            let playerArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                playerArray[counter] = snapshot.val()[i];
                playerArray[counter].id = i;
                counter++;
            }
            this.allPlayers = playerArray;
            //this.groupPlayers(this.allPlayers);
            this.allPlayersSearch = playerArray;
            this.addSwitchToPlayers();
        });
    }

    addSwitchToPlayers() {
        let player;
        let playerOfTeam;
        let teamOfPlayer;
        let anyPlayerAvailable = false;
         for (let i in this.allPlayers) {
             player = this.allPlayers[i];
             teamOfPlayer = player.team;
             if (teamOfPlayer != "") {
                 player.isAdded = true;
             } else {
                 player.isAdded = false;
             }
         }
         this.sortPlayerArray();
         //console.log(this.allPlayers);
        /*for (let i in this.groupedPlayers) {
            for (let y in this.groupedPlayers[i].players) {
                player = this.groupedPlayers[i].players[y];
                teamOfPlayer = player.team;
                if (teamOfPlayer != "") {
                    player.isAdded = true;
                } else {
                    player.isAdded = false;
                }
            }
        }
        this.showOrHideDivider();*/
        //console.log(this.allPlayers);
    }

    showOrHideDivider() {
        let anyPlayerAvailable;
        let player;
        for (let i in this.groupedPlayers){
            anyPlayerAvailable = false;
            for (let y in this.groupedPlayers[i].players) {
               player = this.groupedPlayers[i].players[y];
               if(player.isAdded!=true){
                   this.groupedPlayers[i].add = true;
               }
            }
        }
    }

    initializePlayers() {
        this.allPlayers = this.allPlayersSearch;
        this.playersOfTeam = this.playersOfTeamSearch;
    }

    checkLists(id: any, player: any) {

        let placeHolderArray = this.playersOfTeam;
        let uniqueId = 0;
        this.playersOfTeam = [];
        let playerFound = false;
        for (let i in placeHolderArray) {
            uniqueId = placeHolderArray[i].uniqueId;
            /* console.log("")
             console.log("ID: " + id + " und uniqueId: " + uniqueId);*/
            if (uniqueId == id) {
                playerFound = true;
            }
        }
        if (!playerFound) {
            return false;
            /*this.allPlayers.push(player);
            this.allPlayersSearch.push(player);*/
        } else {
            return true;
        }
    }






    getPlayers() {
        this.database.ref("/clubs/12/players/").once('value', snapshot => {
            let playerArray = [];
            let completePlayerArray = snapshot.val();
            //console.log("Cmplete Player Array");
            //console.log(completePlayerArray);
            let uniqueId = 0;
            let counter = 0;
            for (let i in completePlayerArray) {
                //console.log(i);
                playerArray[counter] = snapshot.val()[i];
                playerArray[counter].uniqueId = i;
                counter++;
            }
            this.allPlayers = playerArray;
            this.allPlayersSearch = playerArray;
            //console.log(this.allPlayers);
        });
    }

    getPlayerArray() {
        return this.allPlayers;
    }

    teamSelectChanged(team: any) {
        //let val = ev.target.value;
        console.log("VALUE: " + team);
        let playersLocal = this.getPlayerArray();
        if (team && team.trim() != '') {
            playersLocal = playersLocal.filter((item1) => {
                return (item1.team.toLowerCase().indexOf(team.toLowerCase()) > -1);
            })
        }
    }

    getTeams(): void {
        firebase.database().ref('clubs/12/teams').once('value', snapshot => {
            let teamArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                teamArray[counter] = snapshot.val()[i];
                teamArray[counter].id = i;
                counter++;
            }
            this.teams = teamArray;
        })
    }


    getItemsTeamName(ev: any) {
        this.initializePlayers();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item1) => {
                return (item1.team.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    getItemsLastName(ev: any) {
        this.initializePlayers();

        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.allPlayers = this.allPlayers.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    addPlayer(p: any) {
        p.isAdded = true;
        console.log(p.id);
        this.utilities.addPlayerToTeam(this.teamId, p.id);

        this.showOrHideDivider();
        this.presentToast("Spieler zum Team hinzugefügt");
    }

    getPlayersOfTeam() {
        this.database.ref("/clubs/12/teams/" + this.teamId + "/players/").once('value', snapshot => {
            this.playersOfTeamPlaceholder = snapshot.val();
            this.checkIfUndefined();
        })
    }

    presentToast(customMessage: string) {
        let toast = this.toastCtrl.create({
            message: customMessage,
            duration: 2000,
            position: "top"
        });
        toast.present();
    }

    checkIfUndefined() {
        for (let i in this.playersOfTeamPlaceholder) {
            let player = this.playersOfTeamPlaceholder[i];
            if (player != undefined && player != null) {
                this.playersOfTeam.push(player);
            }
        }
        this.playersOfTeamSearch = this.playersOfTeam;
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

    getItemsChosen(ev) {
        // Reset items back to all of the items
        this.initializePlayers();

        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.playersOfTeam = this.playersOfTeam.filter((item) => {
                return (item.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    compare(a, b) {
        if (a.lastname < b.lastname)
            return -1;
        if (a.lastname > b.lastname)
            return 1;
        return 0;
    }

    sortPlayerArray(){
        this.allPlayers = this.allPlayers.sort(this.compare);
        console.log(this.allPlayers);
    }

    groupPlayers(players) {
        let sortedPlayers = players.sort(this.compare);
        console.log(sortedPlayers);
        let currentLetter = "";
        let currentPlayers = [];
        let lastname = "";
        let gender = "";
        for (let i in sortedPlayers) {
            lastname = sortedPlayers[i].lastname;
            gender = sortedPlayers[i];
            if (lastname.charAt(0) != currentLetter) {
                currentLetter = lastname.charAt(0);
                let newGroup = {
                    letter: currentLetter,
                    players: [],
                    add: false
                };
                currentPlayers = newGroup.players;
                this.groupedPlayers.push(newGroup);
            }
            currentPlayers.push(sortedPlayers[i]);
        }
        console.log(this.groupedPlayers);

        /*sortedPlayers.forEach((lastname, index) => {
            if(lastname.charAt(0) != currentLetter){
 
                currentLetter = lastname.charAt(0);
 
                let newGroup = {
                    letter: currentLetter,
                    players: []
                };
 
                currentPlayers = newGroup.players;
                this.groupedPlayers.push(newGroup);
            } 
            
        })*/
    }

    presentConfirm(p: any) {

        
            let alert = this.alertCtrl.create({
                title: 'Spieler zu Mannschaft hinzufügen',
                message: 'Wollen Sie den Spieler zur Mannschaft hinzufügen?',
                buttons: [
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Hinzufügen',
                        handler: () => {
                            this.addPlayer(p);
                        }
                    }
                ]

            });
            alert.present();
        




    }


}