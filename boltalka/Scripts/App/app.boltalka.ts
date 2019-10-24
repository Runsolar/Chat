import { Component, Output, ViewChild, ElementRef, AfterViewChecked } from "@angular/core";
import { AppSender } from "./app.sender";

@Component({
    selector: "app-boltalka",
    templateUrl: "../Scripts/App/template.boltalka.html"
})

export class AppBoltalka {
    @ViewChild("scrollboard") private myScrollContainer: ElementRef;

    @ViewChild(AppSender) private msgsenderComponent: AppSender;

    SmileClickedEventFromMenu(smileid: string): void {
        this.msgsenderComponent.msg += smileid;
        this.msgsenderComponent.onKey(this.msgsenderComponent.msg);
    }

    ngOnInit() {}

    ngAfterViewChecked() {}

    scrollToBottom(): void {}

}
