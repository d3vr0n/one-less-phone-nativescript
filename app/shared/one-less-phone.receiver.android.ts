import * as calllogSyncSvc from '../services/calllog-sync.service';

@NativeClass()
@JavaProxy('io.onelessphone.remotecallsmsreader.OneLessPhoneCallReceiver')
export class OneLessPhoneCallReceiver extends android.content.BroadcastReceiver {
    onReceive (context, intent) {
        console.log('OneLessPhoneCallReceiver called...');
        var tm = context.getSystemService(android.content.Context.TELEPHONY_SERVICE);
        
        let stateStr = intent.getExtras().getString(android.telephony.TelephonyManager.EXTRA_STATE);
        let number = intent.getExtras().getString(android.telephony.TelephonyManager.EXTRA_INCOMING_NUMBER);

        let state = tm.getCallState(); console.log(state, stateStr, number);
        switch(state) {
            case android.telephony.TelephonyManager.CALL_STATE_OFFHOOK:
                calllogSyncSvc.calculateandPushCalllogs();
                break;
            case android.telephony.TelephonyManager.CALL_STATE_RINGING:
                console.log("call is coming");
                break;
        }

    }
 }