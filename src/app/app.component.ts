import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {AboutComponent} from '../pages/about/about.component';
import {InvitesComponent} from '../pages/invites/invites.component';
import {MatchdayComponent} from '../pages/matchday/matchday.component';
import {MyGamesComponent} from '../pages/myGames/myGames.component';
import {ProfileComponent} from '../pages/profile/profile.component';
import {UserManagementComponent} from '../pages/userManagement/userManagement.component';
import { LoginComponent } from "../pages/login/login.component";
import {TeamsComponent} from "../pages/teams/teams.component";
import firebase from 'firebase';
import { firebaseConfig } from "./firebaseAppData";
import { setUser } from "./globalVars";
import { AuthData } from '../providers/auth-data';
import {Utilities} from './utilities';

firebase.initializeApp(firebaseConfig);

@Component({
  templateUrl: 'app.html',
  providers: [AuthData, Utilities]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  aboutPage: any = {
    title: "About",
    component: AboutComponent
  }

  myProfilePage: any = {
    title: "Mein Profil",
    component: ProfileComponent
  }

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, public authData: AuthData, public utilities: Utilities) {

    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      utilities.user = user;
      if (user != undefined) {
        utilities.setUserData();
      }
      if (!user) {
        this.rootPage = LoginComponent;
      } else {
        if(this.nav.getActive() == undefined){
          this.rootPage = MatchdayComponent;
        }
      }
    });

    utilities.setTeams();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Spieltage', component: MatchdayComponent, icon: "clipboard" },
      { title: 'Einladungen', component: InvitesComponent, icon: "mail" },
      { title: 'Mannschaften', component: TeamsComponent, icon: "people" },
      { title: 'Meine Spiele', component: MyGamesComponent, icon: "ribbon" },
      { title: 'Benutzerverwaltung', component: UserManagementComponent, icon: "settings" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

      window["plugins"].OneSignal
        .startInit("c72ec221-4425-4844-83fe-288ffd22a55a", "917483863301")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.authData.logoutUser();
    this.nav.setRoot(LoginComponent);
  }
}
