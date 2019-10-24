import { Component, Injectable } from "@angular/core";
import { AppTransport } from "./app.transport";

import { IncomingMessage } from "./class.incomingmessage";
import { OutboundMessage } from "./class.outboundmessage";

import { User } from "./class.user";


@Component({
    selector: "my-app",
    templateUrl: "../Scripts/App/template.messageboard.html"
})

@Injectable()
export class AppMessageBoard {
    MyId: number = 0;
    MyGid: number = 0;
    MyConnectionId: string;
    auth: boolean = false;

    usersonline: Array<User>;
    messages: Array<IncomingMessage>;
    showRegistrationDialog: boolean = false;

    apptransport: AppTransport;
    constructor(private _apptransport: AppTransport) {
        this.apptransport = _apptransport;
        this.messages = _apptransport.incomingmessage;
        this.subscribeToEventsFromTransport();
    };

    deleteMsg = function (msgId: string): void {
        if ((msgId.length < 32) && (this.MyGid === 10)) {
            this.apptransport.sendServicesMsgOnServer(3, msgId);
        }
    };

    // подписываемся к событиям сервера
    private subscribeToEventsFromTransport(): void {
        let self: AppMessageBoard = this;

        // получаем событие об успешной авторизации
        self._apptransport.onUserIsLoggedInAndAuth.subscribe((ImAuth: boolean) => {
            if (ImAuth) {
                self.MyId = self.apptransport.MyId;
                self.MyGid = self.apptransport.MyGid;
                self.MyConnectionId = self.apptransport.MyConnectionId;
                self.auth = self.apptransport.MyAuth;
            }
        });
    }

    /*
    MouseOverlay(msgId: number): void {
        document.getElementById('MsgClass' + msgId).style.fontSize = '12px';
    }

    MouseLeave(msgId: number): void {
        document.getElementById('MsgClass' + msgId).style.fontSize = '12px';
    }

    ClkOnNickName = function (): void {
        console.log("ClkOnNickName");
    }

    GetNickNameById = function (UserId: number): string {
        return this.usersonline.find((obj: User) => obj.userid === UserId).NickName;
    }

    GetNickColor = function (UserId: number): string {
        return this.usersonline.find((obj: User) => obj.userid === UserId).NickColor;
    }

    GetMsgColor = function (UserId: number): string {
        return this.usersonline.find((obj: User) => obj.userid === UserId).MsgColor;
    }
*/

}