import { Component, Input, Output, Injectable, EventEmitter } from '@angular/core';

import { AppTransport } from './app.transport';
import { RegistrationInformation } from './class.registrationinformation';


@Component({
    selector: 'regform-app',
    templateUrl: '../Scripts/App/template.registration.html',
    styleUrls: ['../css/dialog.component.css']
})

@Injectable()
export class AppRegistrationDialog {
    @Input() closable = true;
    @Input() visible: boolean;
    @Output() _visible: EventEmitter<boolean> = new EventEmitter<boolean>(); 


    
    RegFormClickedState: boolean = false;

    NewRegistrationInformation: RegistrationInformation;

    retypeuserpassword: string = '';

    NickNameIsCorrect: boolean = false;
    UserPasswordIsCorrect: boolean = false;
    UserEmailIsCorrect: boolean = true;

    RegStatys: string = 'необходимо заполнить поля';

    colors = [
        //Pink Colors
        "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#C71585",
        //Purple Colors
        "#E6E6FA", "#D8BFD8", " #DDA0DD", "#DA70D6", "#EE82EE",
        "#FF00FF", "#BA55D3", "#9932CC", "#9400D3", "#8A2BE2",
        "#8B008B", "#800080", "#9370DB", "#7B68EE", "#6A5ACD",
        "#483D8B", "#663399", "#4B0082",
        //Red Colors
        "#FFA07A", "#FA8072", "#E9967A", "#F08080", "#CD5C5C", "#DC143C",
        "#FF0000", "#B22222", "#8B0000",
        //Orange Colors
        "#FFA500", "#FF8C00", "#FF7F50", "#FF6347", "#FF4500",
        //Yellow Colors
        "#FFD700", "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2", "#FFEFD5",
        "#FFE4B5", "#FFDAB9", "#EEE8AA", "#F0E68C", "#BDB76B",
        //Green Colors
        "#ADFF2F", "#7FFF00", "#7CFC00", "#00FF00", "#32CD32", "#98FB98", "#90EE90",
        "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57", "#228B22", "#008000", "#006400",
        "#9ACD32", "#6B8E23", "#556B2F", "#66CDAA", "#8FBC8F", "#20B2AA", "#008B8B",
        "#008080",
        //Cyan Colors
        "#00FFFF", "#00FFFF", "#E0FFFF", "#AFEEEE", "#7FFFD4", "#40E0D0", "#48D1CC",
        "#00CED1",
        //Blue Colors
        "#5F9EA0", "#4682B4", "#B0C4DE", "#ADD8E6", "#B0E0E6", "#87CEFA", "#87CEEB",
        "#6495ED", "#00BFFF", "#1E90FF", "#4169E1", "#0000FF", "#0000CD", "#00008B",
        "#000080", "#191970",
        //Brown Colors
        "#FFF8DC", "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3", "#DEB887", "#D2B48C",
        "#BC8F8F", "#F4A460", "#DAA520", "#B8860B", "#CD853F", "#D2691E", "#808000",
        "#8B4513", "#A0522D", "#A52A2A", "#800000",
        //White Colors
        "#FFFFFF", "#FFFAFA", "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF",
        "#F5F5F5", "#FFF5EE", "#F5F5DC", "#FDF5E6", "#FFFAF0", "#FFFFF0", "#FAEBD7",
        "#FAF0E6", "#FFF0F5", "#FFE4E1",
        //Grey Colors
        "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#696969", "#808080", "#778899",
        "#708090", "#2F4F4F"
    ];

    apptransport: AppTransport
    constructor(private _apptransport: AppTransport) {
        this.NewRegistrationInformation = new RegistrationInformation();
        this.apptransport = _apptransport;
        this.subscribeToEventsFromRegistration();
    }

    ngOnInit() { }

    onRegistration(): void {
    }

    UserFocusNickName(): void {
        this.RegStatys = 'придумайте никнейм';
    }

    InputUserNickName(): void {
        if (this.NewRegistrationInformation.userNickName.length < 3)
        {
            this.RegStatys = 'слишком короткий никнейм';
            this.NickNameIsCorrect = false;
        }else
        {
            this.UserNickNameSymbolsValidate();
        }

    }

    UserNickNameSymbolsValidate(): void {
        if (this.NewRegistrationInformation.userNickName.search(/^[\wа-я_@\-$|]{3,13}$/i) === 0)
        {
            this.RegStatys = 'придумывание никнейма';
            this.NickNameIsCorrect = true;
        }else
        {
            this.RegStatys = 'придуманный никнейм содержит недопустимые символы.';  
            this.NickNameIsCorrect = false;
        }
                 
    }

    UserFocusPassword(): void {
        this.RegStatys = 'придумайте пароль';
    }

    InputUserPassword(): void {
        if (this.NewRegistrationInformation.userPassword.length < 3) {
            this.RegStatys = 'слишком короткий пароль';
            this.UserPasswordIsCorrect= false;
        }else {
            this.UserPasswordSymbolsValidate();
        }

    }

    UserPasswordSymbolsValidate(): void {
        if (this.NewRegistrationInformation.userPassword.search(/^[\wа-я_@\-$|]{3,16}$/i) === 0)
        {
            this.RegStatys = 'придумывание пароля';
            this.UserPasswordIsCorrect = true;
        } else
        {
            this.RegStatys = 'придуманный пароль содержит недопустимые символы.';
            this.UserPasswordIsCorrect = false;
        }
            
    }

    UserEmailSymbolsValidate(): void {
        if ((this.NewRegistrationInformation.email.search(/^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i) === 0) || (this.NewRegistrationInformation.email.length === 0))
        {
            this.UserEmailIsCorrect = true;
        }else
        {
            this.UserEmailIsCorrect = false;
        }
    }

    selectedNickColorValueFocus(): void {
        this.RegStatys = 'выбор цвета для никнейма';
    }

    selectedMsgColorValueFocus(): void {
        this.RegStatys = 'выбор цвета для сообщений';
    }

    //Регистрируем нового пользователя
    SendRegInfo(): void {

        this.InputUserNickName();
        this.InputUserPassword();

        if (this.UserPasswordIsCorrect && this.NickNameIsCorrect && this.UserEmailIsCorrect)
        {
            this.RegStatys = 'обработка регистрационной информации. Ожидайте...';
            this.apptransport.RegisterNewUser(this.NewRegistrationInformation);
        }else
            this.RegStatys = 'проверьте правила заполненных полей.';
    }

    //Результат регистрации. Подписываемся к событиям сервера
    private subscribeToEventsFromRegistration(): void {
        let self = this;

        //Получаем событие об успешной авторизации
        self.apptransport.onNewUserRegistrationErrorIncorrectRegInfo.subscribe(() => {
            self.RegStatys = "некорректно заполнены поля регистрации";
        });

        self.apptransport.onNewUserRegistrationErrorUserAllreadyRegistred.subscribe(() => {
            self.RegStatys = "придуманный никнейм уже существует. Придумайте другой никнейм.";
        });

        self.apptransport.onNewUserRegistrationSuccess.subscribe(() => {
            self.RegStatys = "регистрация прошла успешно. Нажмите желтый крестик.";
        });
    }

    close() {
        this.visible = false;
        this._visible.emit(false);
    }

}