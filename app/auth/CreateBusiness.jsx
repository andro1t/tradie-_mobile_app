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

const CreateBusiness = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [addressId, setAddressId] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved user_id & address_id
  useEffect(() => {
    const loadStoredData = async () => {
      const savedUserId = await AsyncStorage.getItem("registeredUserId");
      const savedAddressId = await AsyncStorage.getItem("registeredAddressId");

      if (savedUserId && savedAddressId) {
        setUserId(savedUserId);
        setAddressId(savedAddressId);
        console.log("Loaded from storage:", {
          user_id: savedUserId,
          address_id: savedAddressId,
        });
      } else {
        console.warn("⚠️ Missing data:", { savedUserId, savedAddressId });
        Alert.alert(
          "Error",
          "Missing user or address info. Please register again."
        );
      }
    };

    loadStoredData();
  }, []);

  const handleSaveBusiness = async () => {
    const newErrors = {};
    if (!businessName.trim())
      newErrors.businessName = "Business name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!userId || !addressId) {
      Alert.alert("Error", "User ID or Address ID not found.");
      return;
    }

    setIsLoading(true);

    try {
      const formBody = new URLSearchParams({
        user_id: userId,
        address_id: addressId,
        name: businessName,
        client_panel: "0",
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/businesses",
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
      console.log("Business creation response:", data);

      if (response.ok) {
        const businessId = data.data?.id?.toString();
        await AsyncStorage.setItem("registeredBusinessId", businessId);
        console.log("✅ Saved business_id:", businessId);

        Alert.alert("Success", "Business created successfully!");
        router.push("/auth/CreateOrganizationOwner");
      } else {
        Alert.alert("Error", data.message || "Failed to create business.");
      }
    } catch (err) {
      console.error("Error creating business:", err);
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
          <Text style={{ bottom: 150 }}>Create Your Business</Text>

          {/* Business Name Field */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Business Name"
              value={businessName}
              onChangeText={(text) => {
                setBusinessName(text);
                if (errors.businessName)
                  setErrors((prev) => ({ ...prev, businessName: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.businessName || " "}</Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSaveBusiness}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <Text style={{ color: "#fff" }}>
              {isLoading ? "Saving..." : "Save Business"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBusiness;

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
