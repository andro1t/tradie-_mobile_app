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
import Logo from "../../assets/images/tradie_plus_official_logo.png";
import Spacer from "../../components/Spacer";
import ThemedTextInput from "../../components/ThemedTextInput";

const CreateAddress = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [subpremise, setSubpremise] = useState("");
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved user_id
  useEffect(() => {
    const loadUserId = async () => {
      const savedId = await AsyncStorage.getItem("registeredUserId");
      if (savedId) {
        setUserId(savedId);
        console.log("✅ Loaded user_id:", savedId);
      } else {
        Alert.alert("Error", "User ID not found. Please login again.");
      }
    };
    loadUserId();
  }, []);

  const handleSaveAddress = async () => {
    const newErrors = {};

    if (!street) newErrors.street = "Street is required.";
    if (!suburb) newErrors.suburb = "Suburb is required.";
    if (!state) newErrors.state = "State is required.";
    if (!postCode) newErrors.postCode = "Post code is required.";
    if (!country) newErrors.country = "Country is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      const formBody = new URLSearchParams({
        user_id: userId,
        subpremise,
        street,
        suburb,
        state,
        post_code: postCode,
        country,
        client_panel: "0",
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/addresses",
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
      console.log("Address creation response:", data);

      if (response.ok) {
        const addressId = data.data?.id?.toString();
        if (addressId) {
          await AsyncStorage.setItem("registeredAddressId", addressId);
          console.log("✅ Saved address_id:", addressId);
        }

        Alert.alert("Success", "Address created successfully!");
        router.push("/auth/CreateBusiness");
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to create address. Please try again."
        );
      }
    } catch (err) {
      console.error("Error creating address:", err);
      Alert.alert("Error", "Network issue. Please try again later.");
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
          <Text style={{ bottom: 150 }}>Add Your Address</Text>

          {/* Subpremise */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Subpremise"
              value={subpremise}
              onChangeText={setSubpremise}
            />
            <Text style={styles.errorText}> </Text>
          </View>

          {/* Street */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Street"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                if (errors.street)
                  setErrors((prev) => ({ ...prev, street: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.street || " "}</Text>
          </View>

          {/* Suburb */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Suburb"
              value={suburb}
              onChangeText={(text) => {
                setSuburb(text);
                if (errors.suburb)
                  setErrors((prev) => ({ ...prev, suburb: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.suburb || " "}</Text>
          </View>

          {/* State */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="State"
              value={state}
              onChangeText={(text) => {
                setState(text);
                if (errors.state)
                  setErrors((prev) => ({ ...prev, state: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.state || " "}</Text>
          </View>

          {/* Post Code */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Post Code"
              keyboardType="numeric"
              value={postCode}
              onChangeText={(text) => {
                setPostCode(text);
                if (errors.postCode)
                  setErrors((prev) => ({ ...prev, postCode: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.postCode || " "}</Text>
          </View>

          {/* Country */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Country"
              value={country}
              onChangeText={(text) => {
                setCountry(text);
                if (errors.country)
                  setErrors((prev) => ({ ...prev, country: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.country || " "}</Text>
          </View>

          {/* Button */}
          <Pressable
            onPress={handleSaveAddress}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <Text style={{ color: "#fff" }}>
              {isLoading ? "Saving..." : "Save Address"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateAddress;

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
