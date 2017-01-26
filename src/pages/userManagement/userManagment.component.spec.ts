import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UserManagementComponent } from './userManagement.component';
import { App, Config, NavParams, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { UtilitiesMock } from '../../mocks/utilitiesMock';

let component: UserManagementComponent;
let fixture: ComponentFixture<UserManagementComponent>;
let de: DebugElement;
let el: HTMLElement;

describe("UserManagementComponentTest", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserManagementComponent, Teams, Birthday],
            imports: [IonicModule],
            providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, GestureController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManagementComponent);
        component = fixture.componentInstance;
        component.ionViewDidEnter();
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });

    it('fill list for Player', () => {
        expect(component.dataPlayer).toBeDefined();
    });

    it('fill list for search-function', () => {
        expect(component.dataPlayerSearch).toBeDefined();
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    //de = fixture.debugElement.query(By.css('h1'));
    //el = de.nativeElement;

});



