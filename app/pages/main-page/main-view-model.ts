import { Observable } from '@nativescript/core';

import * as TNSInbox from 'nativescript-sms-inbox';
import * as permissions from 'nativescript-permissions';

export class MainPageModel extends Observable {
    private _counter: number;
    private _message: string;

    constructor() {
        super();

        permissions.requestPermission(android.Manifest.permission.READ_SMS,
            "RM App needs permission to read your sms messages").then(() => {
                TNSInbox.getInboxes({ max: 10 }).then((res) => {
                console.log(JSON.stringify(res));
                }, (err) => console.log('Error: ' + err));
            });

        // Initialize default values.
        this._counter = 42;
        this.updateMessage();
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
