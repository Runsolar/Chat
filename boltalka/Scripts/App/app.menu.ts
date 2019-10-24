import { Component, Output, Injectable, EventEmitter } from "@angular/core";

@Component({
    selector: "my-menu",
    templateUrl: "../Scripts/App/template.menu.html"
})

@Injectable()
export class AppMenu  {

    @Output() onSmileClickedEventFromMenu: EventEmitter<string> = new EventEmitter<string>();
    showRegFormDialog: boolean = false;
    showSmilesDialog: boolean = false;
    showPiplesDialog: boolean = false;

    constructor() {}

    RegForm = function (): void {
        this.showRegFormDialog = !this.showRegFormDialog;
    }

    CloseRegForm = function (): void {
        this.showRegFormDialog = !this.showRegFormDialog;
    }

    SmilesForm = function (): void {
        this.showSmilesDialog = !this.showSmilesDialog;
    }

    CloseSmileForm = function (): void {
        this.showSmilesDialog = !this.showSmilesDialog;
    }
    
    onSmileClickedEvent(smileid: string): void {
        this.onSmileClickedEventFromMenu.emit(smileid);
    }

    PiplesDialog = function (): void {
        this.showPiplesDialog = !this.showPiplesDialog;
    }

    ClosePiplesDialog= function(): void {
        this.showPiplesDialog = !this.showPiplesDialog;
    }
}