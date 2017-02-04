import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ViewTeamComponent } from './viewTeam.component';
import { TeamsProvider } from '../../providers/teams-provider';
import { Utilities } from '../../app/utilities';
import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';
import { UtilitiesMock } from '../../mocks/utilitiesMock';
import { TeamsProviderMock } from '../../mocks/teamsProviderMock';
import { NavParamsMock} from '../../mocks/navParamsMock';
import { Teams } from '../../app/pipes/teams';
import { Birthday } from '../../app/pipes/birthday';

let component: ViewTeamComponent;
let fixture: ComponentFixture<ViewTeamComponent>;
let de: DebugElement;
let el: HTMLElement;
let teamId = "abcdefgh"

describe("ViewTeamComponentTesting", () => {
    //NavParamsMock.setParams(teamId);
    let mockLoadingController;
    beforeEach(async(() => {
        mockLoadingController = {
            create: (args: any) => { return this; },
            present: jasmine.createSpy('present'),
            dismiss: jasmine.createSpy('dismiss')
        };
        spyOn(mockLoadingController, 'create').and.returnValue(mockLoadingController);
        TestBed.overrideComponent(ViewTeamComponent, {
            set: {
                providers: [
                    { provide: TeamsProvider, useClass: TeamsProviderMock }
                ]
            }
        }).configureTestingModule({
            declarations: [ViewTeamComponent, Teams, Birthday],
            imports: [IonicModule],
            providers: [NavController, TeamsProvider, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: TeamsProvider, useClass: TeamsProviderMock },
                { provide: LoadingController, useValue: mockLoadingController },
                { provide: NavParams, useClass: NavParamsMock }]
        }).compileComponents();
    }));

     beforeEach(() => {
        fixture = TestBed.createComponent(ViewTeamComponent);
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

    it('builds the team', () => {
        component.teamsProvider.teamId = teamId;
        component.teamsProvider.buildTeam().then(()=>{
            component.team = component.teamsProvider.team;
            component.teamNameOld = component.team.name;
            component.altersklasse = component.team.ageLimit;
            component.teamArt = component.team.type;
            component.sKlasse = component.team.sclass;
            expect(component.team).toBeDefined();
            expect(component.teamNameOld).toEqual("Team 1");
            expect(component.altersklasse).toEqual("15");
            expect(component.teamArt).toEqual("1");
            expect(component.sKlasse).toEqual("S1");
        })
    })

    it('refreshes the players', () => {
        component.teamsProvider.refreshPlayers().then(() => {
            component.allPlayers = component.teamsProvider.allPlayers;
            expect(component.allPlayers).toBeDefined();
            expect(component.allPlayers.length).toEqual(2);
        })
    })

    it('checks if team has players', () => {
        component.teamsProvider.checkIfTeamsHasPlayers().then(()=>{
            component.teamHasPlayers = component.teamsProvider.teamHasPlayers;
            expect(component.teamHasPlayers).toBeTruthy();
        })
    })

    it('counts the genders', () => {
        component.teamsProvider.countGenders().then(() => {
            component.manCounter = component.teamsProvider.manCounter;
            component.womanCounter = component.teamsProvider.womanCounter;
            expect(component.manCounter).toEqual(1);
            expect(component.womanCounter).toEqual(1);
        })
    })

    /*it('updates the team infos', () => {
        component.teamsProvider.teamId = teamId;
        component.teamsProvider.updateTeamInfos("18", "Team 3", "1", "S2").then((status)=>{
            console.log(status);
            component.team = component.teamsProvider.team;
            expect(component.team.ageLimit).toEqual("18");
        })
    })*/




})