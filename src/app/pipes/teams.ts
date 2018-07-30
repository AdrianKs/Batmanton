/**
 * Created by Sebastian on 20.12.2016.
 */
import {Pipe} from '@angular/core';
import {Utilities} from "../../app/utilities";

@Pipe({
  name: 'teams'
})
export class Teams {
  constructor(public utilities: Utilities){}
  transform(inputTeamID) {
    if(inputTeamID != undefined && this.utilities.allTeamsVal != undefined){
      if(inputTeamID === "0" || inputTeamID === "" || inputTeamID === 0){
        return "keine Mannschaft"
      }else{
        console.log(this.utilities.allTeamsVal);
        if(this.utilities.allTeamsVal[inputTeamID].name!=undefined){
        return this.utilities.allTeamsVal[inputTeamID].name;
        }else{
          //Basic errorhandling
          return "placeholder"
        }
      }
    }
  }
}
