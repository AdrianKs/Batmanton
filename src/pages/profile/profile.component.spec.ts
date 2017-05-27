import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { Utilities } from '../../app/utilities';
import {App, Config, Form, Platform, IonicModule, NavController, ActionSheetController, LoadingController, AlertController, MenuController, Keyboard} from 'ionic-angular';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';
import { Gender } from '../../app/pipes/gender';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import {AuthData} from "../../providers/auth-data";
import {AuthDataMock} from "../../mocks/authDataMock";
import {FormControl} from "@angular/forms";


let component: ProfileComponent;
let fixture: ComponentFixture<ProfileComponent>;

describe("ProfileComponentTest", () => {
  beforeEach(async(() => {
    TestBed
      .overrideComponent(ProfileComponent, {
        set: {
          providers:[
            { provide: AuthData, useClass: AuthDataMock}
          ]
        }
      })
      .configureTestingModule({
      declarations: [ProfileComponent, Teams, Birthday, Gender],
      imports: [IonicModule],
      providers: [NavController, App, Config, Form, Platform, ActionSheetController, LoadingController, AlertController, MenuController, Keyboard,
        {provide: Utilities, useClass: UtilitiesMock}, {provide: AuthData, useClass: AuthDataMock}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('cancelEditProfile', () => {
    component.editProfile();
    component.utilities.userData.firstname = "maximilian";
    component.utilities.userData.lastname = "Testmann";
    component.utilities.userData.email = "mustermann@mail.com";
    component.utilities.userData.birthday = "2000-05-04";
    component.utilities.userData.gender = "f";
    component.utilities.userData.team = "1";
    component.cancelEditProfile();
    expect(component.utilities.userData.firstname).toBe("Max");
    expect(component.utilities.userData.lastname).toBe("Mustermann");
    expect(component.utilities.userData.email).toBe("max.mustermann@mail.com");
    expect(component.utilities.userData.birthday).toBe("1999-01-01");
    expect(component.utilities.userData.gender).toBe("m");
    expect(component.utilities.userData.team).toBe("2");
    expect(component.editMode).toBeFalsy();
  });


  it('elementChanged firstname', () => {
    component.editProfile();
    let inputMock = {
      inputControl: {
        name: "firstname"
      }
    };

    component.profileForm.value.firstname = "maximilian";
    component.elementChanged(inputMock);
    expect(component.firstnameChanged).toBeTruthy();

    component.profileForm.value.firstname = "Max";
    component.elementChanged(inputMock);
    expect(component.firstnameChanged).toBeFalsy();
  });

  it('elementChanged lastname', () => {
    component.editProfile();
    let inputMock = {
      inputControl: {
        name: "lastname"
      }
    };

    component.profileForm.value.lastname = "Testmann";
    component.elementChanged(inputMock);
    expect(component.lastnameChanged).toBeTruthy();

    component.profileForm.value.lastname = "Mustermann";
    component.elementChanged(inputMock);
    expect(component.lastnameChanged).toBeFalsy();
  });

  it('elementChanged email', () => {
    component.editProfile();
    let inputMock = {
      inputControl: {
        name: "email"
      }
    };

    component.profileForm.value.email = "mustermann@mail.com";
    component.elementChanged(inputMock);
    expect(component.emailChanged).toBeTruthy();

    component.profileForm.value.email = "max.mustermann@mail.com";
    component.elementChanged(inputMock);
    expect(component.emailChanged).toBeFalsy();
  });

  it('elementChanged birthday', () => {
    component.editProfile();

    component.birthdaySelectChanged("2011-05-04");
    expect(component.birthdayChanged).toBeTruthy();
    expect(component.relevantTeams.length).toEqual(5);

    component.birthdaySelectChanged("1999-01-01");
    expect(component.birthdayChanged).toBeFalsy();
    expect(component.relevantTeams.length).toEqual(2);
  });

  it('elementChanged gender', () => {
    component.editProfile();

    component.genderSelectChanged("f");
    expect(component.genderChanged).toBeTruthy();

    component.genderSelectChanged("m");
    expect(component.genderChanged).toBeFalsy();
  });

  it('elementChanged team', () => {
    component.editProfile();

    component.teamSelectChanged("1");
    expect(component.teamChanged).toBeTruthy();

    component.teamSelectChanged("2");
    expect(component.teamChanged).toBeFalsy();
  });

  it('startsWithACapital', () => {
    let formControlMock = new FormControl("maximilian");
    expect(component.startsWithACapital(formControlMock)).toBeTruthy();
    formControlMock.setValue("Max");
    expect(component.startsWithACapital(formControlMock)).toBeNull();
  });

  it('isAMail', () => {
    let formControlMock = new FormControl("mustermann.com");
    expect(component.isAMail(formControlMock)).toBeTruthy();
    formControlMock.setValue("max.mustermann@mail.com");
    expect(component.isAMail(formControlMock)).toBeNull();
  });

  // it('is same user', () => {
  //   expect(component.sameUser).toBeTruthy();
  // });
  //
  // it('changed value trainer', () => {
  //   component.player.isTrainer = true;
  //   component.changeValue(null);
  //   expect(component.roleChanged).toBeTruthy();
  // });
  //
  // it('changed value player', () => {
  //   component.player.isPlayer = false;
  //   component.player.isTrainer = false;
  //   component.changeValue(null);
  //   expect(component.roleChanged).toBeFalsy();
  // });
  //
  // it('changed value player and trainer', () => {
  //   component.player.isPlayer = false;
  //   component.player.isTrainer = true;
  //   component.changeValue(null);
  //   expect(component.roleChanged).toBeTruthy();
  // })

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

});
