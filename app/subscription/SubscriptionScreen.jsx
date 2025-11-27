import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import SubscriptionDetailsModal from "../../components/SubscriptionDetailsModal";
import { Colors } from "../../constants/Colors";
import Spacer from "../../components/Spacer";

const SubscriptionScreen = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // New state for the active subscription
  const [activeSubscription, setActiveSubscription] = useState(null);

  // Use useFocusEffect to refresh data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("accessToken");
          const storedSub = await AsyncStorage.getItem("USER_SUBSCRIPTION");

          if (isActive) {
            if (storedSub) {
              setActiveSubscription(JSON.parse(storedSub));
            } else {
              setActiveSubscription(null); // Ensure it's null if nothing is stored
            }

            const response = await fetch(
              "https://api.geekifypeople.geekify.global/api/v1/plans",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );

            const json = await response.json();
            setPlans(json.data || []);
          }
        } catch (e) {
          console.log("Error loading subscription data", e);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleConfirmedSubscription = async (plan) => {
    setShowModal(false);

    // Mark subscription screen as seen
    await AsyncStorage.setItem("hasSeenSubscription", "true");

    router.push({
      pathname: "/payment",
      params: {
        planName: plan.name,
        planPrice: plan.price,
        planCurrency: plan.currency,
      },
    });
  };

  const openPlanDetails = async (planId) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(
        `https://api.geekifypeople.geekify.global/api/v1/plans/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      setSelectedPlan(json.data);
      setShowModal(true);
    } catch (error) {
      console.log("Error fetching plan details:", error);
    }
  };

  const handleManageSubscription = () => {
    Alert.alert("Manage Subscription", "This feature is coming soon!");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Spacer height={20} />
      <Text style={styles.header}>Choose Subscription</Text>
      <Text style={styles.subheader}>
        Get access to our services depending on your chosen subscription.
      </Text>

      {/* --- ACTIVE SUBSCRIPTION UI --- */}
      {activeSubscription ? (
        <View style={styles.activeContainer}>
          <View style={styles.activeHeaderRow}>
            <Text style={styles.activeLabel}>CURRENT PLAN</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.activeCard}>
            <View>
              <Text style={styles.activePlanName}>
                {activeSubscription.planName}
              </Text>
              {/* Defensive string coercion using template literals */}
              <Text style={styles.activePrice}>
                {`${activeSubscription.planCurrency} ${activeSubscription.planPrice}`}
              </Text>
              <Text style={styles.activeMeta}>
                {`Purchased: ${new Date(
                  activeSubscription.purchasedAt
                ).toLocaleDateString()}`}
              </Text>
              <Text style={styles.activeMeta}>
                {`Method: ${activeSubscription.paymentMethod}`}
              </Text>
            </View>

            <Pressable
              onPress={handleManageSubscription}
              style={styles.manageBtn}
            >
              <Text style={styles.manageBtnText}>Manage</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>
        {activeSubscription ? "Other Available Plans" : "Available Plans"}
      </Text>

      {plans.map((plan) => {
        // Check if the current plan is the user's active plan
        const isActivePlan = activeSubscription?.planName === plan.name;

        return (
          <View key={plan.id} style={styles.card}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              {/* Defensive string coercion using template literals */}
              <Text style={styles.price}>
                {`$${plan.price}/${plan.invoice_interval}`}
              </Text>
              <Text style={styles.billingText}>
                {`Recurring ${plan.invoice_interval} billing`}
              </Text>
            </View>
            <Pressable
              style={[
                styles.subscribeBtn,
                isActivePlan && styles.currentPlanBtn, // Apply disabled/current style
              ]}
              onPress={() => openPlanDetails(plan.id)}
              disabled={isActivePlan} // Disable the button if it's the current plan
            >
              <Text style={styles.subscribeText}>
                {isActivePlan ? "Active" : "Subscribe"}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {showModal && selectedPlan && (
        <SubscriptionDetailsModal
          visible={showModal}
          plan={selectedPlan}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmedSubscription}
        />
      )}
      <Spacer height={40} />
    </ScrollView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffeff1",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: Colors.primary,
  },
  subheader: {
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    marginTop: 10,
  },

  // Active Plan Styles (Already existing)
  activeContainer: {
    marginBottom: 10,
  },
  activeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  activeLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    letterSpacing: 1,
  },
  activeBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  activeCard: {
    backgroundColor: "#E3F2FD", // Light Blue
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#2196F3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  activePlanName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D47A1",
  },
  activePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1565C0",
    marginVertical: 4,
  },
  activeMeta: {
    fontSize: 12,
    color: "#546E7A",
  },
  manageBtn: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  manageBtnText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 12,
  },

  // Standard Card Styles
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },
  billingText: {
    fontSize: 13,
    color: "gray",
    marginTop: 4,
  },
  subscribeBtn: {
    backgroundColor: "#d31e31",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  subscribeText: {
    color: "white",
    fontWeight: "bold",
  },
  // For the currently active plan button
  currentPlanBtn: {
    backgroundColor: "#ccc", // Grey out the button
    borderColor: "#aaa",
    borderWidth: 1,
  },
});
