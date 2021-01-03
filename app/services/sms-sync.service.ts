import { firebase, firestore } from "@nativescript/firebase";
import { SmsListPageModel } from "~/pages/sms-list/sms-list-view-model.android";
import { SMS } from "~/shared/SMS.interface";

const firebaseWebApi = require("@nativescript/firebase/app");

const _smsList = []; let _lastTimestamp = 0;

export function calculateandPushMessages() {
    firebaseWebApi.initializeApp();

    const smsListModel = new SmsListPageModel();
    
    firebase.getCurrentUser().then((data:firebase.User) => {
        console.log('firebase.getCurrentUser success <<<<')
        //console.log(data);
        // let batch = firestore.batch();
        
        if(_smsList.length === 0) {

            firestore.collection(`user/${data.uid}/sms`).get().then((querySnapshot:firestore.QuerySnapshot) => {
                let _datapresent =  false;

                querySnapshot.docs.length > 0 ? _datapresent = true : _datapresent = false;
                querySnapshot.docs.every(doc => {
                    if(doc.exists){
                        let _smsEntry = <SMS>(<any>doc.data());
                        _smsList.push(_smsEntry);

                        if(+_smsEntry.date > _lastTimestamp) {
                            _lastTimestamp = +_smsEntry.date;
                        }
                    }
                    return true;
                });

                if(!_datapresent) {
                    console.log('>> data not present...')
                    smsListModel.smsList.forEach(sms => {
                        _smsList.push(sms);
                        firestore.add(`user/${data.uid}/sms`, sms).catch(err => {
                            console.error(`firestore document add failed.`);
                        });
                    });
                    
                } else {
                    readAndPushSmses(smsListModel, data);
                }

            });
        } else {
            readAndPushSmses(smsListModel, data);
        }

        
    });
}

function readAndPushSmses(smsListModel: SmsListPageModel, data: firebase.User) {
    console.log(`>> last timestamp >> ${_lastTimestamp}`);
    // adding +1 would eliminate last sms getting entered again.
    smsListModel.readSmsesAfterDate(+_lastTimestamp + 1).then((smses: Array<SMS>) => {
        const _filteredsmses = smses.filter(sms => {
            return _smsList.findIndex(doc => (<SMS>doc).id === sms.id && +(<SMS>(doc)).date === +sms.date) === -1;
        });
        _lastTimestamp = _filteredsmses.reduce((acc,curr) => Math.max(...[acc, +curr.date]),0);
        _filteredsmses.forEach(sms => {
            _smsList.push(sms);
            firestore.add(`user/${data.uid}/sms`, sms).catch(err => {
                console.error(`firestore document add failed.`);
            });
        });
    });
}
