import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const serviceCategories = [
  { id: 1, name: "Electrical Repair", icon: "flash-outline" },
  { id: 2, name: "Plumbing", icon: "water-outline" },
  { id: 3, name: "Appliance Fix", icon: "hammer-outline" },
  { id: 4, name: "Cleaning Services", icon: "broom-outline" },
];

const Service = () => {
  const [serviceLogs, setServiceLogs] = useState([]);

  const handleSelectService = (service) => {
    // Create a log entry
    const newLog = {
      id: Date.now(),
      name: service.name,
      status: "Selected",
      time: new Date().toLocaleString(),
    };

    setServiceLogs([newLog, ...serviceLogs]);

    // Simulate action (e.g., navigating or opening a modal)
    Alert.alert("Service Selected", `You selected ${service.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      {/* Available Services List */}
      <Text style={styles.sectionTitle}>Available Categories</Text>
      {serviceCategories.map((cat) => (
        <View key={cat.id} style={styles.serviceRow}>
          <View style={styles.serviceInfo}>
            {/* Icon Container */}
            <View style={styles.iconContainer}>
              <Icon name={cat.icon} size={22} color="#ff4d6d" />
            </View>
            <Text style={styles.serviceName}>{cat.name}</Text>
          </View>

          <Pressable
            style={styles.actionButton}
            onPress={() => handleSelectService(cat)}
          >
            <Icon name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      ))}

      {/* Recent Activity Logs (Mirrors the Calls Log UI) */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      {serviceLogs.length === 0 ? (
        <Text style={styles.empty}>No recent service activity.</Text>
      ) : (
        <FlatList
          data={serviceLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.logRow}>
              <Icon
                name="checkmark-circle-outline"
                size={20}
                color="#ff4d6d"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={styles.logName}>{item.name}</Text>
                <Text style={styles.logTime}>{item.time}</Text>
              </View>
            </View>
          )}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff7f7", // Matches calls.jsx background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
    color: "#444",
  },

  // Service Row Styles (Matches staffRow)
  serviceRow: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff0f3", // Light pink background for icon
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Action Button (Matches callButton)
  actionButton: {
    backgroundColor: "#ff4d6d", // Pink/Red theme
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  // Log Row Styles (Matches logRow)
  logRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    alignItems: "center",
  },
  logName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  logTime: {
    fontSize: 12,
    color: "#777",
  },
  empty: {
    marginTop: 10,
    color: "#aaa",
    fontStyle: "italic",
  },
});
