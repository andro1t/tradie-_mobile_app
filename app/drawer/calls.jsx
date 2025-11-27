import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const staffList = [
  { id: 1, name: "Customer Support", phone: "09171234567" },
  { id: 2, name: "Technician", phone: "09181234567" },
  { id: 3, name: "Manager", phone: "09123456789" },
];

const Calls = () => {
  const [callLogs, setCallLogs] = useState([]);

  const makeCall = (person) => {
    // Log the call
    const newLog = {
      id: Date.now(),
      name: person.name,
      type: "Outgoing",
      time: new Date().toLocaleString(),
    };

    setCallLogs([newLog, ...callLogs]);

    // Trigger phone dialer
    Linking.openURL(`tel:${person.phone}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calls</Text>

      {/* Staff You Can Call */}
      <Text style={styles.sectionTitle}>Staff You Can Call</Text>
      {staffList.map((person) => (
        <View key={person.id} style={styles.staffRow}>
          <View>
            <Text style={styles.staffName}>{person.name}</Text>
            <Text style={styles.staffNumber}>{person.phone}</Text>
          </View>
          <Pressable style={styles.callButton} onPress={() => makeCall(person)}>
            <Icon name="call" size={20} color="white" />
          </Pressable>
        </View>
      ))}

      {/* Call Logs */}
      <Text style={styles.sectionTitle}>Recent Calls</Text>

      {callLogs.length === 0 ? (
        <Text style={styles.empty}>No recent calls.</Text>
      ) : (
        <FlatList
          data={callLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.logRow}>
              <Icon
                name={
                  item.type === "Outgoing"
                    ? "arrow-up"
                    : item.type === "Missed"
                    ? "close"
                    : "arrow-down"
                }
                size={18}
                color="#333"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={styles.logName}>{item.name}</Text>
                <Text style={styles.logTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Calls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff7f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  staffRow: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "600",
  },
  staffNumber: { color: "#666" },
  callButton: {
    backgroundColor: "#ff4d6d",
    padding: 10,
    borderRadius: 50,
  },
  logRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  logName: { fontSize: 15, fontWeight: "500" },
  logTime: { fontSize: 12, color: "#777" },
  empty: {
    marginTop: 10,
    color: "#aaa",
    fontStyle: "italic",
  },
});
