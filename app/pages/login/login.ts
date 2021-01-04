import { EventData, Page } from "@nativescript/core";
import { DBService } from "~/services/db.service";
import * as permissions from 'nativescript-permissions';
import { LoginModel } from "./login-model";

var page: Page;

export function pageLoaded(args: EventData) {
    console.log("login page loaded>>> ");
    permissions.requestPermissions([android.Manifest.permission.READ_SMS, android.Manifest.permission.RECEIVE_SMS],
        "One-less Phone App needs permission to read your sms messages").then(res => {
            // alert(JSON.stringify(res));
            permissions.requestPermissions([android.Manifest.permission.READ_CALL_LOG, android.Manifest.permission.READ_PHONE_STATE],
                "One-less Phone App needs permission to read your call logs").then((res) => {
                    // alert(JSON.stringify(res));
                }, err => alert(JSON.stringify(err)));
        }, err => alert(JSON.stringify(err)));


    page = <Page>args.object;
    page.bindingContext = new LoginModel();

    // check for login if found redirect
    let dbSvc = new DBService();
    if (dbSvc.getUser().length > 0) {

        page.frame.navigate({
            moduleName: 'home-root',
            clearHistory: true
        });

    }

}