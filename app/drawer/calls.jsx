import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Calls = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calls Requests</Text>
      <Text style={styles.subtitle}>
        Here you can show call logs, charts, analytics, etc.
      </Text>
    </View>
  );
};

export default Calls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
