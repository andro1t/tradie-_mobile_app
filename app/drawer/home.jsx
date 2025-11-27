import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const { showSubscription } = useLocalSearchParams();
  const [showSubModal, setShowSubModal] = useState(false);
  const insets = useSafeAreaInsets(); // Safe area for floating button

  useEffect(() => {
    if (showSubscription === "1") {
      setShowSubModal(true);
    }
  }, [showSubscription]);

  useEffect(() => {
    if (showSubModal) {
      router.replace("/subscription");
    }
  }, [showSubModal, router]);

  return (
    <View style={styles.fullContainer}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Pressable onPress={() => router.push("/drawer/profile")}>
            <Icon name="user-circle" size={30} color="#444" />
          </Pressable>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtext}>Manage your work, calls, and reports</Text>

        {/* Cards Section */}
        <View style={styles.grid}>
          {/* Calls Card */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/drawer/calls")}
          >
            <Icon name="phone" size={34} color={Colors.primary} />
            <View>
              <Text style={styles.cardTitle}>Calls</Text>
              <Text style={styles.cardDesc}>View call logs & history</Text>
            </View>
          </Pressable>

          {/* Appointments Card */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/drawer/appointment_settings")}
          >
            <Icon name="calendar" size={30} color={Colors.primary} />
            <View>
              <Text style={styles.cardTitle}>Appointments</Text>
              <Text style={styles.cardDesc}>Manage bookings & schedules</Text>
            </View>
          </Pressable>

          {/* Reports Card */}
          <Pressable
            style={styles.card}
            onPress={() => router.push("/drawer/report")}
          >
            <Icon name="line-chart" size={26} color={Colors.primary} />
            <View>
              <Text style={styles.cardTitle}>Reports</Text>
              <Text style={styles.cardDesc}>View activity insights</Text>
            </View>
          </Pressable>
        </View>

        {/* Spacer for bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Chat Button */}
      <Pressable
        onPress={() => router.push("/drawer/chat")}
        style={[styles.chatButton, { bottom: insets.bottom + 20 }]}
      >
        <Icon name="comments" size={28} color="#fff" style={styles.chatIcon} />
      </Pressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#ffeff1",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtext: {
    color: "#666",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "column",
    gap: 15,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  chatButton: {
    position: "absolute",
    right: 20,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chatIcon: {
    marginTop: 2,
    marginLeft: 1,
  },
});
