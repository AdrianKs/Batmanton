import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { MyGamesProviderMock } from '../../mocks/MyGamesProviderMock';
import { MatchTime } from '../../app/pipes/matchTime';
import { Teams } from '../../app/pipes/teams';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';

import { MyGamesComponent } from './myGames.component';
import { MyGamesProvider } from '../../providers/myGames-provider';

let component: MyGamesComponent;
let fixture: ComponentFixture<MyGamesComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * test file for matchday.component.ts. Creates the possibility to run unit tests. 
 */

describe("MyGamesComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(MyGamesComponent, {
            set: {
                providers: [
                    { provide: MyGamesProvider, useClass: MyGamesProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [MyGamesComponent, MatchTime, Teams],
            imports: [IonicModule],
            providers: [NavController, MyGamesProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: MyGamesProvider, useClass: MyGamesProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(MyGamesComponent);
        component = fixture.componentInstance;
        component.myGamesProvider.setGames();
        component.myGamesProvider.setInvites();
        component.myGamesProvider.setPlayers();
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    it('fetches the invites', () => {
        component.myGamesProvider.setInvites().then(() => {
            component.dataInvites = component.myGamesProvider.dataInvites;
            expect(component.dataInvites).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the games', () => {
        component.myGamesProvider.setGames().then(() => {
            component.dataGames = component.myGamesProvider.dataGames;
            expect(component.dataGames).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the players', () => {
        component.myGamesProvider.setPlayers().then(() => {
            component.dataPlayer = component.myGamesProvider.dataPlayer;
            expect(component.dataPlayer).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('creates and shows loading element', () => {
        component.createAndShowLoading();
        expect(component.loading).toBeDefined();
    });

    it("gets first four picture URLs", () => {
        component.dataInvites = component.myGamesProvider.dataInvites;
        component.dataGames = component.myGamesProvider.dataGames;
        for (let i of component.dataGames) {
            let urls = component.getFirstFourPicUrls(i);
            expect(urls).toBeDefined();
        }

    })

    afterAll(() => {
        fixture.destroy();
        component = null;
    })
})