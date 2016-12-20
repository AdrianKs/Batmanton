import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import firebase from 'firebase';



@Injectable()
export class UserManagementService {

    playerData: any;

    constructor(private http: Http) {
        console.log('Task Service Initialized...');
        this.getPlayers2();
    }


    getPlayers2() {
        var promise = firebase.database().ref('clubs/12/players').once('value');
        return promise;
    }

    getPlayers(callback) {
        firebase.database().ref('clubs/12/players').on('value', (snap) => {
            //this.playerData = snap.val();

            let playerArray = [];
            let counter = 0;
            for (let i in snap.val()) {
                playerArray[counter] = snap.val()[i];
                playerArray[counter].id = i;
                counter++;
            }
            this.playerData = playerArray;

            callback(this.playerData);
        });
    }
}


/**
 * fbGetData(callback) {
    firebase.database().ref('/path/to/data').on('value',(snapshot) => {
        this.data = snapshot.val();
        callback(this.data);
    })
}

fbGetData(data => console.log(data));
 * 
 * 
 * 
 * 
 */