import { } from 'jasmine';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CreatePlayerComponent } from './createPlayer.component';
import { App, Config, NavParams, Form, IonicModule, Keyboard, MenuController, NavController, Platform, GestureController } from 'ionic-angular';
import { Utilities } from '../../app/utilities';
import { NavParamsMock } from '../../mocks/navParamsMock';
import { UtilitiesMock } from '../../mocks/utilitiesMock';

let component: CreatePlayerComponent;
let fixture: ComponentFixture<CreatePlayerComponent>;
let de: DebugElement;
let el: HTMLElement;

describe("CreatePlayerComponentTest", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreatePlayerComponent],
            imports: [IonicModule],
            providers: [NavController, App, Config, Form, Keyboard, MenuController, Platform, GestureController,
                { provide: Utilities, useClass: UtilitiesMock },
                { provide: NavParams, useClass: NavParamsMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreatePlayerComponent);
        component = fixture.componentInstance;
    });

    it('is created', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
    });

    it('nameStartsWithCapital', () => {
        let firstnameControl = component.createPlayerForm.controls.firstname;
        firstnameControl._value = "Testuser";
        expect(component.startsWithACapital(firstnameControl)).toBeNull();

        firstnameControl._value = "testuser";
        expect(component.startsWithACapital(firstnameControl)).toBeTruthy();
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    //de = fixture.debugElement.query(By.css('h1'));
    //el = de.nativeElement;

});



