import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Utilities } from '../../app/utilities';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { InvitesProviderMock } from '../../mocks/invitesProviderMock';
import { Birthday } from '../../app/pipes/birthday';
import { Teams } from '../../app/pipes/teams';

import { NavParamsMock } from '../../mocks/navParamsMock';

import { App, Config, NavParams, ToastController, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';

import { InvitesMatchdayComponent } from './invitesmatchday.component';
import { InvitesProvider } from '../../providers/invites-provider';

let component: InvitesMatchdayComponent;
let fixture: ComponentFixture<InvitesMatchdayComponent>;

let de: DebugElement;
let el: HTMLElement;

/**
 * Testfile for invitesmatchday.component.spec.ts 
 * Provides the possibility to run unit tests. 
 */

describe("InvitesMatchdayComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(InvitesMatchdayComponent, {
            set: {
                providers: [
                    { provide: InvitesProvider, useClass: InvitesProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [InvitesMatchdayComponent, Birthday, Teams],
            imports: [IonicModule],
            providers: [NavController, ToastController, InvitesProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: InvitesProvider, useClass: InvitesProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(InvitesMatchdayComponent);
        component = fixture.componentInstance;
    })

    it('was created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    })

    it('fetches the invites', () => {
        component.invitesProvider.setInvites().then(() => {
            component.invites = component.invitesProvider.allInvites;
            expect(component.invites).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('fetches the players', () => {
        component.invitesProvider.setPlayers().then(() => {
            component.players = component.invitesProvider.allPlayers;
            expect(component.players).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('counts invite states', () => {
        var counts = component.matchday;
        expect(counts).toBeDefined();
    });

    it('creates and shows loading element', () => {
        component.showLoadingElement();
        expect(component.loadingElement).toBeDefined();
    });

    /*it('shows message invite sent', () => {
        component.showMessage();
        expect(component.showMessage).toBeDefined();
    })*/

    /*it('creates confirm dialogue', () => {
        component.showConfirm();
        expect(component.confirm).toBeDefined();
    })*/

    afterAll(() => {
        fixture.destroy();
        component = null;
    })
})