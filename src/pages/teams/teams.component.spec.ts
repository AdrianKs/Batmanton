import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TeamsComponent } from './teams.component';
import { Utilities } from '../../app/utilities';
import { App, Config, NavParams, AlertController, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController, LoadingController } from 'ionic-angular';

let component: TeamsComponent;
let fixture: ComponentFixture<TeamsComponent>;
let de: DebugElement;
let el: HTMLElement;

describe("TeamsComponentTesting", () => {
    beforeEach(async(()=>{
        TestBed.configureTestingModule({
            declarations: [TeamsComponent],
            imports: [IonicModule],
            providers: [NavController, Utilities, AlertController, App, Config, Form, Keyboard, MenuController, Platform, GestureController, LoadingController]
        }).compileComponents();
    }));

    beforeEach(()=>{
        fixture = TestBed.createComponent(TeamsComponent);
        component = fixture.componentInstance;
        component.ionViewWillEnter();
    })

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });

    it('gets the current user', () => {
        expect(component.currentUser).toBeDefined();
    });

    it('fetches the teams', () => {
        expect(component.teams).toBeDefined();
    });

    it('fetches the teams for search', () => {
        expect(component.teamsSearch).toBeDefined();
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

})
