import { setActivityCallbacks } from "@nativescript/core";
import { AndroidActivityCallbacks } from "@nativescript/core/ui/frame/frame-common";

// android.app.Activity.extend("com.tns.activities.NotificationActivity", {
//     onCreate: function(bundle) {
//         _super.prototype.onCreate.call(this, bundle);
//     }
// });

export class NotificationActivity extends android.app.Activity {

    private _callbacks: AndroidActivityCallbacks;
    
    onCreate(savedInstanceState: android.os.Bundle) {

        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

        this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), super.onCreate);
    }
}