import { Observable } from '@nativescript/core';

import * as TNSInbox from 'nativescript-sms-inbox';
import * as permissions from 'nativescript-permissions';

export class SmsListPageModel extends Observable {
    private _counter: number;
    private _message: string;
    private _smsList : Array<any>;

    constructor() {
        super();

        permissions.requestPermission(android.Manifest.permission.READ_SMS,
            "RM App needs permission to read your sms messages").then(() => {
                TNSInbox.getInboxesAfterDate(new Date().getTime() - (7 * 24 * 3600 * 1000),{ max: 100 }).then((res) => {
                console.log(JSON.stringify(res));
                let _smses = [];
                res.data?.forEach(item => {
                    let sms = {...item, date_str: ''};
                    try {
                        // console.log(sms.date);
                        let _d = new Date(parseFloat(String(sms.date)));
                        sms.date_str = `${_d.toLocaleDateString()} ${_d.toLocaleTimeString().split(' ')[0]}`;
                    } catch {}
                    
                   
                    _smses.push(sms);
                });

                this.smsList = _smses;
                }, (err) => console.log('Error: ' + err));
            });

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();
    }

    get smsList() {
        return this._smsList;
    }

    set smsList(value: any) {        
        this._smsList = value;
        this.notifyPropertyChange('smsList', value);        
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        if (this._message !== value) {
            this._message = value;
            this.notifyPropertyChange('message', value);
        }
    }

    onTap() {
        this._counter--;
        this.updateMessage();
    }

    private updateMessage() {
        if (this._counter <= 0) {
            this.message =
                'Hoorraaay! You unlocked the NativeScript clicker achievement!';
        } else {
            this.message = `${this._counter} taps left`;
        }
    }
}
