import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Colors = {
  primary: "#4F46E5",
  background: "#ffeff1",
  white: "#ffffff",
  text: "#333333",
  border: "#e5e5e5",
  success: "#10b981",
  error: "#dc2626",
};

// Mock technician data
const mockTechnicians = [
  { id: 1, name: "Mike Ross", specialty: "Electrical" },
  { id: 2, name: "Rachel Zane", specialty: "Plumbing" },
  { id: 3, name: "Harvey Specter", specialty: "Carpentry" },
];

const AllTechnicians = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAction = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    setSuccessMessage("");

    // Simulate action (e.g., assign task)
    console.log("Processing technicians:", selectedIds);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setSuccessMessage("Technicians processed successfully!");
    setSelectedIds([]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <Pressable
        onPress={() => toggleSelection(item.id)}
        style={[
          styles.technicianItem,
          isSelected && styles.technicianItemSelected,
        ]}
      >
        <View style={styles.technicianInfo}>
          <Text style={styles.technicianName}>{item.name}</Text>
          <Text style={styles.technicianSpecialty}>{item.specialty}</Text>
        </View>
        {isSelected && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={Colors.success}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Technicians</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Success Message */}
      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <MaterialCommunityIcons
            name="check-bold"
            size={20}
            color={Colors.success}
          />
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* Technician List */}
      <FlatList
        data={mockTechnicians}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />

      {/* Footer Button */}
      <View style={{ backgroundColor: Colors.background }}>
        <View style={styles.footer}>
          <Pressable
            onPress={handleAction}
            disabled={isProcessing || selectedIds.length === 0}
            style={[
              styles.actionButton,
              (isProcessing || selectedIds.length === 0) &&
                styles.actionButtonDisabled,
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={Colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.actionButtonText}>Process Selected</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AllTechnicians;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: Colors.text },

  technicianItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  technicianItemSelected: { borderColor: Colors.primary, borderWidth: 2 },
  technicianInfo: {},
  technicianName: { fontSize: 16, fontWeight: "600", color: Colors.text },
  technicianSpecialty: { fontSize: 14, color: "#6b7280", marginTop: 2 },

  footer: { padding: 20, bottom: 30 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 4,
  },
  actionButtonDisabled: { backgroundColor: "#9CA3AF" },
  actionButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },

  successMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#34d399",
  },
  successMessageText: {
    marginLeft: 10,
    color: "#065f46",
    fontWeight: "600",
    fontSize: 14,
  },
});
