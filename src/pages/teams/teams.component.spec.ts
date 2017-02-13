import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TeamsComponent } from './teams.component';
import { TeamsProvider } from '../../providers/teams-provider';
import { Utilities } from '../../app/utilities';
import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { TeamsProviderMock } from '../../mocks/teamsProviderMock';

let component: TeamsComponent;
let fixture: ComponentFixture<TeamsComponent>;
let de: DebugElement;
let el: HTMLElement;

describe("TeamsComponentTesting", () => {
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(TeamsComponent, {
            set: {
                providers: [
                    { provide: TeamsProvider, useClass: TeamsProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [TeamsComponent],
            imports: [IonicModule],
            providers: [NavController, TeamsProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: TeamsProvider, useClass: TeamsProviderMock },
                { provide: LoadingController, useValue: mockLoadingController }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamsComponent);
        component = fixture.componentInstance;
        
    })

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });

    it('gets the current user', () => {
        component.isTrainer();
        expect(component.currentUser).toBeDefined();
    });


    it('has to be admin', () => {
        component.isTrainer();
        expect(component.isAdmin).toBeTruthy();
    })

    it('fetches the teams', () => {
        component.teamProvider.setTeams().then(() => {
            component.teams = component.teamProvider.teams;
            expect(component.teams).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })


    });

    it('fetches the teams for search', () => {
        component.teamProvider.setTeams().then(() => {
            component.teamsSearch = component.teamProvider.teams;
            expect(component.teamsSearch).toBeDefined();
        }).catch(error => {
            console.log(error.message);
        })
    });

    it('filters list', () => {
        component.teamProvider.setTeams().then(()=>{
            component.teams = component.teamProvider.teams;
            component.teamsSearch = component.teamProvider.teams;
            component.getItems("Team 1");
            expect(component.teams.length).toBe(1);
            component.getItems("Team 5");
            expect(component.teams.length).toBe(0);
            component.getItems("Team");
            expect(component.teams.length).toBe(2);
        })
    })

    it('creates and shows loading', () => {
        component.createAndShowLoading();
        expect(component.loading).toBeDefined();
    })

    

    afterAll(() => {
        fixture.destroy();
        component = null;
    })

    /*afterEach(() => {
        fixture.destroy();
        component = null;
    });*/

})
