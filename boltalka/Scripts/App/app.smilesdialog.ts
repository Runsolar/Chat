import { Component, Input, Output, Injectable, EventEmitter } from '@angular/core';
import { AppMenu } from './app.menu';
import { AppSender } from './app.sender';

@Component({
    selector: 'smilesform-app',
    templateUrl: '../Scripts/App/template.smiles.html',
    styleUrls: ['../css/dialog.smiles.css']
})


@Injectable()
export class AppSmilesDialog {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() _visible: EventEmitter<boolean> = new EventEmitter<boolean>(); 
    @Output() onSmileClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    close() {
        this.visible = false;
        this._visible.emit(false);
    }

    public SmileClicked(smileid: string): void {
        this.onSmileClicked.emit(smileid);
    }
}