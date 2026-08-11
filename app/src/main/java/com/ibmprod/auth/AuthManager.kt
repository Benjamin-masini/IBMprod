package com.ibmprod.auth

import android.content.Context
import com.google.gson.Gson
import com.ibmprod.config.Config
import com.ibmprod.util.SecurePrefs
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

object AuthManager {
  private val client = OkHttpClient()
  private val gson = Gson()
  private val JSON = "application/json; charset=utf-8".toMediaType()

  suspend fun login(context: Context, username: String, password: String): Boolean {
    return withContext(Dispatchers.IO) {
      try {
        val payload = mapOf("username" to username, "password" to password)
        val body = gson.toJson(payload).toRequestBody(JSON)
        val req = Request.Builder()
          .url("${Config.BACKEND_URL}/api/auth/login")
          .post(body)
          .build()

        client.newCall(req).execute().use { resp ->
          if (resp.isSuccessful) {
            val text = resp.body?.string()
            if (text.isNullOrBlank()) return@withContext false
            val map: Map<String, Any> = gson.fromJson(text, Map::class.java)
            val token = map["token"] as? String
            if (!token.isNullOrBlank()) {
              SecurePrefs.putJwt(context, token)
              return@withContext true
            }
          }
          return@withContext false
        }
      } catch (e: Exception) {
        e.printStackTrace()
        return@withContext false
      }
    }
  }

  fun logout(context: Context) {
    SecurePrefs.clearJwt(context)
  }
}
