package com.GymMate.app;

import android.app.NotificationManager;
import android.content.Context;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() {
        super.onResume();
        clearDeliveredNotifications();
    }

    private void clearDeliveredNotifications() {
        try {
            NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager != null) {
                notificationManager.cancelAll();
            }
        } catch (Exception ignored) {
        }
    }
}
