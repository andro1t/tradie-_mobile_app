import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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

const AddTechnician = () => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddTechnician = async () => {
    if (!name || !specialty) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    // Simulate API request
    console.log("Adding technician:", { name, specialty });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccessMessage("Technician added successfully!");
    setName("");
    setSpecialty("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Technician</Text>
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

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter technician name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Specialty</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter technician specialty"
          value={specialty}
          onChangeText={setSpecialty}
        />
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleAddTechnician}
        disabled={isSubmitting || !name || !specialty}
        style={[
          styles.submitButton,
          (isSubmitting || !name || !specialty) && styles.submitButtonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submitButtonText}>Add Technician</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default AddTechnician;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 20 },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: Colors.text },

  inputContainer: { paddingHorizontal: 20 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 4,
  },
  submitButtonDisabled: { backgroundColor: "#9CA3AF" },
  submitButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },

  successMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
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
