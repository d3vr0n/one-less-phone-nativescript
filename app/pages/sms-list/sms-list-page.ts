/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData, Page } from '@nativescript/core';
import { SmsListPageModel } from './sms-list-view-model';
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import { firebase, firestore } from '@nativescript/firebase';
import { SMS } from '~/shared/SMS.interface';

const firebaseWebApi = require("@nativescript/firebase/app");

let page:Page;

// Event handler for Page 'navigatingTo' event attached in main-page.xml
export function navigatingTo(args: EventData) {
    console.log('>>> page navigating to called');
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    page = <Page>args.object;

    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = new SmsListPageModel();

    firebaseWebApi.initializeApp();

    calculateandPushMessages();

    
}

function calculateandPushMessages() {
    firebase.getCurrentUser().then((data:firebase.User) => {
        console.log('firebase.getCurrentUser success <<<<')
        console.log(data);
        // let batch = firestore.batch();
        let _datapresent =  false; let _lastTimestamp = 0;
        firestore.collection(`user/${data.uid}/sms`).get().then((querySnapshot:firestore.QuerySnapshot) => {
            querySnapshot.docs.length > 0 ? _datapresent = true : _datapresent = false;
            querySnapshot.docs.every(doc => {
                if(doc.exists && +(<SMS>(<any>doc.data())).date > _lastTimestamp) {
                    _lastTimestamp = +(<any>doc.data()).date;
                }
                return true;
            });
            console.log(`>> last timestamp >> ${_lastTimestamp}`);

            if(!_datapresent) {
                console.log('>> data not present...')
                page.bindingContext.smsList.forEach(sms => {
                    firestore.add(`user/${data.uid}/sms`, sms).catch(err => {
                        console.error(`firestore document add failed.`);
                    });
                });
                
            } else {
                // adding +1 would eliminate last sms getting entered again.
                page.bindingContext.readSmsesAfterDate(+_lastTimestamp + 1).then(smses =>{
                    const _filteredsmses = smses.filter(sms => {
                        return querySnapshot.docs.findIndex(doc => (<SMS>(<any>doc.data())).id === sms.id) === -1;
                    });
                    _filteredsmses.forEach(sms => {
                        firestore.add(`user/${data.uid}/sms`, sms).catch(err => {
                            console.error(`firestore document add failed.`);
                        });
                    });
                });
            }

        });

        
    });
}

export function onPageLoaded(args:EventData) {
    page = <Page>args.object;
    console.log('>>> page loaded called');
}

export function refreshList(args:EventData) {
    // Get reference to the PullToRefresh component;
    let pullRefresh = <PullToRefresh>args.object;
    console.log('>>> refreshlist called');
    // Do work here... and when done call set refreshing property to false to stop the refreshing
    pullRefresh.page.bindingContext.readSmses().then(
      (resp) => {
        console.log('>>> refreshlist then');
        pullRefresh.refreshing = false;
        calculateandPushMessages();
      },
      (err) => {
        pullRefresh.refreshing = false;
      }
    );
}

