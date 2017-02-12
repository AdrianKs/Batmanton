/**
 * Created by kochsiek on 01.02.2017.
 */
import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Utilities } from '../../app/utilities';
import {
  App, Config, Form, IonicModule, Keyboard, MenuController, Platform,
  NavController, AlertController, LoadingController
} from 'ionic-angular';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import {AuthData} from "../../providers/auth-data";
import {AuthDataMock} from "../../mocks/authDataMock";


let component: RegisterComponent;
let fixture: ComponentFixture<RegisterComponent>;

describe("RegisterComponentTest", () => {
  beforeEach(async(() => {
    TestBed
      .overrideComponent(RegisterComponent, {
        set: {
          providers:[
            { provide: AuthData, useClass: AuthDataMock}
          ]
        }
      })
      .configureTestingModule({
      declarations: [RegisterComponent],
      imports: [IonicModule],
      providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, AlertController, LoadingController,
        { provide: Utilities, useClass: UtilitiesMock },
        { provide: AuthData, useClass: AuthDataMock}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('passwordMatches', () => {
    let passwordGroup = component.signupForm.controls.passwords;
    passwordGroup.controls.password._value = "testPassword";
    passwordGroup.controls.passwordConfirm._value = "testPassword";
    expect(component.matchPassword(passwordGroup)).toBeNull();

    passwordGroup.controls.passwordConfirm._value = "testPassword2";
    expect(component.matchPassword(passwordGroup)).toBeTruthy();

    passwordGroup.controls.password._value = "testPassword2";
    passwordGroup.controls.passwordConfirm._value = "testPassword";
    expect(component.matchPassword(passwordGroup)).toBeTruthy();
  });

  it('nameStartsWithCapital', () => {
    let firstnameControl = component.signupForm.controls.firstname;
    firstnameControl._value = "Testuser";
    expect(component.startsWithACapital(firstnameControl)).toBeNull();

    firstnameControl._value = "testuser";
    expect(component.startsWithACapital(firstnameControl)).toBeTruthy();
  });

  it('is a mail', () => {
    let emailControl = component.signupForm.controls.email;
    emailControl._value = "test@mail.com";
    expect(component.isAMail(emailControl)).toBeNull();

    emailControl._value = "testmail.com";
    expect(component.startsWithACapital(emailControl)).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

});

