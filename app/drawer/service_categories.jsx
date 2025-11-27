import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const serviceCategories = [
  { id: 1, name: "Electrical Repair", icon: "flash-outline" },
  { id: 2, name: "Plumbing", icon: "water-outline" },
  { id: 3, name: "Appliance Fix", icon: "hammer-outline" },
  { id: 4, name: "Cleaning Services", icon: "broom-outline" },
];

const ServiceCategory = () => {
  const handleSelect = (category) => {
    console.log("Selected:", category.name);
    // router.push(`/drawer/services/${category.id}`) ← example route if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Categories</Text>

      <Text style={styles.sectionTitle}>Choose a Category</Text>

      {serviceCategories.map((cat) => (
        <Pressable
          key={cat.id}
          style={styles.categoryRow}
          onPress={() => handleSelect(cat)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name={cat.icon} size={24} color="#ff4d6d" />
            <Text style={styles.categoryName}>{cat.name}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#444" />
        </Pressable>
      ))}
    </View>
  );
};

export default ServiceCategory;

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
    marginTop: 10,
    marginBottom: 10,
  },
  categoryRow: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
  },
});
