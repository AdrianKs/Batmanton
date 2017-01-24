/**
 * Created by Sebastian on 20.12.2016.
 */
import {Pipe} from '@angular/core';
import {Utilities} from "../../app/utilities";

@Pipe({
  name: 'player'
})
export class Player {
  foundPlayer: boolean = false;
  constructor(public utilities: Utilities){}

  transform(inputPlayerID) {
    if(inputPlayerID != undefined && this.utilities.allPlayers != undefined){
      for (let i in this.utilities.allPlayers){
        if (inputPlayerID == this.utilities.allPlayers[i].id){
          this.foundPlayer = true;
          return this.utilities.allPlayers[i].lastname + ", " + this.utilities.allPlayers[i].firstname;
        }
      }
      if (this.foundPlayer == false){
        return "Spieler nicht vorhanden."
      }
    }
  }
}
