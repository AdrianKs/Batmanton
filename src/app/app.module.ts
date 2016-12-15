import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutComponent } from '../pages/about/about.component';
import { InvitesComponent } from '../pages/invites/invites.component';
import { InvitesMatchdayComponent } from '../pages/invites/invitesmatchday.component';
import { LoginComponent } from '../pages/login/login.component';
import { MatchdayComponent } from '../pages/matchday/matchday.component';
import { MyGamesComponent } from '../pages/myGames/myGames.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { RegisterComponent } from '../pages/register/register.component';
import { UserManagementComponent } from '../pages/userManagement/userManagement.component';
import { ResetPasswordComponent } from '../pages/resetPassword/resetPassword.component';
import { EditRoleComponent } from '../pages/editRole/editRole.component';
import { TeamsComponent } from '../pages/teams/teams.component';
<<<<<<< HEAD
import {SelectProfilePictureComponent} from "../pages/selectProfilePicture/selectProfilePicture.component";
import {Birthday} from './pipes/birthday'
import {Gender} from './pipes/gender'
import { ViewTeamComponent} from '../pages/teams/viewTeam.component';
import { PopoverPage } from '../pages/teams/popover.component';
import { EditTeamComponent } from '../pages/teams/editTeam.component';
<<<<<<< HEAD
=======
import { ViewTeamComponent} from '../pages/teams/viewTeam.component';
>>>>>>> Basisfunktionalität TeamComponent
=======
>>>>>>> Weiter Funktionalitäten zu ViewTeam und EditTeam hinzugefügt

@NgModule({
  declarations: [
    MyApp,
    AboutComponent,
    InvitesComponent,
    InvitesMatchdayComponent,
    LoginComponent,
    MatchdayComponent,
    MyGamesComponent,
    ProfileComponent,
    RegisterComponent,
    UserManagementComponent,
    ResetPasswordComponent,
    EditRoleComponent,
    TeamsComponent,
<<<<<<< HEAD
<<<<<<< HEAD
    SelectProfilePictureComponent,
    ViewTeamComponent,
    PopoverPage,
    EditTeamComponent,
    //Pipes
    Birthday,
    Gender
=======
    ViewTeamComponent
>>>>>>> Basisfunktionalität TeamComponent
=======
    ViewTeamComponent,
    PopoverPage,
    EditTeamComponent
>>>>>>> Weiter Funktionalitäten zu ViewTeam und EditTeam hinzugefügt
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
    MyGamesComponent,
    ProfileComponent,
    RegisterComponent,
    UserManagementComponent,
    ResetPasswordComponent,
    EditRoleComponent,
    TeamsComponent,
<<<<<<< HEAD
<<<<<<< HEAD
    SelectProfilePictureComponent,
    ViewTeamComponent,
    PopoverPage,
    EditTeamComponent
=======
    ViewTeamComponent
>>>>>>> Basisfunktionalität TeamComponent
=======
    ViewTeamComponent,
    PopoverPage,
    EditTeamComponent
>>>>>>> Weiter Funktionalitäten zu ViewTeam und EditTeam hinzugefügt
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
