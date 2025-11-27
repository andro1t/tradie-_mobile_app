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
import { useRouter, Link } from "expo-router";
import { Colors } from "../../constants/Colors";
import React, { useState } from "react";
import Logo from "../../assets/images/geekify360_logo.png";
import Spacer from "../../components/Spacer";
import ThemedTextInput from "../../components/ThemedTextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const nameRegex = /^[A-Za-z\s-]+$/;

  const handleRegister = async () => {
    const newErrors = {};

    // same validation logic as before...
    if (!firstName) newErrors.firstName = "First name is required.";
    else if (!nameRegex.test(firstName))
      newErrors.firstName = "First name should not contain numbers or symbols.";

    if (!lastName) newErrors.lastName = "Last name is required.";
    else if (!nameRegex.test(lastName))
      newErrors.lastName = "Last name should not contain numbers or symbols.";

    if (!email) newErrors.email = "Email is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const formBody = new URLSearchParams({
        role_id: "13",
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth || "",
        password,
      }).toString();

      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/users",
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
      console.log("Registration response:", data);

      if (response.ok) {
        const userId = data.data?.id?.toString();
        if (userId) {
          await AsyncStorage.setItem("registeredUserId", userId);
          console.log("✅ Saved user_id:", userId);
        }

        router.push("/auth/CreateAddress");
      }

      const userId = data.data?.id?.toString();
      if (userId) {
        await AsyncStorage.setItem("registeredUserId", userId);
        console.log("✅ Saved user_id:", userId);
      }

      // ✅ Skip login for now, proceed to address creation
      Alert.alert("Success", "Account created! Please add your address next.");
      router.push("/auth/CreateAddress");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ api: "Network error. Please try again later." });
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
          <Text style={{ bottom: 150 }}>Customer Registration</Text>

          {/* First Name */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName)
                  setErrors((prev) => ({ ...prev, firstName: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.firstName || " "}</Text>
          </View>

          {/* Last Name */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errors.lastName)
                  setErrors((prev) => ({ ...prev, lastName: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.lastName || " "}</Text>
          </View>

          {/* Email */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.email || " "}</Text>
          </View>

          {/* Phone Number */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (errors.phoneNumber)
                  setErrors((prev) => ({ ...prev, phoneNumber: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.phoneNumber || " "}</Text>
          </View>

          {/* Date of Birth (optional) */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
            <Text style={styles.errorText}> </Text>
          </View>

          {/* Password */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: null }));
              }}
            />
            <Text style={styles.errorText}>{errors.password || " "}</Text>
          </View>

          {/* Confirm Password */}
          <View style={[styles.fieldContainer, { bottom: 120 }]}>
            <ThemedTextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
            />
            <Text style={styles.errorText}>
              {errors.confirmPassword || " "}
            </Text>
          </View>

          {/* API / Network Error */}
          {errors.api && (
            <Text
              style={[styles.errorText, { bottom: 90, textAlign: "center" }]}
            >
              {errors.api}
            </Text>
          )}

          <Pressable
            onPress={handleRegister}
            style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          >
            <Text style={{ color: "#fff" }}>
              {isLoading ? "Registering..." : "Register"}
            </Text>
          </Pressable>

          <Spacer />
          <Text style={{ top: -140 }}>
            Already have an account?
            <Link href="/auth/login" style={{ color: "#008cff" }}>
              {" "}
              Login Here.
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

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
