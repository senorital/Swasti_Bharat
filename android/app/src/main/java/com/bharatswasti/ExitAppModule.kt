package com.bharatswasti

import android.app.Activity
import android.os.Process
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExitAppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "ExitApp"
    }

    @ReactMethod
    fun exitApp() {
        val activity: Activity? = currentActivity
        activity?.finishAffinity()  // Close all activities
        Process.killProcess(Process.myPid())  // Kill the process
    }
}
