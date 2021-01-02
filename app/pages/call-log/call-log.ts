import { EventData, Page } from '@nativescript/core';
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view";
import { GridLayout, ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { PullToRefresh } from '@nstudio/nativescript-pulltorefresh';
import { firebase, firestore } from '@nativescript/firebase';
import { SMS } from '~/shared/SMS.interface';
import { CallListPageModel } from './call-list-view-model';

let page:Page;
export function onPageLoaded(args:EventData) {
    page = <Page>args.object;
    console.log('>>>call log page loaded called');

    page.bindingContext = new CallListPageModel();
}