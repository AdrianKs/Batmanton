import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutComponent} from '../pages/about/about.component';
import {InvitesComponent} from '../pages/invites/invites.component';
import {InvitesMatchdayComponent} from '../pages/invites/invitesmatchday.component';
import {LoginComponent} from '../pages/login/login.component';
import {MatchdayComponent} from '../pages/matchday/matchday.component';
import {CreateMatchdayComponent} from '../pages/matchday/createMatchday.component';
import {TemplateComponent} from '../pages/matchday/template.component';
import {AddTeamToMatchdayComponent} from '../pages/matchday/addTeamToMatchday.component';
import {MyGamesComponent} from '../pages/myGames/myGames.component';
import {GameDetailsComponent} from '../pages/gameDetails/gameDetails.component';
import {PlayerComponent} from '../pages/gameDetails/player.component'
import {ProfileComponent} from '../pages/profile/profile.component';
import {ChangePasswordComponent} from '../pages/profile/changePassword.component';
import {RegisterComponent} from '../pages/register/register.component';
import {UserManagementComponent} from '../pages/userManagement/userManagement.component';
import {ResetPasswordComponent} from '../pages/resetPassword/resetPassword.component';
import {EditRoleComponent} from '../pages/editRole/editRole.component';
import {TeamsComponent} from '../pages/teams/teams.component';
import {SelectProfilePictureComponent} from "../pages/selectProfilePicture/selectProfilePicture.component";
import {ViewTeamComponent} from '../pages/teams/viewTeam.component';
//import {PopoverPage} from '../pages/teams/popover.component'; VERALTET UND NICHT MEHR GEBRAUCHT
//import {EditTeamComponent} from '../pages/teams/editTeam.component'; VERALTET UND NICHT MEHR GEBRAUCHT
import {EditPlayerComponent} from '../pages/teams/editPlayers.component';
import {CreateTeamComponent} from '../pages/teams/createNewTeam.component';
import {Birthday} from './pipes/birthday';
import {Gender} from './pipes/gender';
import {Player} from './pipes/player';
import {Teams} from './pipes/teams';
import {MatchTime} from './pipes/matchTime';
import {ClubPasswordComponent} from "../pages/club-password/clubPassword.component";

@NgModule({
  declarations: [
    MyApp,
    AboutComponent,
    InvitesComponent,
    InvitesMatchdayComponent,
    LoginComponent,
    MatchdayComponent,
    CreateMatchdayComponent,
    TemplateComponent,
    AddTeamToMatchdayComponent,
    MyGamesComponent,
    GameDetailsComponent,
    PlayerComponent,
    ProfileComponent,
    ChangePasswordComponent,
    RegisterComponent,
    UserManagementComponent,
    ResetPasswordComponent,
    EditRoleComponent,
    TeamsComponent,
    SelectProfilePictureComponent,
    ViewTeamComponent,
    //PopoverPage,
    //EditTeamComponent,
    EditPlayerComponent,
    CreateTeamComponent,
    //Pipes
    Birthday,
    Gender,
    Player,
    Teams,
    MatchTime,
    ClubPasswordComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutComponent,
    InvitesComponent,
    InvitesMatchdayComponent,
    LoginComponent,
    MatchdayComponent,
    CreateMatchdayComponent,
    TemplateComponent,
    AddTeamToMatchdayComponent,
    MyGamesComponent,
    GameDetailsComponent,
    PlayerComponent,
    ProfileComponent,
    ChangePasswordComponent,
    RegisterComponent,
    UserManagementComponent,
    ResetPasswordComponent,
    EditRoleComponent,
    TeamsComponent,
    SelectProfilePictureComponent,
    ViewTeamComponent,
    //PopoverPage,
    //EditTeamComponent,
    EditPlayerComponent,
    CreateTeamComponent,
    ClubPasswordComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
