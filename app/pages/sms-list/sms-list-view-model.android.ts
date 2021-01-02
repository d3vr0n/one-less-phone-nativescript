import { Observable } from '@nativescript/core';

import * as TNSInbox from 'nativescript-sms-inbox';
import * as permissions from 'nativescript-permissions';
import { SMS } from '~/shared/SMS.interface';

export class SmsListPageModel extends Observable {
    private _smsList : Array<any>;

    constructor() {
        super();

        permissions.requestPermission(android.Manifest.permission.READ_SMS,
            "RM App needs permission to read your sms messages").then(() => {
                this.readSmses();
            });

    }

    public readSmses() {
        return new Promise((resolve,reject) => {
            TNSInbox.getInboxesAfterDate(new Date().getTime() - (7 * 24 * 3600 * 1000),{ max: 100 }).then((res) => {
                console.log(JSON.stringify(res));
                let _smses = [];
                res.data?.forEach((item:SMS) => {
                    let sms = {...item, date_str: ''};
                    try {
                        // console.log(sms.date);
                        let _d = new Date(parseFloat(String(sms.date)));
                        sms.date_str = `${_d.toLocaleDateString()} ${_d.toLocaleTimeString().split(' ')[0]}`;
                    } catch {}
                    
                   
                    _smses.push(sms);
                });

                this.smsList = _smses;
                resolve(1);
                }, (err) => {
                    console.log('Error: ' + err);
                    reject(0);
                });
        });
    }
    public readSmsesAfterDate(lastTimestamp:number) {
        return new Promise((resolve,reject) => {
            TNSInbox.getInboxesAfterDate(+lastTimestamp,{ max: 100 }).then((res) => {
                console.log(JSON.stringify(res));
                let _smses = [];
                res.data?.forEach((item:SMS) => {
                    let sms = {...item, date_str: ''};
                    try {
                        // console.log(sms.date);
                        let _d = new Date(parseFloat(String(sms.date)));
                        sms.date_str = `${_d.toLocaleDateString()} ${_d.toLocaleTimeString().split(' ')[0]}`;
                    } catch {}
                    
                   
                    _smses.push(sms);
                });
                resolve(_smses);
                }, (err) => {
                    console.log('Error: ' + err);
                    reject(0);
                });
        });
    }

    get smsList() {
        return this._smsList;
    }

    set smsList(value: any) {        
        this._smsList = value;
        this.notifyPropertyChange('smsList', value);        
    }

}
