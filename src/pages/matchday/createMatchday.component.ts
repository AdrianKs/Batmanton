//todo
//Spiel erstellen-Screen erstellen
//Datenbankveränderung integrieren
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';
import {Utilities} from "../../app/utilities";

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [MatchdayService]
})

export class CreateMatchdayComponent implements OnInit {
  team: string = '';
  relevantTeams = this.Utilities.allTeams;
  teamChanged: boolean = false;
  dayChanged: boolean = false;

  ngOnInit() {

  }
  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService, private Utilities: Utilities) {
    
  }

  teamSelectChanged(input) {
    this.team = input;
    this.teamChanged = true;
  }

  daySelectChanged() {
    this.dayChanged = true;
  }
}