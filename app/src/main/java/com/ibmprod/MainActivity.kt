mkdir -p app/src/main/java/com/ibmprod
cat > app/src/main/java/com/ibmprod/MainActivity.kt <<'EOF'
package com.ibmprod

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
EOF

mkdir -p app/src/main/res/layout
cat > app/src/main/res/layout/activity_main.xml <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="IBMprod"
        android:textSize="24sp"
        android:textStyle="bold" />

</LinearLayout>
EOF

mkdir -p app/src/main/res/values
cat > app/src/main/res/values/strings.xml <<'EOF'
<resources>
    <string name="app_name">IBMprod</string>
</resources>
EOF

cat > app/src/main/res/values/themes.xml <<'EOF'
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.MaterialComponents.DayNight.DarkActionBar" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="android:statusBarColor">@android:color/black</item>
    </style>
</resources>
EOF
