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
  transform(inputTeam) {
    if(inputTeam != undefined && this.utilities.allTeams != undefined){
      if(inputTeam === "0"){
        return "keine Mannschaft"
      }
      let teamName = "";
      this.utilities.allTeams.forEach(function (team){
        if(team.id ===  inputTeam){
          teamName = team.name;
          return false;
        }
      });
      return teamName;
    }
  }
}
