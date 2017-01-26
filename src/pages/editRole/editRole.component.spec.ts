import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { EditRoleComponent } from './editRole.component';
import { Utilities } from '../../app/utilities';
import {
    App, Config, Form, IonicModule, Keyboard, MenuController, Platform,
    NavController, NavParams, ToastController, AlertController
} from 'ionic-angular';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { UtilitiesMock } from '../../mocks/utilitiesMock';

let player = {
    birthday: "",
    email: "",
    firstname: "",
    gender: "",
    isPlayer: "",
    isTrainer: "",
    lastname: "",
    picUrl: "",
    pushId: "",
    state: 0,
    team: "16"
}

let component: EditRoleComponent;
let fixture: ComponentFixture<EditRoleComponent>;

describe("EditRoleComponentTest", () => {
    NavParamsMock.setParams(player);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditRoleComponent, Teams, Birthday],
            imports: [IonicModule],
            providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, ToastController, AlertController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditRoleComponent);
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
