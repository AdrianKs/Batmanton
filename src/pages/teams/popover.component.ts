import { Component } from '@angular/core';

import { ViewController, NavParams, NavController } from 'ionic-angular';

import { EditTeamComponent } from './editTeam.component';

@Component({
    template: `
    <ion-list>
      <ion-list-header>Optionen</ion-list-header>
      <button ion-item (click)="editPage()">Bearbeiten</button>
    </ion-list>
  `
})
export class PopoverPage {
    data: any[];
    constructor(public viewCtrl: ViewController, public navP: NavParams, public navC: NavController) {
        this.data = navP.get("value");
    }

    editPage() {
        this.navC.push(EditTeamComponent, {
            value: this.data
        })
    }
}