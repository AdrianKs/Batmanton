/**
 * Created by kochsiek on 02.02.2017.
 */
import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Utilities } from '../../app/utilities';
import {
  App, Config, Form, IonicModule, Keyboard, MenuController, Platform,
  NavController, AlertController, LoadingController
} from 'ionic-angular';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import {AuthData} from "../../providers/auth-data";
import {AuthDataMock} from "../../mocks/authDataMock";
import {ResetPasswordComponent} from "./resetPassword.component";


let component: ResetPasswordComponent;
let fixture: ComponentFixture<ResetPasswordComponent>;

describe("ResetPasswordComponentTest", () => {
  beforeEach(async(() => {
    TestBed
      .overrideComponent(ResetPasswordComponent, {
        set: {
          providers:[
            { provide: AuthData, useClass: AuthDataMock}
          ]
        }
      })
      .configureTestingModule({
        declarations: [ResetPasswordComponent],
        imports: [IonicModule],
        providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, AlertController, LoadingController,
          { provide: Utilities, useClass: UtilitiesMock },
          { provide: AuthData, useClass: AuthDataMock}]
      }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

});
