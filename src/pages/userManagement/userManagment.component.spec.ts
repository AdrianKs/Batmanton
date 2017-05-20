import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UserManagementComponent } from './userManagement.component';
import { App, Config, NavParams, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController, AlertController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { UtilitiesMock } from '../../mocks/utilitiesMock';

/*
 * Test-File for UserManagementComponent
 */

let component: UserManagementComponent;
let fixture: ComponentFixture<UserManagementComponent>;
let de: DebugElement;
let el: HTMLElement;

describe("UserManagementComponentTest", () => {
    let mockLoadingController;

    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);

        TestBed.configureTestingModule({
            declarations: [UserManagementComponent, Teams, Birthday],
            imports: [IonicModule],
            providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, AlertController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManagementComponent);
        component = fixture.componentInstance;
        component.dataPlayer = component.utilities.allPlayers;
        component.dataPlayerSearch = component.dataPlayer;
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

    it('count players', () => {
        component.checkPlayers();
        expect(component.countMan == 3 && component.countWoman == 3).toBeTruthy()
    });

    it('count platform', ()=>{
        component.checkPlatform();
        expect(component.countIos == 4 && component.countAndroid == 2).toBeTruthy();
    })

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    //de = fixture.debugElement.query(By.css('h1'));
    //el = de.nativeElement;

});



