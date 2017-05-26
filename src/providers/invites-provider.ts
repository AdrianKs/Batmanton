import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class InvitesProvider {

    allPlayers: Array<any>;
    allInvites: Array<any>;
    allMatchdays: Array<any>;

    /**
     * Constructor. Initializes player information.   
     */
    constructor() {
        this.setPlayers();
    }

    /**
     * Reads the latest matchday data from the database and makes it available for use within the app.
     */
    setMatchdays() {
        return firebase.database().ref('clubs/12/matches').once('value', snapshot => {
            let matchdayArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                matchdayArray[counter] = snapshot.val()[i];
                matchdayArray[counter].id = i;
                counter++;
            }
            this.allMatchdays = matchdayArray;
        })
    }

    /**
     * Reads the latest player data from the database and makes it available for use within the app.
     */
    setPlayers() {
        return firebase.database().ref('clubs/12/players').once('value').then((snapshot) => {
            let playerArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                playerArray[counter] = snapshot.val()[i];
                playerArray[counter].id = i;
                counter++;
            }
            this.allPlayers = playerArray;
            this.allPlayers = _.sortBy(this.allPlayers, "lastname");
        });
    }

    /**
     * Reads the latest invite data from the database and makes it available for use within the app.
     */
    setInvites() {
        return firebase.database().ref('clubs/12/invites').once('value', snapshot => {
            let inviteArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                inviteArray[counter] = snapshot.val()[i];
                inviteArray[counter].id = i;
                counter++;
            }
            this.allInvites = inviteArray;
        })
    }
}
