package com.ibmprod.util

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

object SecurePrefs {
  private const val PREFS_FILENAME = "secure_prefs"

  fun get(context: Context): EncryptedSharedPreferences {
    val masterKey = MasterKey.Builder(context)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()

    return EncryptedSharedPreferences.create(
      context,
      PREFS_FILENAME,
      masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
  }

  fun putJwt(context: Context, jwt: String) {
    val prefs = get(context)
    prefs.edit().putString("auth_jwt", jwt).apply()
  }

  fun getJwt(context: Context): String? {
    val prefs = get(context)
    return prefs.getString("auth_jwt", null)
  }

  fun clearJwt(context: Context) {
    val prefs = get(context)
    prefs.edit().remove("auth_jwt").apply()
  }
}
