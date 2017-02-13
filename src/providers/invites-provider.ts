import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class InvitesProvider {

    allPlayers: Array<any>;
    allInvites: Array<any>;
    allMatchdays: Array<any>;

    constructor() {
        this.setPlayers();
    }

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
