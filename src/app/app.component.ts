import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { AboutComponent } from '../pages/about/about.component';
import { InvitesComponent } from '../pages/invites/invites.component';
import { MatchdayComponent } from '../pages/matchday/matchday.component';
import { MyGamesComponent } from '../pages/myGames/myGames.component';
import { UserManagementComponent } from '../pages/userManagement/userManagement.component';
import {LoginComponent} from "../pages/login/login.component";
import { TeamsComponent } from "../pages/teams/teams.component";
import firebase from 'firebase';
import {firebaseConfig} from "./firebaseAppData";


firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MatchdayComponent;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {


    this.initializeApp2();

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = LoginComponent;
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Spieltage', component: MatchdayComponent },
      { title: 'Einladungen', component: InvitesComponent },
      { title: 'Mannschaften', component: TeamsComponent},
      { title: 'Meine Spiele', component: MyGamesComponent },
      { title: 'Benutzerverwaltung', component: UserManagementComponent },
      { title: 'About', component: AboutComponent }
    ];

  }

  initializeApp2() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut(){
    firebase.auth().signOut();
    this.nav.setRoot(LoginComponent);
    //this.nav.setRoot(LoginComponent);
  }
}
