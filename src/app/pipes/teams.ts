/**
 * Created by Sebastian on 20.12.2016.
 */
import {Pipe} from '@angular/core';
import {allTeams} from "../../app/globalVars";

@Pipe({
  name: 'teams'
})
export class Teams {
  teams = allTeams;
  transform(inputTeam) {
    if(inputTeam != undefined){
      if(inputTeam === "0"){
        return "keine Mannschaft"
      }
      let teamName = "";
      allTeams.forEach(function (team){
        if(team.id ===  inputTeam){
          teamName = team.name;
          return false;
        }
      });
      return teamName;
    }
  }
}
