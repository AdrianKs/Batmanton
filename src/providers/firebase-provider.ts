import firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseProvider{





    items: any;
    database: any;

    constructor(){
        this.database = firebase.database();
    }

    getItemsOfRefOn(path: string){
        this.database.ref("/clubs/12/teams/").once('value', snapshot => {
      console.log(snapshot.val());
      let teamArray = [];
      let counter = 0;
      for (let i in snapshot.val()) {
        teamArray[counter] = snapshot.val()[i];
        teamArray[counter].id = i;
        counter++;
      }
      this.items = teamArray;
      this.returnItemArray();
    });
    }

    returnItemArray(){
        return this.items;
    }

}
