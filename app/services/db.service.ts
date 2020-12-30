import { Couchbase } from "nativescript-couchbase-plugin";

const database = new Couchbase('one-less-db');

export class DBService {
    constructor() {

    }

    getUser() {
        return database.query({
            select: [], // Leave empty to query for all
            where: [{ property: 'type', comparison: 'equalTo', value: 'user' }]
        });
    }

    saveUser(user) {
        var _users = this.getUser();
        if(_users.length === 0) {
            return database.createDocument({
                type: 'user',
                data: JSON.stringify(user)
            });
        } else { 
            return database.updateDocument(_users[0].id, JSON.stringify(user));
        }
    }
}