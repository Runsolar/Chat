import { Injectable, EventEmitter } from "@angular/core";
import { User } from "./class.user";
import { OutboundMessage } from "./class.outboundmessage";
import { IncomingMessage } from "./class.incomingmessage";
import { RegistrationInformation } from "./class.registrationinformation";

declare var jQuery: any;

@Injectable()
export class AppTransport {
    MyId: number = 0;
    MyGid: number = 0;
    MyAuth: boolean = false;
    MyConnectionId: string;
    // online list
    usersonline: Array<User>;
    // offline list
    usersoffline: Array<User>;
    incomingmessage: Array<IncomingMessage>;
    public connectionExists: Boolean;

    private server: any;
    private client: any;
    private chat: any;

    // событие о подключении к хабу
    public onConnected: EventEmitter<void> = new EventEmitter<void>();
    public onUserIsLoggedInAndAuth: EventEmitter<boolean> = new EventEmitter<boolean>();
    public ChangeUsersCount: EventEmitter<number> = new EventEmitter<number>();

    public onNewUserRegistrationErrorIncorrectRegInfo: EventEmitter<number> = new EventEmitter<number>();
    public onNewUserRegistrationErrorUserAllreadyRegistred: EventEmitter<number> = new EventEmitter<number>();
    public onNewUserRegistrationSuccess: EventEmitter<number> = new EventEmitter<number>();

    // установим обработчики к событиям от сервера
    private registerOnServerEvents(): void {
        let self: AppTransport = this;

        this.client.onConnectedUsersOnlineList = function (usersonline: Array<User>): void {
            self.clearUserList();
            usersonline.map(u => self.addUserInUserList(u));
        };

        // передаем список пользователей по запросу поиска
        this.client.UsersOfflineList = function (usersoffline: Array<User>): void {
            self.clearOfflineUserList();
            usersoffline.map(u => self.addUserInOfflineUserList(u));
        };

        // удаляем сообщение
        this.client.deletemsg = function (msgId: string): void {
            self.incomingmessage.splice(self.incomingmessage.findIndex(m => m.msgId === msgId), 1);
        };

        this.client.onConnectedUserIsLoggedIn = function (Iam: User): void {
            self.MyId = Iam.userid;
            self.MyGid = Iam.UserGid;
            self.MyAuth = true;
            self.MyConnectionId = Iam.ConnectionId;
            self.onUserIsLoggedInAndAuth.emit(self.MyAuth);
            Iam.ItsMe = true;
            self.addUserInUserList(Iam);
        };

        // добавляем нового пользователя в юзерлист
        this.client.onNewUserConnected = function (NewUser: User): void {
            self.addUserInUserList(NewUser);
        };

        // удаление пользователя, вышедшего из чата
        this.client.onUserDisconnected = function (NickName: string): void {
            self.removeUsersFromUserList(NickName);
        };

        // получаем последние сообщения с сервера
        this.client.onConnectedLastOutboundMessages = function (LastIncomingMessages: Array<IncomingMessage>): void {
            self.clearIncomingMessageInPoolt();
            /*
            for (let LastIncomingMessage of LastIncomingMessages) {
                self.addIncomingMessageInPool(LastIncomingMessage);
            }
            */
            LastIncomingMessages.map(m => self.addIncomingMessageInPool(m));
        };

        // получаем сообщение с сервера
        this.client.broadcastMessage = function (NewIncomingMessage: IncomingMessage): void {
            self.addIncomingMessageInPool(NewIncomingMessage);
        };

        // получаем приватное сообщение с сервера
        this.client.addMessage = function (NewIncomingMessage: IncomingMessage): void {
            self.addIncomingMessageInPool(NewIncomingMessage);
        };

        // регистрируем нового пользователя
        this.client.onNewUserRegistrationErrorIncorrectRegInfo = function (): void {
            self.onNewUserRegistrationErrorIncorrectRegInfo.emit();
        };
        this.client.onNewUserRegistrationErrorUserAllreadyRegistred = function (): void {
            self.onNewUserRegistrationErrorUserAllreadyRegistred.emit();
        };
        this.client.onNewUserRegistrationSuccess = function (): void {
            self.onNewUserRegistrationSuccess.emit();
        };

    }

    removeUsersFromUserList = (NickName: string): void => {
        var ItsMe: boolean = this.usersonline.find((obj: User) => obj.NickName === NickName).ItsMe;
        this.usersonline.splice(this.usersonline.findIndex((obj: User) => obj.NickName === NickName), 1);
        this.ChangeUsersCount.emit(this.usersonline.length);
    }

    addUserInUserList = (useronline: User): void  => {
        this.usersonline.push(useronline);
        this.ChangeUsersCount.emit(this.usersonline.length);
    }

    addUserInOfflineUserList = (useroffline: User): void => {
        this.usersoffline.push(useroffline);
    }

    clearUserList = (): void => {
        for (let n: number = this.usersonline.length; n > 0; n--) {
            this.usersonline.pop();
        }
    }

    clearOfflineUserList = (): void => {
        for (let n: number = this.usersoffline.length; n > 0; n--) {
            this.usersoffline.pop();
        }
    }

    // отправляем сообщение на сервер
    sendMsgOnServer = (NewOutboundMessage: OutboundMessage): void => {
        this.server.send(NewOutboundMessage);
    }

    // добавляем сообщение от сервера в пул 
    addIncomingMessageInPool = (NewIncomingMessage: IncomingMessage): void => {
        this.incomingmessage.push(NewIncomingMessage);
    }

    clearIncomingMessageInPoolt = (): void => {
        for (let n: number = this.incomingmessage.length; n > 0; n--) {
            this.incomingmessage.pop();
        }
    }

    // отправляем регистрационную информацию на сервер (регистрируем нового пользователя)
    RegisterNewUser = (NewRegistrationInformation: RegistrationInformation): void => {
        this.server.registernewuser(NewRegistrationInformation);
    }

    public sendServicesMsgOnServer = (instruction: number, message: string): void => {
        let NewOutboundMessage: OutboundMessage = new OutboundMessage();
        NewOutboundMessage.ConnectionId = this.MyConnectionId;
        NewOutboundMessage.receiverId = null;
        NewOutboundMessage.instruction = instruction;
        NewOutboundMessage.message = message;
        NewOutboundMessage.prvMsg = false;
        this.sendMsgOnServer(NewOutboundMessage);
    }

    constructor() {
        this.usersonline = new Array<User>();
        this.usersoffline = new Array<User>();
        this.incomingmessage = new Array<IncomingMessage>();
        this.chat = jQuery.connection.chatHub;
        this.server = this.chat.server;
        this.client = this.chat.client;
        this.subscribeToEvents();
        this.connectionExists = false;
        this.registerOnServerEvents(); // устанавливаем обработчики от сервера
        this.startConnection(); // подключаемся к Хабу
    }

    // подписываемся к событиям сервера
    private subscribeToEvents = (): void => {
        // получить список кто онлайн
        this.onConnected.subscribe(() => {
            this.server.connect("", "");
        });
    };

    // подключаемся к Хабу
    private startConnection = (): void => {
        let self: AppTransport = this;
        jQuery.connection.hub.start().done((data: any) => {
            console.log("startConnection " + data);
            self.connectionExists = true;
            self.onConnected.emit();
            console.log("Send  onConnected");
        }).fail((error: any) => {
            console.log("Could not connect " + error);
        });
    }
}