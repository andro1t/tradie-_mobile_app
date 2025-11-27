import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../../constants/Colors";
import Spacer from "../../components/Spacer";

const Settings = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subheader}>Manage your account & preferences</Text>

      <ScrollView style={styles.list}>
        {/* Subscription */}
        <Pressable
          style={styles.item}
          onPress={() => router.push("../subscription/SubscriptionScreen")}
        >
          <View style={styles.row}>
            <Icon name="credit-card" size={20} color={Colors.primary} />
            <Text style={styles.itemText}>Manage Subscription</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#999" />
        </Pressable>

        {/* Profile */}
        <Pressable
          style={styles.item}
          onPress={() => router.push("../drawer/profile")}
        >
          <View style={styles.row}>
            <Icon name="user" size={20} color={Colors.primary} />
            <Text style={styles.itemText}>Profile</Text>
          </View>
          <Icon name="chevron-right" size={16} color="#999" />
        </Pressable>

        {/* Logout Example */}
        <Pressable style={styles.item}>
          <View style={styles.row}>
            <Icon name="sign-out" size={20} color="red" />
            <Text style={[styles.itemText, { color: "red" }]}>Logout</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#ffeff1",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  subheader: {
    marginTop: 5,
    marginBottom: 30,
    color: "#666",
  },

  list: {
    marginTop: 10,
  },

  item: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
