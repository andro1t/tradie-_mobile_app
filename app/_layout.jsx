import { Slot } from "expo-router";
import { UserProvider } from "../context/UserContext";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform, Alert } from "react-native";

// Configure notification behavior (banner, sound, alert)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    // Android channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Register for push notifications
    async function registerForPush() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Notification permissions not granted!"
        );
        return;
      }
    }

    // Get Expo push token
    async function getToken() {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Expo Push Token:", token.data);
    }

    registerForPush();
    getToken();

    // Listener for receiving notifications
    const receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    // Listener for when user taps a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification clicked:", response);
      });

    // Clean up listeners on unmount
    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
