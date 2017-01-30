import {Component, ViewChild} from '@angular/core';
import {Nav, Platform, AlertController} from 'ionic-angular';
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

  pages: Array<{ title: string, component: any, icon: string, visible: boolean }>;

  constructor(public platform: Platform, public authData: AuthData, public utilities: Utilities, public alertCtrl: AlertController) {

    this.initializeApp();

    firebase.auth().onAuthStateChanged((user) => {
      //utilities.user = user;

      if (user != undefined) {
        utilities.user = user;
        utilities.setUserData();
        utilities.setPlayers();
        this.checkIfUserDeleted(user.uid);
      }
      if (!user) {
        utilities.user = {};
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
      { title: 'Spieltage', component: MatchdayComponent, icon: "clipboard", visible: true },
      { title: 'Einladungen', component: InvitesComponent, icon: "mail", visible: false},
      { title: 'Mannschaften', component: TeamsComponent, icon: "people", visible: true },
      { title: 'Meine Spiele', component: MyGamesComponent, icon: "ribbon", visible: true },
      { title: 'Benutzerverwaltung', component: UserManagementComponent, icon: "settings", visible: false}
    ];
  }



  initializeApp() {
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

  logout() {
    this.authData.logoutUser();
    this.nav.setRoot(LoginComponent);
  }

  /**
   * This function checks if the user is deleted in the database.
   * If the user is deleted, it will logout the user and show an alert.
   *
   * This function also calls checkForVerification(). So it only checks if user is not deleted.
   *
   * @param userID userID of the user trying to log in.
   */
  checkIfUserDeleted(userID: any): any {
    firebase.database().ref('clubs/12/players/' + userID).once('value')
      .then( user => {
        if(user.val() != null){
          if(!this.utilities.inRegister){
            this.checkForVerification();
          }
        } else {
          this.logout();
          let alert = this.alertCtrl.create({
            title: 'Ihr Account wurde gelöscht',
            message: 'Es scheint so als wäre Ihr Account gelöscht worden. Bitte kontaktieren Sie Ihren Trainer.',
            buttons: [
              {
                text: "Ok",
                handler: () => {

                }
              }
            ]
          });
          alert.present();
        }
      })
  }

  /**
   * This function is called, as soon the App is opened and the user is signed in.
   * If the user´s e-mail address is not verified, an alert will pop up.
   * The alert gives the option to send the verification-mail again.
   *
   * @param user logged-in user, to check if the mail is verified
   */
  checkForVerification() {
    console.log(this.utilities.user);
    if (!this.utilities.user.emailVerified){
      console.log("not verified");
      let confirm = this.alertCtrl.create({
        title: 'Bitte bestätigen Sie Ihre Email Adresse',
        message: 'Bestätigunsmail erneut senden?',
        buttons: [
          {
            text: 'Nein',
            handler: () => {
            }
          },
          {
            text: 'Ja',
            handler: () => {
              this.utilities.user.sendEmailVerification();
            }
          }
        ]
      });
      confirm.present();
    }
  }
}
