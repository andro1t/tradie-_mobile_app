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

// Mock Data for Service Tips
const serviceTips = [
  {
    id: 1,
    title: "Electrical Safety",
    description:
      "Always turn off the main power before doing any electrical work.",
    icon: "flash-outline",
  },
  {
    id: 2,
    title: "Plumbing Basics",
    description:
      "Know where your main water shut-off valve is located in case of emergencies.",
    icon: "water-outline",
  },
  {
    id: 3,
    title: "Appliance Care",
    description:
      "Clean your refrigerator coils every 6 months to improve efficiency.",
    icon: "hammer-outline",
  },
  {
    id: 4,
    title: "Cleaning Hack",
    description:
      "Use vinegar and baking soda to unclog minor drain blockages naturally.",
    icon: "sparkles-outline", // Changed icon for variety
  },
];

const ServiceTips = () => {
  // Function to handle tip selection (e.g., show full details)
  const handleViewTip = (tip) => {
    Alert.alert(tip.title, tip.description);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Tips</Text>

      <Text style={styles.sectionTitle}>Helpful Advice</Text>

      {/* List of Service Tips */}
      <FlatList
        data={serviceTips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.tipCard} onPress={() => handleViewTip(item)}>
            <View style={styles.tipHeader}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={22} color="#ff4d6d" />
              </View>
              <Text style={styles.tipTitle}>{item.title}</Text>
            </View>

            <Text style={styles.tipDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.readMoreText}>Tap to read more</Text>
              <Icon name="chevron-forward" size={16} color="#ff4d6d" />
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ServiceTips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff7f7", // Matches service.jsx background
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
    marginTop: 5,
    marginBottom: 15,
    color: "#444",
  },

  // Tip Card Styles
  tipCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  tipDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  readMoreText: {
    fontSize: 12,
    color: "#ff4d6d",
    marginRight: 4,
    fontWeight: "500",
  },
});
