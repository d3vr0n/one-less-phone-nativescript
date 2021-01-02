import { EventData, Page } from '@nativescript/core';
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import { firebase, firestore } from '@nativescript/firebase';
import { CallListPageModel } from './call-list-view-model.android';
import { CallLog } from '~/shared/call-log.interface';
import { isAndroid } from 'tns-core-modules/platform';

const firebaseWebApi = require("@nativescript/firebase/app");

let page:Page;

export function onPageLoaded(args:EventData) {
    page = <Page>args.object;
    console.log('>>>call log page loaded called');

    firebaseWebApi.initializeApp();
    if(isAndroid) {
        page.bindingContext = new CallListPageModel();
    }

    calculateandPushCallLogs();
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
        calculateandPushCallLogs();
      },
      (err) => {
        pullRefresh.refreshing = false;
      }
    );
}

export function onUnloaded() {
    page.bindingContext.runUnloaded();
}

function calculateandPushCallLogs() {
    firebase.getCurrentUser().then((data:firebase.User) => {
        console.log('firebase.getCurrentUser success <<<<')
        console.log(data);
        // let batch = firestore.batch();
        const _firestoreCallList = [];
        firestore.collection(`user/${data.uid}/calllog`).get().then((querySnapshot:firestore.QuerySnapshot) => {
            querySnapshot.docs.every(doc => {
                if(doc.exists) {
                    _firestoreCallList.push(<CallLog>(<any>doc.data()));
                }
                return true;
            });


            // read last 50 calllogs and enter into firestore
            page.bindingContext.readCallLogs().then(callLogs =>{
                const _filteredsmses = callLogs?.data?.filter(callEntry => {
                    return _firestoreCallList.findIndex(doc => (<CallLog>doc).date === callEntry.date) === -1;
                });
                _filteredsmses.forEach(sms => {
                    firestore.add(`user/${data.uid}/calllog`, sms).catch(err => {
                        console.error(`firestore callentry document add failed.`);
                    });
                });
            });
            

        })
        .catch(err => console.error(`user/${data.uid}/calllog get failed`, err));

        
    });
}