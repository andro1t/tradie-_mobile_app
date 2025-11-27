import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
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

// Mock customer data
const mockCustomers = [
  { id: 1, name: "Jane Doe", email: "jane.doe@example.com" },
  { id: 2, name: "John Smith", email: "john.smith@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
];

const ExportCustomer = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = async () => {
    if (selectedIds.length === 0) return;
    setIsExporting(true);
    setSuccessMessage("");

    // Simulate export API
    console.log("Exporting customers:", selectedIds);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsExporting(false);
    setSuccessMessage("Customers exported successfully!");
    setSelectedIds([]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <Pressable
        onPress={() => toggleSelection(item.id)}
        style={[styles.customerItem, isSelected && styles.customerItemSelected]}
      >
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerEmail}>{item.email}</Text>
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
        <Text style={styles.headerTitle}>Export Customers</Text>
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

      {/* Customer List */}
      <FlatList
        data={mockCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />

      {/* Footer Button */}
      <View style={{ backgroundColor: Colors.background }}>
        <View style={styles.footer}>
          <Pressable
            onPress={handleExport}
            disabled={isExporting || selectedIds.length === 0}
            style={[
              styles.exportButton,
              (isExporting || selectedIds.length === 0) &&
                styles.exportButtonDisabled,
            ]}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="export"
                  size={20}
                  color={Colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.exportButtonText}>Export Selected</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ExportCustomer;

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

  listContainer: { flex: 1, paddingHorizontal: 20 },

  customerItem: {
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
  customerItemSelected: { borderColor: Colors.primary, borderWidth: 2 },
  customerInfo: {},
  customerName: { fontSize: 16, fontWeight: "600", color: Colors.text },
  customerEmail: { fontSize: 14, color: "#6b7280", marginTop: 2 },

  footer: { padding: 20, bottom: 30 },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 4,
  },
  exportButtonDisabled: { backgroundColor: "#9CA3AF" },
  exportButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },

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
