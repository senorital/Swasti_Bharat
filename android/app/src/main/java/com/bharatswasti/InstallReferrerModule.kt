package com.bharatswasti

import android.util.Log
import com.android.installreferrer.api.InstallReferrerClient
import com.android.installreferrer.api.InstallReferrerStateListener
import com.android.installreferrer.api.ReferrerDetails
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback

class InstallReferrerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var referrerClient: InstallReferrerClient? = null

    override fun getName(): String {
        return "InstallReferrerModule"
    }

    // Method to get the referrer code from Play Store
    @ReactMethod
    fun getInstallReferrerCode(callback: Callback) {
        // Initialize the referrer client
        referrerClient = InstallReferrerClient.newBuilder(reactApplicationContext).build()

        // Connect to the referrer service
        referrerClient?.startConnection(object : InstallReferrerStateListener {
            override fun onInstallReferrerSetupFinished(responseCode: Int) {
                if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
                    try {
                        // Get the referrer details
                        val referrerDetails: ReferrerDetails = referrerClient!!.installReferrer
                        val referrerUrl = referrerDetails.installReferrer
                        Log.d("InstallReferrer", "Referrer URL: $referrerUrl")

                        // Extract the referral code from the URL (adjust based on your URL format)
                        val referralCode = referrerUrl?.split("c=")?.get(1)

                        if (referralCode != null) {
                            callback.invoke(referralCode) // Pass the code to the callback
                        } else {
                            callback.invoke("No referral code found")
                        }
                    } catch (e: Exception) {
                        Log.e("InstallReferrer", "Error extracting referrer", e)
                        callback.invoke("Error extracting referrer")
                    }
                } else {
                    callback.invoke("Failed to connect to referrer service, response code: $responseCode")
                }
            }

            override fun onInstallReferrerServiceDisconnected() {
                Log.e("InstallReferrer", "Referrer service disconnected")
                callback.invoke("Referrer service disconnected")
            }
        })
    }
}
