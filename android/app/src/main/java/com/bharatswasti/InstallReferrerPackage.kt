package com.bharatswasti

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.uimanager.ViewManager // This import is unnecessary, so remove it

class InstallReferrerPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(InstallReferrerModule(reactContext))
    }

    // No need to create view managers if you are not creating custom UI components
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList() // This is fine since we don't need any view managers
    }
}
