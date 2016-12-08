import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutComponent } from '../pages/about/about.component';
import { InvitesComponent } from '../pages/invites/invites.component';
import { LoginComponent } from '../pages/login/login.component';
import { MatchdayComponent } from '../pages/matchday/matchday.component';
import { MyGamesComponent } from '../pages/myGames/myGames.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { RegisterComponent } from '../pages/register/register.component';
import { UserManagementComponent } from '../pages/userManagement/userManagement.component';

@NgModule({
  declarations: [
    MyApp,
    AboutComponent,
    InvitesComponent,
    LoginComponent,
    MatchdayComponent,
    MyGamesComponent,
    ProfileComponent,
    RegisterComponent,
    UserManagementComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutComponent,
    InvitesComponent,
    LoginComponent,
    MatchdayComponent,
    MyGamesComponent,
    ProfileComponent,
    RegisterComponent,
    UserManagementComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
