import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

import { IEmoji } from './class.iemoji';
import { api } from './emoji-api';

@Pipe({name: 'emoji'})

export class AppSmiles implements PipeTransform {
    private pattern = /:[\w\d]+:/g;
    html: string;

    constructor() {}

    public transform(value: string, args: string[]) {

        let Emos: Array<string>;

        value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (value.match(this.pattern) != null)
        {
            let emos: Array<string> = value.match(this.pattern);
            Emos = emos;
            for (let i: number = 0; i < emos.length; i++)
            {
                let emoji = api.getEmoji(emos[i].replace(/:/g, ''));
                if (emoji != undefined) {
                    value = value.replace(emos[i], emoji.emoji);
                }
            }
        }

        return value;
    }

}