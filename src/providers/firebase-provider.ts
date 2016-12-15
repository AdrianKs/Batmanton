import firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseProvider{


    items: any[];
    database: any;

    constructor(){
        this.database = firebase.database();
    }

    getItemsOfRefOn(path: string){
        var data = new Array;
        var sample = function(){
            return this.database.ref(path).on('value', function(snapshot){
            return snapshot.val();
        })();

    }
    }

}
