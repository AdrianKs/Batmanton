//todo
//Spiel erstellen-Screen erstellen
//Datenbankveränderung integrieren
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MatchdayService } from '../../providers/matchday.service';
import firebase from 'firebase';

@Component({
  selector: 'page-createMatchday',
  templateUrl: 'createMatchday.component.html',
  providers: [MatchdayService]
})

export class CreateMatchdayComponent implements OnInit {

  ngOnInit() {

  }
  
  constructor(public navCtrl: NavController, private MatchdayService: MatchdayService) {
    
  }
}