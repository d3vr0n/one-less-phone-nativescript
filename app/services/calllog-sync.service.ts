import { firebase, firestore } from "@nativescript/firebase";
import { CallListPageModel } from "~/pages/call-log/call-list-view-model.android";
import { CallLog } from "~/shared/call-log.interface";

const firebaseWebApi = require("@nativescript/firebase/app");

const _firestoreCallList = [];

export function calculateandPushCalllogs() {
    firebaseWebApi.initializeApp();

    const callListModel = new CallListPageModel();
    
    firebase.getCurrentUser().then((user:firebase.User) => {
        console.log('firebase.getCurrentUser success <<<<')
        //console.log(user);
        // let batch = firestore.batch();
        
        if(_firestoreCallList.length === 0) {

            firestore.collection(`user/${user.uid}/calllog`).get().then((querySnapshot:firestore.QuerySnapshot) => {
                querySnapshot.docs.every(doc => {
                    if(doc.exists) {
                        _firestoreCallList.push(<CallLog>(<any>doc.data()));
                    }
                    return true;
                });

                // read last 50 calllogs and enter into firestore
                filterAndPushCallLogs(callListModel, user);
            }); 
        } else {
            filterAndPushCallLogs(callListModel, user);
        }

        
    });
}

function filterAndPushCallLogs(callListModel: CallListPageModel, user: firebase.User) {
    callListModel.readCallLogs().then(callLogs => {
        const _filteredsmses = (<any>callLogs)?.data?.filter(callEntry => {
            return _firestoreCallList.findIndex(doc => (<CallLog>doc).date === callEntry.date) === -1;
        });
        _filteredsmses.forEach(sms => {
            firestore.add(`user/${user.uid}/calllog`, sms).catch(err => {
                console.error(`firestore callentry document add failed.`);
            });
        });
    });
}

