
@JavaProxy("io.onelessphone.remotecallsmsreader.Application")
class Application extends android.app.Application {
    onCreate(): void {
        super.onCreate();
    }

    public attachBaseContext(baseContext: any) { // android.content.Context
        super.attachBaseContext(baseContext);
    }
}