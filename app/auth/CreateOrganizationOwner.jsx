import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import Logo from "../../assets/images/geekify360_logo.png";
import Spacer from "../../components/Spacer";
import ThemedTextInput from "../../components/ThemedTextInput";
import { Picker } from "@react-native-picker/picker";

const CreateOrganizationOwner = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [type, setType] = useState("1"); // 0: Managed, 1: Self Managed
  const [status, setStatus] = useState("1"); // 0: Inactive, 1: Active
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load stored data
  useEffect(() => {
    const loadStoredData = async () => {
      const savedUserId = await AsyncStorage.getItem("registeredUserId");
      const savedAddressId = await AsyncStorage.getItem("registeredAddressId");
      const savedBusinessId = await AsyncStorage.getItem(
        "registeredBusinessId"
      );

      if (savedUserId && savedAddressId && savedBusinessId) {
        setUserId(savedUserId);
        setAddressId(savedAddressId);
        setBusinessId(savedBusinessId);
        console.log("Loaded from storage:", {
          user_id: savedUserId,
          address_id: savedAddressId,
          business_id: savedBusinessId,
        });
      } else {
        console.warn("⚠️ Missing required IDs");
        Alert.alert(
          "Error",
          "Some registration data is missing. Please restart the registration process."
        );
      }
    };
    loadStoredData();
  }, []);

  const handleSaveOrganization = async () => {
    const newErrors = {};

    if (!userId) newErrors.userId = "User ID missing.";
    if (!businessId) newErrors.businessId = "Business ID missing.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const formBody = new URLSearchParams({
        user_id: userId,
        address_id: addressId || "",
        type,
        status,
        business_id: businessId,
        client_panel: "0",
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/organization-owner",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "client-secret": "secret",
          },
          body: formBody,
        }
      );

      const data = await response.json();
      console.log("OrganizationOwner creation response:", data);

      if (response.ok) {
        Alert.alert("Success", "Organization Owner created successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/auth/login"),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create organization.");
      }
    } catch (err) {
      console.error("Error creating organization:", err);
      Alert.alert("Error", "Network issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Spacer />
          <Image source={Logo} style={styles.tradieLogo} />
          <Spacer height={30} />
          <Text style={{ bottom: 150 }}>Create Organization Owner</Text>

          {/* Type Picker */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={type}
                onValueChange={(value) => setType(value)}
              >
                <Picker.Item label="Managed" value="0" />
                <Picker.Item label="Self Managed" value="1" />
              </Picker>
            </View>
          </View>

          {/* Status Picker */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(value) => setStatus(value)}
              >
                <Picker.Item label="Inactive" value="0" />
                <Picker.Item label="Active" value="1" />
              </Picker>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSaveOrganization}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <Text style={{ color: "#fff" }}>
              {isLoading ? "Saving..." : "Save Organization Owner"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateOrganizationOwner;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tradieLogo: {
    resizeMode: "contain",
    bottom: 50,
    width: 200,
    height: 200,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    minHeight: 18,
    marginTop: 2,
    marginLeft: 5,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 40,
    width: "100%",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});
