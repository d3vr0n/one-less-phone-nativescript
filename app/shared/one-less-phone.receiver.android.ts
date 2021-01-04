import * as calllogSyncSvc from '../services/calllog-sync.service';
import * as callRingNotifier from '../services/call-ring-notification.service';
import { CallEvent } from './call-log.interface';

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
                console.log(">>>>> calloffhook got called <<<");
                callRingNotifier.pushCallRing(<CallEvent>{
                    date: new Date().getTime(),
                    number: number,
                    isRinging: false
                });
                calllogSyncSvc.calculateandPushCalllogs();
                break;
            case android.telephony.TelephonyManager.CALL_STATE_IDLE:
                if(!number) return;
                callRingNotifier.pushCallRing(<CallEvent>{
                    date: new Date().getTime(),
                    number: number,
                    isRinging: false
                });
                calllogSyncSvc.calculateandPushCalllogs();
                break;
            case android.telephony.TelephonyManager.CALL_STATE_RINGING:
                if(!number) return;
                console.log("call is coming");
                callRingNotifier.pushCallRing(<CallEvent>{
                    date: new Date().getTime(),
                    number: number,
                    isRinging: true
                });
                break;
        }

    }
 }