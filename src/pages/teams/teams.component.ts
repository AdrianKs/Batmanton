/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component } from '@angular/core';
import { ViewTeamComponent} from './viewTeam.component';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'teams.component.html'
})
export class TeamsComponent {

  teams: any[];

  constructor(public navCtrl: NavController) {
    this.initializeTeams();
  }

  initializeTeams(){
    this.teams = [
      {jugendBez: "J1", teamName:"Jugend", path:"pfadZuBild"},
      {jugendBez: "J2", teamName:"Erwachsen", path:"pfadZuBild"},
      {jugendBez: "J3", teamName:"Erwachsen", path:"pfadZuBild"},
      {jugendBez: "J4", teamName:"Jugend", path:"pfadZuBild"}
    ]
  }

  viewTeam(ev, value){
    this.navCtrl.push(ViewTeamComponent, {team: value});
  }

  addTeam(ev, value){
    //Team hinzufügen View aufrufen
  }

  getItems(ev){
    this.initializeTeams();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.teams = this.teams.filter((item) => {
        return (item.teamName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
