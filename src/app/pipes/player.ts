/**
 * Created by Sebastian on 20.12.2016.
 */
import {Pipe} from '@angular/core';
import {Utilities} from "../../app/utilities";

@Pipe({
  name: 'player'
})
export class Player {
  constructor(public utilities: Utilities){}
  transform(inputPlayerID) {
    if(inputPlayerID != undefined && this.utilities.allPlayers != undefined){
      if(inputPlayerID === "0"){
        return "Spieler existiert nicht."
      }else{
        return this.utilities.allPlayers[10].firstname;
      }
    }
  }
}
