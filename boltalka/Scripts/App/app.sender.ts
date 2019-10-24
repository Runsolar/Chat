import { Component, OnInit, Input, Injectable} from '@angular/core';

import { OutboundMessage } from './class.outboundmessage';

import { User } from './class.user';
import { AppTransport } from './app.transport';

@Component({
    selector: 'my-sender',
    templateUrl: '../Scripts/App/template.sender.html'
})


@Injectable()
export class AppSender {

    MyId: number = 0;
    MyGid: number = 0;
    auth: boolean = false;
    MyConnectionId: string;

    userName: string = '';
    userPassword: string = '';

    //Событие
    onClickSendAuthEvent: number = 0;
    msg: string = '';

    msglimit: number = 255;
    maxmsglength: number = 255;

    prvMsg: boolean = false;

    users: Array<User>;

    apptransport: AppTransport;
    constructor(private _apptransport: AppTransport) {
        this.apptransport = _apptransport;
        this.users = _apptransport.usersonline;
        this.subscribeToEventsFromTransport();
    }

    ngOnInit() {
    }

    onKey(event: any) { // without type info
        if (this.msglimit > 0) this.msglimit = this.maxmsglength - this.msg.length;
    }
/*
    SmileClickedEventFromBoltalka = function(smileid: string): void {
        alert(smileid);
    }
*/
    onClickSendAuth = function (): void {
        if ((this.userName.length) > 0 && (this.userPassword.length > 0)) {
            this.apptransport.server.connect(this.userName, this.userPassword);
        }
    }

    //Отправка сообщения
    onClickSendMsg = function (): number {

        let NewOutboundMessage:  OutboundMessage = new OutboundMessage();

        if (this.msg.length == 0) return -1;

        NewOutboundMessage.ConnectionId = this.MyConnectionId;
        NewOutboundMessage.receiverId = 0;
        //Пользовательское сообщение
        NewOutboundMessage.instruction = 0;

        if (this.msg.length > this.maxmsglength)
            NewOutboundMessage.message = this.msg.substr(0, this.maxmsglength);
        else NewOutboundMessage.message = this.msg;

        if (this.users.find((obj: User) => obj.SelectedAsRecipient === true) == undefined)
            NewOutboundMessage.receiverId = 0;
        else
            NewOutboundMessage.receiverId = this.users.find((obj: User) => obj.SelectedAsRecipient === true).userid;

        NewOutboundMessage.prvMsg = this.prvMsg;

        this._apptransport.sendMsgOnServer(NewOutboundMessage);

        this.msg = '';
        this.msglimit = this.maxmsglength;

        return 0;
    }

    //Подписываемся к событиям сервера
    private subscribeToEventsFromTransport(): void {
        let self = this;

        //Получаем событие об успешной авторизации
        self.apptransport.onUserIsLoggedInAndAuth.subscribe((ImAuth: boolean) => {
            self.MyId = self.apptransport.MyId;
            self.MyGid = self.apptransport.MyGid;
            self.auth = ImAuth;
            self.MyConnectionId = self.apptransport.MyConnectionId;
        });
    }


}
