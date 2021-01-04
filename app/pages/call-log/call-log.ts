import { EventData, Page } from '@nativescript/core';
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import { firebase, firestore } from '@nativescript/firebase';
import { CallListPageModel } from './call-list-view-model.android';
import { CallLog } from '~/shared/call-log.interface';
import { isAndroid } from '@nativescript/core/platform';

import * as calllogSyncSvc from '../../services/calllog-sync.service';

const firebaseWebApi = require("@nativescript/firebase/app");

let page:Page;

export function onPageLoaded(args:EventData) {
    page = <Page>args.object;
    console.log('>>>call log page loaded called');

    firebaseWebApi.initializeApp();
    if(isAndroid) {
        page.bindingContext = new CallListPageModel();
        page.bindingContext.init();
    }

    calllogSyncSvc.calculateandPushCalllogs();
}

export function refreshList(args:EventData) {
    // Get reference to the PullToRefresh component;
    let pullRefresh = <PullToRefresh>args.object;
    console.log('>>> refreshlist called');
    // Do work here... and when done call set refreshing property to false to stop the refreshing
    pullRefresh.page.bindingContext.readCallLogs().then(
      (resp) => {
        console.log('>>> refreshlist then');
        pullRefresh.refreshing = false;
        calllogSyncSvc.calculateandPushCalllogs();
      },
      (err) => {
        pullRefresh.refreshing = false;
      }
    );
}

export function onUnloaded() {
    page.bindingContext.runUnloaded();
}
