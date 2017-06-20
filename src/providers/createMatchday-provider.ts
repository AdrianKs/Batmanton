import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class CreateMatchdayProvider {

    dataTemplate: Array<any>;
    dataTeam: Array<any>;
    playerArray: Array<any>;
    counter: any;

    constructor() {

    }

    setTemplates() {
        return firebase.database().ref('clubs/12/templates').once('value', snapshot => {
            let templateArray = [];
            this.counter = 0;
            for (let i in snapshot.val()) {
                templateArray[this.counter] = snapshot.val()[i];
                templateArray[this.counter].id = i;
                this.counter++;
            }
            this.dataTemplate = templateArray;
            this.dataTemplate = _.sortBy(this.dataTemplate, "club");
        });
    }

    setTeams() {
        return firebase.database().ref('clubs/12/teams').once('value', snapshot => {
            let teamArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                teamArray[counter] = snapshot.val()[i];
                teamArray[counter].id = i;
                counter++;
            }
            this.dataTeam = teamArray;
        });
    }

    setPlayer(Utilities, gameItem, acceptedArray, pendingArray, declinedArray) {
        return firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
        let playerArray = [];
        let counter = 0;
        for (let i in snapshot.val()) {
            playerArray[counter] = snapshot.val()[i];
            playerArray[counter].id = i;
            playerArray[counter].age = Utilities.calculateAge(snapshot.val()[i].birthday);
            playerArray[counter].accepted = false;
            playerArray[counter].pending = false;
            playerArray[counter].declined = false;
            playerArray[counter].deleted = false;
            if (playerArray[counter].team == gameItem.team){
            playerArray[counter].isMainTeam = true;
            } else {
            playerArray[counter].isMainTeam = false;
            }
            if (gameItem.acceptedPlayers){
            for (let i in gameItem.acceptedPlayers){
                if (gameItem.acceptedPlayers[i] == playerArray[counter].id){
                playerArray[counter].accepted = true;
                }
            }
            }
            if (gameItem.pendingPlayers){
            for (let i in gameItem.pendingPlayers){
                if (gameItem.pendingPlayers[i] == playerArray[counter].id){
                playerArray[counter].pending = true;
                }
            }
            }
            if (gameItem.declinedPlayers){
            for (let i in gameItem.declinedPlayers){
                if (gameItem.declinedPlayers[i] == playerArray[counter].id){
                playerArray[counter].declined = true;
                }
            }
            }
            counter++;
        }
        this.playerArray = playerArray;
        this.playerArray = _.sortBy(this.playerArray, "lastname");
        if (gameItem.acceptedPlayers){
            for (let i in gameItem.acceptedPlayers){
            acceptedArray[i]=gameItem.acceptedPlayers[i];
            }
        }
        if (gameItem.pendingPlayers){
            for (let i in gameItem.pendingPlayers){
            pendingArray[i]=gameItem.pendingPlayers[i];
            }
        }
        if (gameItem.declinedPlayers){
            for (let i in gameItem.declinedPlayers){
            declinedArray[i]=gameItem.declinedPlayers[i];
            }
        }
        });
    }
}
