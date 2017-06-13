import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class MyGamesProvider {

    dataPlayer: Array<any>;
    dataInvites: Array<any>;
    dataGames: Array<any>;

    constructor() {

    }

    setGames() {
        return firebase.database().ref('clubs/12/matches').once('value', snapshot => {
            let gamesArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                gamesArray[counter] = snapshot.val()[i];
                gamesArray[counter].id = i;
                counter++;
            }
            this.dataGames = gamesArray;
            this.dataGames = _.sortBy(this.dataGames, "time").reverse();
        });
        //return this.dataGames;
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
            this.dataPlayer = playerArray;
            this.dataPlayer = _.sortBy(this.dataPlayer, "lastname");
        })
        //return this.dataPlayer;
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
            this.dataInvites = inviteArray;
        });
        //return this.dataInvites;
    }

}
