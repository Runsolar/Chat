import { Component, Input, Output, Injectable, EventEmitter } from "@angular/core";
import { User } from "./class.user";

import { AppTransport } from "./app.transport";
import { OutboundMessage } from "./class.outboundmessage";

@Component({
    selector: "piples-app",
    templateUrl: "../Scripts/App/template.piples.html",
    styleUrls: ["../css/dialog.component.css"]
})

@Injectable()
export class PiplesDialog {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() _visible: EventEmitter<boolean> = new EventEmitter<boolean>();
    userNickName: string = "";

    MyId: number = 0;
    MyGid: number = 0;
    MyConnectionId: string;
    auth: boolean = false;

    usersofline: Array<User>;

    apptransport: AppTransport;
    constructor(private _apptransport: AppTransport) {
        this.apptransport = _apptransport;
        this.usersofline = _apptransport.usersoffline;
        this.subscribeToEventsFromTransport();
    }

    InputUserNickName = function (): void {
        if (this.userNickName.length < 14) {
            this.apptransport.sendServicesMsgOnServer(1, this.userNickName);
        }
    };

    userban = function (NickName: string, banned: boolean): void {
        if (this.MyGid === 10) {
            if (banned) {
                this.apptransport.sendServicesMsgOnServer(11, NickName);
            } else {
                this.apptransport.sendServicesMsgOnServer(12, NickName);
            }
        }
    };

    close = function (): void {
        this.visible = false;
        this._visible.emit(false);
    };


    // подписываемся к событиям сервера
    private subscribeToEventsFromTransport(): void {
        let self: PiplesDialog = this;

        // получаем событие об успешной авторизации
        self.apptransport.onUserIsLoggedInAndAuth.subscribe((ImAuth: boolean) => {
            self.MyId = self.apptransport.MyId;
            self.MyGid = self.apptransport.MyGid;
            self.auth = ImAuth;
            self.MyConnectionId = self.apptransport.MyConnectionId;
        });
    }
}