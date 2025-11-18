import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppointmentSettings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Settings</Text>
      <Text style={styles.subtitle}>Configure appointment rules here.</Text>

      {/* You can add schedules, toggles, time slots, etc. */}
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
  },
});
