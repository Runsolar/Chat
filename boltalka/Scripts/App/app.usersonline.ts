import { Component, Injectable } from "@angular/core";
import { User } from "./class.user";
import { AppTransport } from "./app.transport";

@Component({
    selector: "my-users",
    templateUrl: "../Scripts/App/template.users.html"
})

@Injectable()
export class AppUsersOnline {
    MyId: number = 0;
    MyGid: number = 0;
    MyConnectionId: string;
    auth: boolean = false;
    UsersCount: number;
    
    usersonline: Array<User>;

    apptransport: AppTransport;
    constructor(private _apptransport: AppTransport) {
        this.apptransport = _apptransport;
        this.usersonline = _apptransport.usersonline;
        this.subscribeToEventsFromTransport();
    }

    ClkOnNickName = function (RecieverNickName: string, RecieverId: number): void {

        var divToChange: HTMLElement = document.getElementById(RecieverNickName);

        if (divToChange.style.fontSize === "12px") {
            for (let n: number = 0; n < this.usersonline.length; n++) {
                document.getElementById(this.usersonline[n].NickName).style.fontSize = "12px";
                document.getElementById(this.usersonline[n].NickName).style.margin = "4px";
                document.getElementById(this.usersonline[n].NickName).style.textAlign = "left";
                if (this.usersonline[n].NickName === RecieverNickName) {
                    this.usersonline[n].SelectedAsRecipient = true;
                } else {
                    this.usersonline[n].SelectedAsRecipient = false;
                }
            }

            divToChange.style.fontSize = "16px";
            // divToChange.style.marginLeft = '16px';
            divToChange.style.textAlign = "center";
        } else {
            for (let n: number = 0; n < this.usersonline.length; n++) {
                this.usersonline[n].SelectedAsRecipient = false;
            }
            divToChange.style.fontSize = "12px";
            divToChange.style.margin = "4px";
            divToChange.style.textAlign = "left";
        }

    };

    // подписываемся к событиям сервера
    private subscribeToEventsFromTransport = function (): void {
        let self: AppUsersOnline = this;

        // получаем события об изменении числа участников чата
        self.apptransport.ChangeUsersCount.subscribe((UsersCount: number) => {
            self.UsersCount = UsersCount;
        });

        // получаем событие об успешной авторизации
        self.apptransport.onUserIsLoggedInAndAuth.subscribe((ImAuth: boolean) => {
            self.MyId = self.apptransport.MyId;
            self.MyGid = self.apptransport.MyGid;
            self.auth = ImAuth;
            self.MyConnectionId = self.apptransport.MyConnectionId;
        });
    };

}