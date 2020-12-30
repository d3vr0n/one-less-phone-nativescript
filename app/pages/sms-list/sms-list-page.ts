/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { EventData, Page } from '@nativescript/core';
import { SmsListPageModel } from './sms-list-view-model';
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";

const firebaseWebApi = require("@nativescript/firebase/app");

// Event handler for Page 'navigatingTo' event attached in main-page.xml
export function navigatingTo(args: EventData) {
    console.log('>>> page navigating to called');
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    const page = <Page>args.object;

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

    // firebaseWebApi.initializeApp();
}

export function onPageLoaded(args:EventData) {
    var page = <Page>args.object;
    console.log('>>> page loaded called');
}