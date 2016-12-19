import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MyGamesService {

    playerData: Array<any>;

    constructor(private http: Http) {
        console.log('Task Service Initialized...');
    }

    getPlayers() {
        return this.http.get("https://batmanton-f8643.firebaseio.com/clubs/12/players.json")
            .map(res => res.json());
    }
}