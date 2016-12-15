import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

@Injectable()
export class UserManagementService {
    public fireAuth: any;
    public playerData: any;

    constructor(private http: Http) {
        console.log('Task Service Initialized...');
        this.fireAuth = firebase.auth();
        this.playerData = firebase.database().ref('clubs/12/players');
        console.log("PlayerData " + this.playerData)
    }

    /*getTasks() {
        return this.http.get("https://batmanton-f8643.firebaseio.com/clubs/12/players.json")
            .map(res => res.json());
    }*/
}