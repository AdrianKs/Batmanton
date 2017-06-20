import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { MyGamesProviderMock } from '../../mocks/MyGamesProviderMock';
import { MatchTime } from '../../app/pipes/matchTime';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';
import { Gender } from '../../app/pipes/gender';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';

import { PlayerComponent } from './player.component';
import { MyGamesProvider } from '../../providers/myGames-provider';

let component: PlayerComponent;
let fixture: ComponentFixture<PlayerComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * test file for matchday.component.ts. Creates the possibility to run unit tests. 
 */

describe("PlayerComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(PlayerComponent, {
            set: {
                providers: [
                    { provide: MyGamesProvider, useClass: MyGamesProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [PlayerComponent, MatchTime, Teams, Birthday, Gender],
            imports: [IonicModule],
            providers: [NavController, MyGamesProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: MyGamesProvider, useClass: MyGamesProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerComponent);
        component = fixture.componentInstance;
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    afterAll(() => {
        fixture.destroy();
        component = null;
    })
})