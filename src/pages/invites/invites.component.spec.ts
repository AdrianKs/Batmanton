import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { InvitesProviderMock } from '../../mocks/invitesProviderMock';
import { MatchTime } from '../../app/pipes/matchTime';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';

import { InvitesComponent } from './invites.component';
import { InvitesProvider } from '../../providers/invites-provider';

let component: InvitesComponent;
let fixture: ComponentFixture<InvitesComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * test file for invites.component.ts. Creates the possibility to run unit tests. 
 */

describe("InvitesComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(InvitesComponent, {
            set: {
                providers: [
                    { provide: InvitesProvider, useClass: InvitesProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [InvitesComponent, MatchTime],
            imports: [IonicModule],
            providers: [NavController, InvitesProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: InvitesProvider, useClass: InvitesProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(InvitesComponent);
        component = fixture.componentInstance;
        component.invitesProvider.setMatchdays();
        component.invitesProvider.setInvites();
        component.invitesProvider.setPlayers();
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    it('fetches the invites', () => {
        component.invitesProvider.setInvites().then(() => {
            component.allInvites = component.invitesProvider.allInvites;
            expect(component.allInvites).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the players', () => {
        component.invitesProvider.setPlayers().then(() => {
            component.allPlayers = component.invitesProvider.allPlayers;
            expect(component.allPlayers).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the matchdays', () => {
        component.invitesProvider.setMatchdays().then(() => {
            component.allMatchdays = component.invitesProvider.allMatchdays;
            expect(component.allMatchdays).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('counts invite states', () => {
        component.allInvites = component.invitesProvider.allInvites;
        component.allMatchdays = component.invitesProvider.allMatchdays;
        for (let i of component.allMatchdays) {
            expect(component.countStates(i)).toBeDefined();
        }
    });

    it('creates and shows loading element', () => {
        component.showLoadingElement();
        expect(component.loadingElement).toBeDefined();
    });

    it("gets first four picture URLs", () => {
        component.allInvites = component.invitesProvider.allInvites;
        component.allMatchdays = component.invitesProvider.allMatchdays;
        component.allPlayers = component.invitesProvider.allPlayers;
        for (let i of component.allMatchdays) {
            let urls = component.getFirstFourPicUrls(i);
            expect(urls).toBeDefined();
        }

    })

    afterAll(() => {
        fixture.destroy();
        component = null;
    })
})