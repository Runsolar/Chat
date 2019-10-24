import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppBoltalka } from './app.boltalka';
import { AppMessageBoard } from './app.messageboard';
import { AppTransport } from './app.transport';
import { AppUsersOnline } from './app.usersonline';
import { AppSender } from './app.sender';

import { AppMenu } from './app.menu';
import { AppRegistrationDialog } from './app.registrationdialog';
import { AppSmilesDialog } from './app.smilesdialog';
import { AppSmiles } from './app.smiles';
import { PiplesDialog } from './app.piplesdialog';
import { Angular2AutoScroll } from "./angular2-auto-scroll.directive";

@NgModule({
    imports: [
        //angular builtin module
        BrowserModule,
        //HttpModule,
        FormsModule
    ],
    declarations: [
        AppBoltalka,
        AppUsersOnline,
        AppSender,
        AppMessageBoard,
        AppMenu,
        AppRegistrationDialog,
        AppSmilesDialog,
        AppSmiles,
        PiplesDialog,
        Angular2AutoScroll
    ],
    providers: [
        AppTransport
        //Pool
        //register services here
    ],
    bootstrap: [AppBoltalka]
})

export class AppModule {
}

