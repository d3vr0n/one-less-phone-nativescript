import { Observable } from '@nativescript/core';
import * as permissions from 'nativescript-permissions';
import { SMS } from '~/shared/SMS.interface';

// import * as callLogsService from 'nativescript-CallLog';

var appModule = require("application");

export class CallListPageModel extends Observable {
    private _callList : Array<any>;

    constructor() {
        super();

        permissions.requestPermission(android.Manifest.permission.READ_CALL_LOG,
            "RM App needs permission to read your call logs").then(() => {
                this.readCallLogs();
            });

    }

    public readCallLogs() {
        return new Promise((resolve,reject) => {
            // callLogsService.getCallLog().then(callLogs => {
            //     callLogs.data.forEach(callLog => {
            //         console.log(`${callLog['number']} ${callLog['type']} ${callLog['date']} ${callLog['duration']}`);
            //     });
            //     resolve(callLogs);
            // });
            var CallLogs = android.provider.CallLog.Calls;
        var c = appModule.android.context.getContentResolver().query(CallLogs.CONTENT_URI, null, null, null, null);

        if (c.getCount() > 0) {
            var cl = [];
            while (c.moveToNext()) {debugger
                //var calllogModel = new CallLog();
                //calllogModel.initializeFromNative(c);
                //cl.push(calllogModel);
            }
            c.close();
            resolve({data: cl, response: "fetch"});
        }
        else {
            c.close();
            resolve({data: null, response: "fetch"});
        }
            
        });
    }

    get callList() {
        return this._callList;
    }

    set callList(value: any) {        
        this._callList = value;
        this.notifyPropertyChange('callList', value);        
    }

}
