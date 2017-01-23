import {} from 'jasmine';
import {UserManagementComponent} from './userManagement.component';
import { NavController, NavParams } from 'ionic-angular';
import { Utilities } from '../../app/utilities';

let userManagement: UserManagementComponent;
let navController: NavController;
let navParams: NavParams;
let utilities: Utilities;

describe("UserManagementComponentTest", () =>{
    beforeEach(()=>{
        userManagement = new UserManagementComponent(navController, navParams, utilities)
    })

    it('should be initialzied', () =>{
        expect(userManagement).toBeTruthy();
    });
});
