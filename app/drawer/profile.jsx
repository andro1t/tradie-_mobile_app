import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import Spacer from "../../components/Spacer";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const { userData } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Define Theme here
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const fetchProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      let userId = userData?.id;

      if (!userId) {
        userId = await AsyncStorage.getItem("registeredUserId");
      }
      if (!userId) {
        userId = await AsyncStorage.getItem("loggedInUserId");
      }

      if (!userId) {
        console.log("❌ No user ID found in Context or Storage.");
        setLoading(false);
        return;
      }

      console.log(`Fetching Profile for User ID: ${userId}`);

      const response = await fetch(
        `https://api.geekifypeople.geekify.global/api/v1/users/${userId}?with_relation[]=addresses`,
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
        setUser(result.data);
        setAddress(result.data.addresses?.[0] || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      // 2. Apply dynamic background color here
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      // 3. Apply dynamic background color here
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Unable to load profile.
        </Text>
        <Text style={{ color: "#999", fontSize: 12, marginTop: 5 }}>
          (Try logging out and back in)
        </Text>
      </View>
    );
  }

  const handleSettingsPress = () => {
    // This assumes you create a file at app/settings/account.jsx
    router.push("/settings/account");
  };

  return (
    // 4. Apply dynamic background color here
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Spacer height={10} />
      <Image
        source={
          user.avatar
            ? { uri: user.avatar }
            : require("../../assets/images/geekify360_logo.png")
        }
        style={styles.avatar}
      />

      {/* Use theme.text for dynamic text color if needed, otherwise default black */}
      <Text style={[styles.name, { color: theme.text }]}>
        {user.full_name || user.first_name + " " + user.last_name}
      </Text>
      <Text style={styles.email}>{user.email}</Text>
      <Spacer height={5} />
      <Text style={styles.phone}>{user.phone_number || "No phone number"}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Spacer height={5} />
        {address ? (
          <>
            <Text style={styles.address}>{address.subpremise}</Text>
            <Spacer height={5} />
            <Text style={styles.address}>{address.street}</Text>
            <Spacer height={5} />
            <Text style={styles.address}>
              {address.suburb}, {address.state}
            </Text>
            <Spacer height={5} />
            <Text style={styles.address}>
              {address.post_code}, {address.country}
            </Text>
          </>
        ) : (
          <Text style={styles.address}>No address found.</Text>
        )}
      </View>

      <Pressable
        onPress={handleSettingsPress}
        style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}
      >
        <Text style={styles.settingsBtnText}>Account Settings</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor removed (handled inline)
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor removed (handled inline)
  },
  container: {
    padding: 20,
    alignItems: "center",
    minHeight: "100%",
    // backgroundColor removed (handled inline)
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#444",
    marginTop: 5,
  },
  phone: {
    fontSize: 16,
    color: "#444",
    marginTop: 2,
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  address: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  settingsBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20, // Add spacing below the button
    width: "80%", // Make it prominent
    alignItems: "center",
  },
  settingsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7, // Simple pressed state
  },
});
