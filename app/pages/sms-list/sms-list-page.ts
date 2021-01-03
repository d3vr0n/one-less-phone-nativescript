/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData, Page } from '@nativescript/core';
import { SmsListPageModel } from './sms-list-view-model.android';
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import * as smsSyncSvc from '~/services/sms-sync.service';
import { isAndroid } from 'tns-core-modules/platform';

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
    if(isAndroid) {
        page.bindingContext = new SmsListPageModel();
    }

    firebaseWebApi.initializeApp();
    
}



export function onPageLoaded(args:EventData) {
    page = <Page>args.object;
    console.log('>>> smslist page loaded called');

    smsSyncSvc.calculateandPushMessages();
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
        smsSyncSvc.calculateandPushMessages();
      },
      (err) => {
        pullRefresh.refreshing = false;
      }
    );
}

