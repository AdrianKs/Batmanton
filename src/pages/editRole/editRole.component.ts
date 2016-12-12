import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
    selector: 'edit-role',
    templateUrl: 'editRole.component.html'
})
export class EditRoleComponent {
    constructor(private navCtrl: NavController) {
    }
}