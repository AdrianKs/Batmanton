import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { CreateMatchdayProviderMock } from '../../mocks/CreateMatchdayProviderMock';
import { MatchTime } from '../../app/pipes/matchTime';
import { Teams } from '../../app/pipes/teams';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, ActionSheetController, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController, ToastController } from 'ionic-angular';

import { CreateMatchdayComponent } from './createMatchday.component';
import { CreateMatchdayProvider } from '../../providers/createMatchday-provider';

let component: CreateMatchdayComponent;
let fixture: ComponentFixture<CreateMatchdayComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * test file for matchday.component.ts. Creates the possibility to run unit tests. 
 */

describe("CreateMatchdayComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(CreateMatchdayComponent, {
            set: {
                providers: [
                    { provide: CreateMatchdayProvider, useClass: CreateMatchdayProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [CreateMatchdayComponent, MatchTime, Teams],
            imports: [IonicModule],
            providers: [NavController, CreateMatchdayProvider, Utilities, ActionSheetController, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController, ToastController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: CreateMatchdayProvider, useClass: CreateMatchdayProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateMatchdayComponent);
        component = fixture.componentInstance;
        component.createMatchdayProvider.setTeams();
        component.createMatchdayProvider.setTemplates();
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    it('fetches the templates', () => {
        component.createMatchdayProvider.setTemplates().then(() => {
            component.dataTemplate = component.createMatchdayProvider.dataTemplate;
            expect(component.dataTemplate).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the teams', () => {
        component.createMatchdayProvider.setTeams().then(() => {
            component.relevantTeams = component.createMatchdayProvider.dataTeam;
            expect(component.relevantTeams).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('creates and shows loading element', () => {
        component.createAndShowLoading();
        expect(component.loading).toBeDefined();
    });

    afterAll(() => {
        fixture.destroy();
        component = null;
    })
})