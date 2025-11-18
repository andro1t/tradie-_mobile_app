import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/Colors";
import ThemedTextInput from "../../components/ThemedTextInput";
import Spacer from "../../components/Spacer";
import Logo from "../../assets/images/tradie_plus_official_logo.png";
import { UserContext } from "../../context/UserContext";

const { height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const { saveUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showManagedModal, setShowManagedModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(4);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },
    tradieLogo: {
      resizeMode: "contain",
      bottom: 50,
      width: 200,
      height: 200,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 30,
    },
    btn: {
      backgroundColor: Colors.primary,
      padding: 15,
      borderRadius: 5,
      bottom: 40,
      width: "100%",
      alignItems: "center",
    },
    pressed: {
      opacity: 0.5,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalContent: {
      height: height * 0.75,
      backgroundColor: "white",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      alignItems: "center",
      padding: 20,
    },
    choiceModalContent: {
      height: height * 0.5,
      backgroundColor: "white",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
    },
    skipButton: {
      alignSelf: "flex-end",
      padding: 10,
    },
    skipText: {
      color: "#008cff",
      fontWeight: "600",
      fontSize: 16,
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: "contain",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    modalText: {
      fontSize: 16,
      textAlign: "center",
      color: "#555",
      marginVertical: 20,
      lineHeight: 22,
    },
    nextBtn: {
      backgroundColor: Colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    choiceBtnYes: {
      backgroundColor: Colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 8,
    },
    choiceBtnNo: {
      backgroundColor: "#ddd",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 8,
    },
    errorText: {
      color: "red",
      fontSize: 13,
      alignSelf: "flex-start",
      marginTop: -90, // 👈 aligns under inputs
      marginBottom: 80,
    },
  });

  // First-time intro
  useEffect(() => {
    const checkIntro = async () => {
      const seen = await AsyncStorage.getItem("hasSeenIntro");
      if (!seen) {
        setModalIndex(0);
        await AsyncStorage.setItem("hasSeenIntro", "true");
      }
    };
    checkIntro();
  }, []);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both email/username and password.");
      return;
    }

    try {
      const formBody = new URLSearchParams({
        username,
        password,
        organization_clients_flag: "1",
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/login-token",
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
      console.log("Login response:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Invalid credentials.");
        return;
      }

      const userObj = data.data.user;
      const tokenObj = data.data.token;

      // Save token
      await AsyncStorage.setItem("accessToken", tokenObj.access_token);
      await AsyncStorage.setItem("tokenType", tokenObj.token_type);

      // Save user globally
      saveUser({
        id: userObj.id,
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        email: userObj.email,
        role: userObj.role?.name || "",
        token: tokenObj.access_token,
      });

      console.log("User saved:", userObj);

      // Always show subscription modal for now
      router.push({
        pathname: "/drawer/home",
        params: { showSubscription: "1" },
      });
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Unable to connect. Please try again later.");
    }
  };

  const handleManagedChoice = (choice) => {
    setShowManagedModal(false);

    if (choice === "yes") {
      router.push("/managedRegistration");
    } else {
      router.push("/drawer/home");
    }
  };

  return (
    <View style={[styles.container, modalIndex < 4 && { opacity: 0.4 }]}>
      <Spacer />
      <Image source={Logo} style={styles.tradieLogo} />

      <Spacer height={30} />
      <Text style={{ bottom: 150 }}>Mobile Professionals</Text>

      <ThemedTextInput
        style={{ width: "100%", bottom: 100 }}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your email or username"
      />

      <Spacer height={30} />
      <ThemedTextInput
        style={{ width: "100%", bottom: 100 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      >
        <Text style={{ color: "#fff" }}>Sign In</Text>
      </Pressable>

      <Text style={{ top: -30 }}>
        Don't have an account?
        <Link href="/auth/register" style={{ color: "#008cff" }}>
          {" "}
          Sign Up Now.
        </Link>
      </Text>

      {/* Managed Modal */}
      <Modal transparent visible={showManagedModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.choiceModalContent}>
            <Text style={styles.modalTitle}>
              Do you want to be managed by us?
            </Text>
            <Text style={styles.modalText}>
              Choosing “Yes” lets Tradie+ manage your bookings and visibility.
            </Text>
            <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
              <Pressable
                onPress={() => handleManagedChoice("yes")}
                style={styles.choiceBtnYes}
              >
                <Text style={{ color: "#fff" }}>Yes</Text>
              </Pressable>
              <Pressable
                onPress={() => handleManagedChoice("no")}
                style={styles.choiceBtnNo}
              >
                <Text>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;
