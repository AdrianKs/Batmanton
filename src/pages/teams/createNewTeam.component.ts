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


@Component({
    selector: 'create-new-team',
    templateUrl: 'createNewTeam.component.html',
    providers: [FirebaseProvider]
})
export class CreateTeamComponent implements OnInit {


    database: any;
    addTeamForm : any;
    teamName: any;
    maxAlt: any = 0;
    altersBez: string = "";

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

    addTeam(){
        this.teamName = this.addTeamForm.value.TeamName;
        this.maxAlt = this.addTeamForm.value.maxAlt;
        this.altersBez = this.addTeamForm.value.altersBez;
        console.log(this.teamName + ", " + this.maxAlt + ", " +this.altersBez );
    }

}
