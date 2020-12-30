import { EventData, Page } from "@nativescript/core";
import { DBService } from "~/services/db.service";

import { LoginModel } from "./login-model";

var page: Page;

export function pageLoaded(args: EventData) {
    console.log("login page loaded>>> ");
    page = <Page>args.object;
    page.bindingContext = new LoginModel();

    // check for login if found redirect
    let dbSvc = new DBService();
    if(dbSvc.getUser().length > 0){
    
        // page.frame.navigate({
        //     moduleName: 'home-root',
        //     clearHistory: true
        // });
        
    }

}