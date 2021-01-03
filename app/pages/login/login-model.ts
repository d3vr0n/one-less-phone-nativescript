import { Observable, alert } from "@nativescript/core";
import { firebase } from '@nativescript/firebase';
import { DBService } from "~/services/db.service";

export class LoginModel extends Observable {

    public onTap(args) {
        console.log("model tap clicked")

        var button = args.object;
        button.text = "Clicked";
        firebase.login({
            // note that you need to enable Google auth in your firebase instance
            type: firebase.LoginType.GOOGLE,
            googleOptions: {
                scopes: [
                    "email"
                    // "https://www.googleapis.com/auth/contacts.readonly",
                    // "https://www.googleapis.com/auth/user.birthday.read"
                ]
            }
        }).then(
            result => {
                // console.log("Google login OK: " + JSON.stringify(result.additionalUserInfo));
                // console.log("Google login OK, photoURL: " + result.photoURL);
                // alert({
                //     title: "Login OK",
                //     message: JSON.stringify(result),
                //     okButtonText: "Nice!"
                // });
                let dbSvc = new DBService();
                dbSvc.saveUser(result);
                button.page.frame.navigate({
                    moduleName: 'home-root',
                    clearHistory: true
                });
            },
            errorMessage => {
                alert({
                    title: "Login error",
                    message: errorMessage,
                    okButtonText: "OK, pity"
                });
                console.error("Failed login" + errorMessage);
            }
        );
    }

}