import { Observable } from '@nativescript/core';
import * as permissions from 'nativescript-permissions';
import { CallLog } from '~/shared/call-log.interface';
import * as appModule from "@nativescript/core/application";
import { isAndroid } from "@nativescript/core/platform";

const callLogType = {
    OUTCOMING: android.provider.CallLog.Calls.OUTGOING_TYPE,
    INCOMING: android.provider.CallLog.Calls.INCOMING_TYPE,
    MISSED: android.provider.CallLog.Calls.MISSED_TYPE
};

export class CallListPageModel extends Observable {
    private _callList: Array<CallLog>;
    public callLogType = callLogType;
    public info:string;

    constructor() {
        super();
    }

    public init() {
        if(permissions.hasPermissions([android.Manifest.permission.READ_CALL_LOG,android.Manifest.permission.READ_PHONE_STATE])) {
            this.readCallLogs().then((data: any) => {
                this.callList = data?.data;
            });
        }
    }

    public readCallLogs() {
        return new Promise((resolve, reject) => {
            var CallLogs = android.provider.CallLog.Calls;
            let args = {
                filter: [
                    callLogType.INCOMING,
                    callLogType.OUTCOMING,
                    callLogType.MISSED
                ],
                contactType: "0"
            };
            try {
                var c = appModule.android.context.getContentResolver().query(CallLogs.CONTENT_URI, null, getWhereClause(args), null, 
                        CallLogs.DATE + " DESC");
                // debugger
                if (c.getCount() > 0) {
                    var cl = [];
                    while (c.moveToNext() && cl.length < 50) { // && cl.length < 20
                        // debugger
                        //var calllogModel = new CallLog();
                        var x = initializeFromNative(c);
                        try {
                            // console.log(sms.date);
                            let _d = new Date(parseFloat(String(x.date)));
                            x.date_str = `${_d.toLocaleDateString()} ${_d.toLocaleTimeString().split(' ')[0]}`;
                        } catch (e){
                            console.error('date parse calllog failed > ', e);
                        }
                        cl.push(x);
                    }
                    c.close();
                    resolve({ data: cl, response: "fetch" });
                }
                else {
                    c.close();
                    resolve({ data: null, response: "fetch" });
                }
            } catch (e) {
                // debugger
                console.error('readCallLogs failed > ', e);
                reject(e);
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

    public runUnloaded () {
        if (isAndroid) {
            // >> broadcast-receiver-remove-ts
            // << broadcast-receiver-remove-ts
        }
    }

}

function getWhereClause(args) {
    var whereClause = "";

    if (args && args.filter && args.filter.length > 0) whereClause = "type = " + args.filter[0];
    if (args && args.filter && args.filter.length > 1) {
        for (var x = 1; x < args.filter.length; x++) {
            whereClause += " OR type = " + args.filter[x];
        }
    }

    // if (args && args.contactType && whereClause !== "") whereClause += " AND ";
    // if (args && args.contactType && args.contactType === "1") {
    //     whereClause += "contactid > 0";
    // } else if (args && args.contactType && args.contactType === "0") {
    //     whereClause += "contactid = 0";
    // }

    if (args && args.keepHiddenNumbers === false && whereClause !== "") whereClause += " AND ";
    if (args && args.keepHiddenNumbers === false) {
        whereClause += "number != -2";
    }

    return whereClause;
}

function initializeFromNative (cursor) {
    var CallLogs = android.provider.CallLog.Calls;
    var mainCursorJson = convertNativeCursorToJson(cursor);

    const callLogEntry = <CallLog>{};
    callLogEntry.number = mainCursorJson[CallLogs.NUMBER];
    callLogEntry.type = mainCursorJson[CallLogs.TYPE];
    callLogEntry.date = +mainCursorJson[CallLogs.DATE];
    callLogEntry.duration = mainCursorJson[CallLogs.DURATION];
    callLogEntry.name = mainCursorJson["name"];
    callLogEntry.label = mainCursorJson["numberlabel"];
    return callLogEntry;
};

function convertNativeCursorToJson (cursor) {
    //noinspection JSUnresolvedFunction
    var count = cursor.getColumnCount();
    var results = {};

    for (var i=0; i < count; i++) {
        var type = cursor.getType(i);
        //noinspection JSUnresolvedFunction
        var name = cursor.getColumnName(i);

        if (name === 'date') {
            results[name] = cursor.getString(i);
        } else {
            switch (type) {
                case 0: // NULL
                    results[name] = null;
                    break;
                case 1: // Integer
                    //noinspection JSUnresolvedFunction
                    results[name] = cursor.getInt(i);
                    break;
                case 2: // Float
                    //noinspection JSUnresolvedFunction
                    results[name] = cursor.getFloat(i);
                    break;
                case 3: // String
                    results[name] = cursor.getString(i);
                    break;
                case 4: // Blob
                    results[name] = cursor.getBlob(i);
                    break;
                default:
                    throw new Error('CallLog - Unknown Field Type '+ type);
            }
        }
    }

    return results;
};

