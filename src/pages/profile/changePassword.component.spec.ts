import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ChangePasswordComponent } from './changePassword.component';
import { Utilities } from '../../app/utilities';
import {App, Config, Form, Platform, IonicModule, NavController, ActionSheetController, LoadingController, AlertController, MenuController, Keyboard, ToastController} from 'ionic-angular';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import {AuthData} from "../../providers/auth-data";
import {AuthDataMock} from "../../mocks/authDataMock";


let component: ChangePasswordComponent;
let fixture: ComponentFixture<ChangePasswordComponent>;

describe("ChangePasswordComponentTest", () => {
  beforeEach(async(() => {
    TestBed
      .overrideComponent(ChangePasswordComponent, {
        set: {
          providers:[
            { provide: AuthData, useClass: AuthDataMock}
          ]
        }
      })
      .configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [IonicModule],
      providers: [NavController, App, Config, Form, Platform, ActionSheetController, LoadingController, AlertController, MenuController, Keyboard, ToastController,
        {provide: Utilities, useClass: UtilitiesMock}, {provide: AuthData, useClass: AuthDataMock}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('elementChanged passwordOld', () => {
    let inputMock = {
      inputControl: {
        name: "passwordOld"
      }
    };

    component.passwordForm.value.passwordOld = "initial";
    component.elementChanged(inputMock);
    expect(component.passwordOldChanged).toBeTruthy();
  });

  it('elementChanged password', () => {
    let inputMock = {
      inputControl: {
        name: "password"
      }
    };

    component.passwordForm.value.password = "newPassword";
    component.elementChanged(inputMock);
    expect(component.passwordChanged).toBeTruthy();
  });

  it('elementChanged passwordConfirm', () => {
    let inputMock = {
      inputControl: {
        name: "passwordConfirm"
      }
    };

    component.passwordForm.value.passwordConfirm = "newPassword";
    component.elementChanged(inputMock);
    expect(component.passwordConfirmChanged).toBeTruthy();
  });

  it('passwordsAreSame', () => {
    let inputMock = {
      inputControl: {
        name: "password"
      }
    };
    component.passwordForm.value.password = "password 1";
    component.elementChanged(inputMock);
    inputMock.inputControl.name = "passwordConfirm";
    component.passwordForm.value.passwordConfirm = "password 1";
    component.elementChanged(inputMock);
    expect(component.passwordsAreSame).toBeTruthy();

    inputMock.inputControl.name = "password";
    component.passwordForm.value.password = "password 1";
    component.elementChanged(inputMock);
    inputMock.inputControl.name = "passwordConfirm";
    component.passwordForm.value.passwordConfirm = "password 2";
    component.elementChanged(inputMock);
    expect(component.passwordsAreSame).toBeFalsy();
  });

  it('passwordOldIsSame', () => {
    let inputMock = {
      inputControl: {
        name: "password"
      }
    };
    component.passwordForm.value.password = "password 1";
    component.elementChanged(inputMock);
    inputMock.inputControl.name = "passwordOld";
    component.passwordForm.value.passwordOld = "password 1";
    component.elementChanged(inputMock);
    expect(component.passwordOldIsSame).toBeTruthy();

    inputMock.inputControl.name = "password";
    component.passwordForm.value.password = "password 1";
    component.elementChanged(inputMock);
    inputMock.inputControl.name = "passwordOld";
    component.passwordForm.value.passwordOld = "password 2";
    component.elementChanged(inputMock);
    expect(component.passwordOldIsSame).toBeFalsy();
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

});
