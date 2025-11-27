import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/Colors";
import Spacer from "./Spacer";
import { useRouter } from "expo-router";

const SubscriptionDetailsModal = ({ visible, plan, onClose, onConfirm }) => {
  const router = useRouter();
  const safePlan = plan ?? {}; // prevents undefined errors

  const handleConfirmSubscription = () => {
    // 1. Hide the current details modal
    onClose();

    // 2. Navigate to the Payment Screen, passing plan details
    router.push({
      pathname: "/payment", // 👈 This must match the file name: app/payment.jsx
      params: {
        planName: safePlan.name,
        planPrice: safePlan.price,
        planCurrency: safePlan.currency,
        // Add other necessary plan IDs or details here
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>{safePlan.name || "Subscription"}</Text>
          <Text style={styles.subtitle}>{safePlan.description || ""}</Text>

          {safePlan.price && (
            <Text style={styles.price}>
              {safePlan.currency} {safePlan.price}/{safePlan.invoice_interval}
            </Text>
          )}

          <Text style={styles.sectionTitle}>Included Services</Text>

          <ScrollView style={{ maxHeight: 350 }}>
            {safePlan.features?.map((feat) => (
              <View key={feat.id} style={styles.featureItem}>
                <Text style={styles.featureText}>• {feat.name}</Text>
              </View>
            )) || <Text>No features available.</Text>}
          </ScrollView>

          {/* Confirm subscription */}
          <Pressable
            onPress={handleConfirmSubscription}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm Subscription</Text>
          </Pressable>

          <Spacer height={10} />
          {/* Close */}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          <Spacer />
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 500,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    color: "#666",
  },
  price: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  featureItem: {
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
  },

  // 👇 FIXED: Renamed from subscribeBtn to confirmButton
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center", // Ensures text is centered horizontally
  },

  // 👇 FIXED: Renamed from subscribeText to confirmButtonText
  confirmButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  closeBtn: {
    marginTop: 12,
  },
  closeText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
});
