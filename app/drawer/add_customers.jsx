import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

// --- CONSTANTS ---
const Colors = {
  primary: "#4F46E5",
  background: "#ffeff1",
  white: "#ffffff",
  text: "#333333",
  border: "#e5e5e5",
  error: "#dc2626",
};

// --- INPUT FIELD COMPONENT ---
const InputField = ({
  label,
  iconName,
  placeholder,
  value,
  onChange,
  type = "default",
  error,
}) => (
  <View style={styles.inputFieldContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, error && styles.inputErrorBorder]}>
      <MaterialCommunityIcons
        name={iconName}
        size={18}
        color="#999"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
        keyboardType={
          type === "email"
            ? "email-address"
            : type === "tel"
            ? "phone-pad"
            : "default"
        }
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// --- STATUS TOGGLE COMPONENT ---
const StatusToggle = ({ status, setStatus }) => (
  <View style={styles.statusToggleContainer}>
    <Text style={styles.inputLabel}>Status</Text>
    <View style={styles.toggleButtonsWrapper}>
      <Pressable
        onPress={() => setStatus("Active")}
        style={[
          styles.statusButton,
          status === "Active"
            ? styles.statusButtonActive
            : styles.statusButtonDefault,
        ]}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={18}
          color={status === "Active" ? "#059669" : "#6b7280"}
          style={{ marginRight: 5 }}
        />
        <Text
          style={[
            styles.statusButtonText,
            status === "Active" ? { color: "#059669" } : {},
          ]}
        >
          Active
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setStatus("Inactive")}
        style={[
          styles.statusButton,
          status === "Inactive"
            ? styles.statusButtonInactive
            : styles.statusButtonDefault,
        ]}
      >
        <MaterialCommunityIcons
          name="close-circle"
          size={18}
          color={status === "Inactive" ? "#dc2626" : "#6b7280"}
          style={{ marginRight: 5 }}
        />
        <Text
          style={[
            styles.statusButtonText,
            status === "Inactive" ? { color: "#dc2626" } : {},
          ]}
        >
          Inactive
        </Text>
      </Pressable>
    </View>
  </View>
);

// --- MAIN COMPONENT ---
const AddCustomers = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSuccessMessage("");
    setIsSubmitting(true);

    // Simulate API call
    console.log("Submitting Customer Data:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccessMessage("Customer Added Successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "Active",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Customer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Success Message */}
      {successMessage ? (
        <View style={styles.successMessageContainer}>
          <MaterialCommunityIcons name="check-bold" size={20} color="#10b981" />
          <Text style={styles.successMessageText}>{successMessage}</Text>
        </View>
      ) : null}

      <ScrollView
        style={styles.formScrollContainer}
        contentContainerStyle={styles.formContent}
      >
        {/* Name Fields */}
        <View style={styles.row}>
          <View style={styles.flex1}>
            <InputField
              label="First Name"
              iconName="account"
              placeholder="Jane"
              value={formData.firstName}
              onChange={(val) => setFormData({ ...formData, firstName: val })}
              error={errors.firstName}
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.flex1}>
            <InputField
              label="Last Name"
              iconName="account-outline"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(val) => setFormData({ ...formData, lastName: val })}
              error={errors.lastName}
            />
          </View>
        </View>

        {/* Email & Phone */}
        <InputField
          label="Email Address"
          iconName="email"
          placeholder="jane.doe@example.com"
          type="email"
          value={formData.email}
          onChange={(val) => setFormData({ ...formData, email: val })}
          error={errors.email}
        />

        <InputField
          label="Phone Number"
          iconName="phone"
          placeholder="0412 345 678"
          type="tel"
          value={formData.phone}
          onChange={(val) => setFormData({ ...formData, phone: val })}
          error={errors.phone}
        />

        {/* Status */}
        <StatusToggle
          status={formData.status}
          setStatus={(val) => setFormData({ ...formData, status: val })}
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={{ backgroundColor: "#ffeff1" }}>
        <View style={styles.footer}>
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={20}
                  color={Colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.saveButtonText}>Save Customer</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AddCustomers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
  },
  formScrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  flex1: { flex: 1 },
  spacer: { width: 15 },

  // Input
  inputFieldContainer: { marginBottom: 15 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  inputErrorBorder: { borderColor: Colors.error, borderWidth: 2 },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: Colors.text, height: "100%" },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    fontWeight: "500",
  },

  // Status
  statusToggleContainer: { marginBottom: 20, marginTop: 10 },
  toggleButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  statusButtonDefault: { backgroundColor: Colors.white },
  statusButtonActive: {
    backgroundColor: "#e6fffa",
    borderColor: "#10b981",
    borderWidth: 1,
  },
  statusButtonInactive: {
    backgroundColor: "#ffeaea",
    borderColor: Colors.error,
    borderWidth: 1,
  },
  statusButtonText: { fontSize: 14, fontWeight: "bold", color: "#6b7280" },

  // Footer Button
  footer: {
    padding: 20,
    bottom: 30,
    borderTopColor: "#f0f0f0",
    // backgroundColor: "#ffffff", <-- remove this line
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 4,
  },
  saveButtonDisabled: { backgroundColor: "#9CA3AF" },

  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },

  // Success
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
