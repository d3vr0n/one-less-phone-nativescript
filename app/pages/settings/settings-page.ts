import * as applicationModule from "@nativescript/core/application";
import { android as androidApp } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import { Page, NavigatedData } from "@nativescript/core";


var utils = require("@nativescript/core/utils/utils");
var jobScheduler = require("../../shared/job-scheduler");

let vm;

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    // page.actionBar.title = "";
    vm = new Observable();
    vm.set("info", "Using Android Broadcast Receiver \nto check the battery life");
    vm.set("batteryLife", "0");
    vm.set("isAndroid", isAndroid);
    page.bindingContext = vm;
    // page.actionBar.title = args.context.title;

    vm.set("onTap", onTap);
}

export function onNavigatedTo(args: NavigatedData) {
    // vm.set("actionBarTitle", args.context.actionBarTitle);

    // >> app-class-properties
    // import { android as androidApp } from "@nativescript/core/application";
    let isPaused = androidApp.paused; // e.g. false
    let packageName = androidApp.packageName; // The package ID e.g. org.nativescript.nativescriptsdkexamplesng
    let nativeApp = androidApp.nativeApp; // The native APplication reference
    let foregroundActivity = androidApp.foregroundActivity; // The current Activity reference
    let context = androidApp.context; // The current Android context
    // << app-class-properties

    // >> broadcast-receiver-ts
    if (isAndroid) {
        // use tns-platform-dclarations to access native APIs (e.g. android.content.Intent)
        let receiverCallback = (androidContext, intent) => {
            const level = intent.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1);
            const scale = intent.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, -1);
            const percent = (level / scale) * 100.0;
            vm.set("batteryLife", percent.toString());
        };

        applicationModule.android.registerBroadcastReceiver(
            android.content.Intent.ACTION_BATTERY_CHANGED,
            receiverCallback
        );
    }
    // << broadcast-receiver-ts
}

export function onUnloaded() {
    if (isAndroid) {
        // >> broadcast-receiver-remove-ts
        applicationModule.android.unregisterBroadcastReceiver(android.content.Intent.ACTION_BATTERY_CHANGED);
        // << broadcast-receiver-remove-ts
    }
}

function onTap(args:EventData) {
    console.log('settings page >', 'button tapped');
    jobScheduler.scheduleJob(utils.ad.getApplicationContext());
}
