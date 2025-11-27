import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { Colors } from "../../constants/Colors";
import ThemedTextInput from "../../components/ThemedTextInput";
import Spacer from "../../components/Spacer";

const AccountSettings = () => {
  const router = useRouter();
  const { userData, saveUser } = useContext(UserContext); // Get saveUser to update context after save

  // --- States for ALL fields ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password is optional (only fill if changing)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  // --- Step 1: Fetch & Pre-fill Data ---
  const fetchCurrentUser = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      let userId = userData?.id;

      if (!userId) userId = await AsyncStorage.getItem("loggedInUserId");

      if (!userId) {
        setErrorMessage("No user session found.");
        return;
      }

      const response = await fetch(
        `https://api.geekifypeople.geekify.global/api/v1/users/${userId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "client-secret": "secret",
          },
        }
      );
      const result = await response.json();

      if (result.data) {
        setCurrentUser(result.data);
        // PRE-FILL THE INPUTS
        setFirstName(result.data.first_name || "");
        setLastName(result.data.last_name || "");
        setEmail(result.data.email || "");
        setPhone(result.data.phone_number || "");
      } else {
        setErrorMessage("Failed to load user data.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // --- Dedicated Password Change Function (Using PUT /reset-password) ---
  const handlePasswordChange = async () => {
    // Already validated in handleSubmit that passwords match and are long enough
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      const formBody = new URLSearchParams({
        username: currentUser.email, // The API expects the user's current identifier
        password: newPassword,
        password_confirmation: confirmPassword,
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/reset-password", // Dedicated endpoint
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // If the password change API failed, alert the user but don't stop the profile save
        const errorMsg = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Failed to update password.";

        Alert.alert("Password Update Failed", errorMsg);
        return false; // Indicate failure
      }

      // Clear password fields on successful change
      setNewPassword("");
      setConfirmPassword("");

      // We will show the main success alert in handleSubmit
      return true; // Indicate success
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred during password update."
      );
      return false;
    }
  };

  // --- Step 2: Handle Submission ---
  const handleSubmit = async () => {
    setErrorMessage("");

    // 1. Validate Basic Fields
    if (!firstName || !lastName || !email || !phone) {
      return setErrorMessage("Name, Email, and Phone are required.");
    }

    // 2. Validate Password (Only if user typed something)
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        return setErrorMessage("New password must be at least 8 characters.");
      }
      if (newPassword !== confirmPassword) {
        return setErrorMessage("Passwords do not match.");
      }
    }

    setIsSubmitting(true);
    let profileUpdateSuccess = false;
    let passwordUpdateSuccess = true; // Assume success if no password entered

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const userId = currentUser.id;

      // --- 1. PROFILE UPDATE (PUT /users/{id}) ---
      const profileParams = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: email, // Sync email/username as discussed
        phone_number: phone,
        role_id: currentUser.role_id || currentUser.role?.id || 13,
      };

      const profileFormBody = new URLSearchParams(profileParams).toString();

      const profileResponse = await fetch(
        `https://api.geekifypeople.geekify.global/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${accessToken}`,
            "client-secret": "secret",
          },
          body: profileFormBody,
        }
      );

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        const validationErrors = profileResult.errors
          ? Object.values(profileResult.errors).flat().join("\n")
          : null;
        setErrorMessage(
          validationErrors || profileResult.message || "Profile update failed."
        );
        setIsSubmitting(false);
        return;
      }

      profileUpdateSuccess = true;

      // --- 2. PASSWORD UPDATE (PUT /reset-password) ---
      if (newPassword) {
        passwordUpdateSuccess = await handlePasswordChange();
      }

      // --- 3. Finalize ---
      if (profileUpdateSuccess && passwordUpdateSuccess) {
        // Success! Update global context
        const updatedUser = profileResult.data;
        if (updatedUser) {
          saveUser({
            ...userData,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            email: updatedUser.email,
          });
        }

        Alert.alert("Success", "Account details updated successfully!");
        router.back();
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of the component (loading view, return view, styles) ...

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Spacer height={20} />
      <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* --- Personal Details Section --- */}
      <Text style={styles.sectionLabel}>Personal Details</Text>

      <ThemedTextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <Spacer height={15} />

      <ThemedTextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <Spacer height={15} />

      <ThemedTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Spacer height={15} />

      <ThemedTextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />

      <Spacer height={30} />

      {/* --- Password Section (Optional) --- */}
      <View style={styles.divider} />
      <Text style={styles.sectionLabel}>Change Password (Optional)</Text>
      <Text style={styles.infoText}>Leave blank to keep current password.</Text>

      <ThemedTextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
      />
      <Spacer height={15} />

      <ThemedTextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm New Password"
        secureTextEntry
      />

      <Spacer height={40} />

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      >
        <Text style={styles.btnText}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>

      <Spacer height={40} />
    </ScrollView>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    fontSize: 14,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
});
