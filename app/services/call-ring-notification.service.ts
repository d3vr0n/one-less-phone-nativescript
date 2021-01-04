import { firebase, firestore } from "@nativescript/firebase";
import { CallEvent, CallLog } from "~/shared/call-log.interface";

const firebaseWebApi = require("@nativescript/firebase/app");

export function pushCallRing(callData: CallEvent) {
    firebaseWebApi.initializeApp();

    firebase.getCurrentUser().then((user: firebase.User) => {
        console.log('firebase.getCurrentUser success <<<<')

        firestore.collection(`user/${user.uid}/callring`).get().then((querySnapshot: firestore.QuerySnapshot) => {
            if (querySnapshot.docs.length > 0) {
                querySnapshot.docs.every(doc => {
                    if (doc.exists) {
                        if(callData.isRinging) {
                            firestore.doc(`user/${user.uid}/callring`,`${doc.id}`).set(callData).catch(err => {
                                console.error(JSON.stringify(err));
                                alert(JSON.stringify(err));
                            });
                        } else {
                            firestore.collection(`user/${user.uid}/callring`).doc(`${doc.id}`).update({ "isRinging": false, date: callData.date }).catch(err => {
                                console.error(JSON.stringify(err));
                                alert(JSON.stringify(err));
                            });
                        }
                    }
                    return true;
                });
            } else {
                firestore.collection(`user/${user.uid}/callring`).add(callData).catch(err => {
                    console.error(JSON.stringify(err));
                    alert(JSON.stringify(err));
                });
            }
        });

    });
}

