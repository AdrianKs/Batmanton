/**
 * Created by kochsiek on 08.12.2016.
 */
import { Component, OnInit } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase-provider';
import { Utilities } from '../../app/utilities';
import firebase from 'firebase';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EditPlayerComponent } from './editPlayers.component';


@Component({
    selector: 'create-new-team',
    templateUrl: 'createNewTeam.component.html',
    providers: [FirebaseProvider]
})
export class CreateTeamComponent implements OnInit {


    database: any;
    addTeamForm: any;
    teamName: any;
    maxAlt: any = 0;
    altersBez: any;

    ngOnInit(): void {

    }

    constructor(public navCtrl: NavController,
        public fbP: FirebaseProvider,
        public utilities: Utilities,
        public formBuilder: FormBuilder) {
        this.addTeamForm = formBuilder.group({
            TeamName: ['', Validators.compose([Validators.required])],
            maxAlt: ['', Validators.compose([Validators.required])],
            altersBez: ['', Validators.compose([Validators.required])]
        });
        this.database = firebase.database();
    }


    popToRoot() {
        this.navCtrl.popToRoot();
    }

    proceedProcess() {
        this.teamName = this.addTeamForm.value.TeamName;
        this.maxAlt = this.addTeamForm.value.maxAlt;
        this.altersBez = this.addTeamForm.value.altersBez;
        if(this.altersBez=="Mini"){
            this.altersBez = 1;
        }else{
            this.altersBez = 0;
        }
        this.database.ref('clubs/12/teams/').once('value', snapshot => {
            let lokalTeam = {
                ageLimit: this.maxAlt,
                name: this.teamName,
                type: this.altersBez
            }
            //TEAMS LOKAL IM ARRAY
            let teamArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                teamArray[i] = snapshot.val()[i];
                counter++;
            }
            teamArray.push(lokalTeam);
            firebase.database().ref('clubs/12/').update({
                teams: teamArray
            });
            this.navCtrl.popToRoot();
        });
    }

}
