import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { CreateMatchdayProviderMock } from '../../mocks/CreateMatchdayProviderMock';
import { MatchTime } from '../../app/pipes/matchTime';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, ActionSheetController, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { GameDetailsComponent } from './gameDetails.component';
import { CreateMatchdayProvider } from '../../providers/createMatchday-provider';

let gameItem = {
    acceptedPlayers: {
        0: "1111"
    },
    declinedPlayers:{
        0: 2222
    },
    home: true,
    location: {
        street: "Teststrasse 1",
        zipcode: "11111"
    },
    opponent: "Testgegner",
    pendingPlayers:{
        0: "3333"
    },
    team: "10",
    time: "2017-01-01T10:00:00Z"
}

let acceptedArray = {
    0: "1111"
}

let pendingArray = {
    0: "3333"
}

let declinedArray = {
    0: "2222"
}

let component: GameDetailsComponent;
let fixture: ComponentFixture<GameDetailsComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * test file for matchday.component.ts. Creates the possibility to run unit tests. 
 */

describe("GameDetailsComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(GameDetailsComponent, {
            set: {
                providers: [
                    { provide: CreateMatchdayProvider, useClass: CreateMatchdayProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [GameDetailsComponent, MatchTime, Teams, Birthday],
            imports: [IonicModule],
            providers: [NavController, CreateMatchdayProvider, Utilities, ActionSheetController, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController, ToastController, ModalController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: CreateMatchdayProvider, useClass: CreateMatchdayProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(GameDetailsComponent);
        component = fixture.componentInstance;
        component.createMatchdayProvider.setTeams();
        component.createMatchdayProvider.setPlayer(UtilitiesMock, gameItem, acceptedArray, pendingArray, declinedArray);
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    it('fetches the templates', () => {
        component.createMatchdayProvider.setPlayer(UtilitiesMock, gameItem, acceptedArray, pendingArray, declinedArray).then(() => {
            component.playerArray = component.createMatchdayProvider.playerArray;
            expect(component.playerArray).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the teams', () => {
        component.createMatchdayProvider.setTeams().then(() => {
            component.teamArray = component.createMatchdayProvider.dataTeam;
            expect(component.teamArray).toBeDefined();
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