import * as smsSyncSvc from '~/services/sms-sync.service';

@NativeClass()
@JavaProxy('io.onelessphone.remotecallsmsreader.SmsBroadcastReceiver')
export class SmsBroadcastReceiver extends android.content.BroadcastReceiver {
    onReceive (context, intent) {
        console.log('SmsBroadcastReceiver called...');
        smsSyncSvc.calculateandPushMessages();

    }
 }