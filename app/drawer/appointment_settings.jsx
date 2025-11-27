import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";

const AppointmentSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [remindHour, setRemindHour] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Settings</Text>
      <Text style={styles.subtitle}>Configure your preferences.</Text>

      {/* Notification Settings */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Reminder: 1 hour before</Text>
        <Switch value={remindHour} onValueChange={setRemindHour} />
      </View>

      {/* Auto Confirm */}
      <View style={styles.row}>
        <Text style={styles.label}>Auto-confirm appointments</Text>
        <Switch value={autoConfirm} onValueChange={setAutoConfirm} />
      </View>

      {/* Preferred Time - Placeholder buttons */}
      <Text style={[styles.subtitle, { marginTop: 20 }]}>Preferred Time</Text>
      <Pressable style={styles.timeBox}>
        <Text>Select Time Range</Text>
      </Pressable>
    </View>
  );
};

export default AppointmentSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffeff1",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  timeBox: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
  },
});
