import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import FirstSubscriptionModal from "../../components/FirstSubscriptionModal";
import { BarChart } from "react-native-chart-kit";

const Home = () => {
  const router = useRouter();
  const { showSubscription } = useLocalSearchParams();

  // Show modal if flag == "1"
  const [showSubModal, setShowSubModal] = useState(false);

  useEffect(() => {
    if (showSubscription === "1") {
      setShowSubModal(true);
    }
  }, [showSubscription]);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(200, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    style: { borderRadius: 8 },
  };

  return (
    <View style={styles.container}>
      {/* Calls Card */}
      <Pressable onPress={() => router.push("/drawer/calls")}>
        <View style={[styles.card, { bottom: 100 }]}>
          <Text style={styles.cardTitle}>Calls</Text>

          <BarChart
            data={{
              labels: ["Mon", "Tue", "Wed"],
              datasets: [{ data: [4, 2, 7] }],
            }}
            width={250}
            height={90}
            chartConfig={chartConfig}
            withInnerLines={false}
            fromZero
          />
        </View>
      </Pressable>

      {/* Appointment Settings */}
      <Pressable onPress={() => router.push("/drawer/appointmentSettings")}>
        <View style={[styles.card, { bottom: 55 }]}>
          <Text style={styles.cardTitle}>Appointment Settings</Text>
        </View>
      </Pressable>

      {/* Reports */}
      <View style={[styles.card, { bottom: 10 }]}>
        <Text style={styles.cardTitle}>Reports</Text>
      </View>

      {/* Chat Icon */}
      <Link href="/drawer/chat" style={styles.chaticon}>
        <Icon name="comments" size={50} color="#900" />
      </Link>

      {/* Subscription Modal */}
      <FirstSubscriptionModal
        visible={showSubModal}
        onClose={() => setShowSubModal(false)}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffeff1",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    width: 300,
    height: 155,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chaticon: {
    position: "absolute",
    bottom: 50,
    right: 50,
  },
});
