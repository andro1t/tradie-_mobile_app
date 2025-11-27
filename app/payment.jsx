import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform, // <--- 1. Added Platform import
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/Colors";
import Spacer from "../components/Spacer";
import * as Notifications from "expo-notifications";

// --- CONSTANTS ---
const PAYMENT_TYPE = {
  CASH: 0,
  CARD: 1,
  BPOINT_CARD_ATTACH: 4,
  AFTERPAY: 3,
};

// API Endpoints
const BASE_URL = "https://api.geekifypeople.geekify.global";
const BPOINT_BASE_URL =
  "https://api.geekifypeople.geekify.global/api/v1/bpoint-gateways";
const BPOINT_ATTACH_URL = `${BPOINT_BASE_URL}/attach-payment-method`;
const BPOINT_AUTH_KEY_URL = `${BPOINT_BASE_URL}/auth-key`;

const PANEL_ID = 123; // Required Panel ID (Hardcoded placeholder)

// --- Notification Handler ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Utility Functions ---
const isLuhnValid = (cardNumber) => {
  let sum = 0;
  let shouldDouble = false;
  const reversed = cardNumber.replace(/\s/g, "").split("").reverse();

  for (let i = 0; i < reversed.length; i++) {
    let digit = parseInt(reversed[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const formatCardNumber = (value) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.match(/.{1,4}/g)?.join(" ") || "";
};

// --- Components ---
const CustomMessageModal = ({
  isVisible,
  title,
  message,
  onClose,
  onSuccess,
  type,
}) => {
  if (!isVisible) return null;

  let iconName, iconColor;

  switch (type) {
    case "success":
      iconName = "check-circle";
      iconColor = Colors.success || "#28a745";
      break;
    case "error":
      iconName = "exclamation-triangle";
      iconColor = Colors.error || "#dc3545";
      break;
    case "info":
    default:
      iconName = "info-circle";
      iconColor = Colors.primary || "#007bff";
      break;
  }

  return (
    <View style={modalStyles.overlay}>
      <View style={modalStyles.modalContainer}>
        {type === "info" ? (
          <ActivityIndicator
            size="large"
            color={iconColor}
            style={modalStyles.icon}
          />
        ) : (
          <Icon
            name={iconName}
            size={40}
            color={iconColor}
            style={modalStyles.icon}
          />
        )}

        <Text style={modalStyles.modalTitle}>{title}</Text>
        <Text style={modalStyles.modalMessage}>{message}</Text>

        {type !== "info" && (
          <Pressable
            onPress={type === "success" ? onSuccess : onClose}
            style={[styles.completeButton, modalStyles.closeButton]}
          >
            <Text style={styles.completeButtonText}>
              {type === "success" ? "Go to Home" : "Close"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const BpointForm = ({ cardData, setCardData, errors, isLoading }) => {
  const currentYear = new Date().getFullYear() % 100;
  return (
    <View style={bpointFormStyles.formContainer}>
      <Text style={bpointFormStyles.formTitle}>
        Card Details (Bpoint Secure)
      </Text>
      <Text style={bpointFormStyles.helpText}>
        Your card will be securely attached to your account via Bpoint.
      </Text>

      <Text style={bpointFormStyles.label}>Name on Card</Text>
      <TextInput
        style={bpointFormStyles.input}
        placeholder="Name as it appears on card"
        value={cardData.card_name}
        onChangeText={(val) =>
          setCardData((prev) => ({ ...prev, card_name: val }))
        }
        editable={!isLoading}
      />
      {errors.card_name && (
        <Text style={bpointFormStyles.errorText}>{errors.card_name}</Text>
      )}

      <Text style={bpointFormStyles.label}>Card Number</Text>
      <TextInput
        style={bpointFormStyles.input}
        placeholder="XXXX XXXX XXXX XXXX"
        keyboardType="numeric"
        value={cardData.card_number}
        onChangeText={(val) =>
          setCardData((prev) => ({
            ...prev,
            card_number: formatCardNumber(val),
          }))
        }
        maxLength={19}
        editable={!isLoading}
      />
      {errors.card_number && (
        <Text style={bpointFormStyles.errorText}>{errors.card_number}</Text>
      )}

      <View style={bpointFormStyles.row}>
        <View style={bpointFormStyles.expiryGroup}>
          <Text style={bpointFormStyles.label}>Expiry (MM/YY)</Text>
          <View style={bpointFormStyles.row}>
            <TextInput
              style={[bpointFormStyles.input, bpointFormStyles.inputHalf]}
              placeholder="MM"
              keyboardType="numeric"
              value={cardData.card_expire_month}
              onChangeText={(val) =>
                setCardData((prev) => ({
                  ...prev,
                  card_expire_month: val.replace(/\D/g, "").slice(0, 2),
                }))
              }
              maxLength={2}
              editable={!isLoading}
            />
            <Text style={bpointFormStyles.slash}>/</Text>
            <TextInput
              style={[bpointFormStyles.input, bpointFormStyles.inputHalf]}
              placeholder={`YY`}
              keyboardType="numeric"
              value={cardData.card_expire_year}
              onChangeText={(val) =>
                setCardData((prev) => ({
                  ...prev,
                  card_expire_year: val.replace(/\D/g, "").slice(0, 2),
                }))
              }
              maxLength={2}
              editable={!isLoading}
            />
          </View>
          {(errors.card_expire_month ||
            errors.card_expire_year ||
            errors.expiry) && (
            <Text style={bpointFormStyles.errorText}>
              {errors.expiry ||
                errors.card_expire_month ||
                errors.card_expire_year}
            </Text>
          )}
        </View>

        <View style={bpointFormStyles.cvnGroup}>
          <Text style={bpointFormStyles.label}>CVN</Text>
          <TextInput
            style={bpointFormStyles.input}
            placeholder="123"
            keyboardType="numeric"
            value={cardData.card_cvn}
            onChangeText={(val) =>
              setCardData((prev) => ({
                ...prev,
                card_cvn: val.replace(/\D/g, "").slice(0, 4),
              }))
            }
            maxLength={4}
            secureTextEntry
            editable={!isLoading}
          />
          {errors.card_cvn && (
            <Text style={bpointFormStyles.errorText}>{errors.card_cvn}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("Stripe");
  const [cardData, setCardData] = useState({
    card_name: "",
    card_number: "",
    card_expire_month: "",
    card_expire_year: "",
    card_cvn: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalState, setModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    type: "",
  });
  const [expoPushToken, setExpoPushToken] = useState(null);

  const planName = params.planName || "Selected Plan";
  const planPrice = params.planPrice || "0.00";
  const planCurrency = params.planCurrency || "AUD";

  useEffect(() => {
    const registerForPushNotifications = async () => {
      // 1. Permission Setup
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token!");
        return;
      }

      // 2. Token Retrieval (Useful for future remote pushes)
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(tokenData.data);
        console.log("Expo Push Token:", tokenData.data);
      } catch (error) {
        console.log("Error fetching token", error);
      }

      // 3. Android Channel Setup (CRITICAL for APK)
      // Without this, Android notifications often won't show
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    registerForPushNotifications();
  }, []);

  const handleBack = () => router.back();
  const showMessage = (title, message, type) =>
    setModalState({ isVisible: true, title, message, type });

  const handleSuccessClose = () => {
    router.replace("/drawer/home");
    setModalState({ isVisible: false, title: "", message: "", type: "" });
  };

  const handleErrorOrInfoClose = () => {
    setModalState({ isVisible: false, title: "", message: "", type: "" });
  };

  const validateBpointCardForm = () => {
    const newErrors = {};
    const digitsOnly = cardData.card_number.replace(/\s/g, "");
    const currentYear = new Date().getFullYear() % 100;
    const expMonth = parseInt(cardData.card_expire_month, 10);
    const expYear = parseInt(cardData.card_expire_year, 10);

    if (!cardData.card_name) newErrors.card_name = "Name is required.";
    if (digitsOnly.length < 13 || digitsOnly.length > 19)
      newErrors.card_number = "Invalid card number.";
    else if (!isLuhnValid(digitsOnly))
      newErrors.card_number = "Invalid card number.";

    if (!cardData.card_expire_month || expMonth < 1 || expMonth > 12)
      newErrors.card_expire_month = "Invalid month.";
    if (!cardData.card_expire_year)
      newErrors.card_expire_year = "Invalid year.";
    else if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < new Date().getMonth() + 1)
    )
      newErrors.expiry = "Card has expired.";

    if (cardData.card_cvn.length < 3) newErrors.card_cvn = "Invalid CVN.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Placeholder API Calls (simulate actual APIs) ---
  const getBpointAuthKey = useCallback(async () => {
    return "FAKE_AUTH_KEY"; // Simulated key
  }, []);

  const attachBpointCard = useCallback(async () => {
    return { token: `BPOINT-TOKEN-${Date.now()}` }; // Simulated token
  }, []);

  const recordPayment = useCallback(async (reference, type) => {
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      message: "Payment recorded successfully",
    };
  }, []);

  const handleCompletePayment = async () => {
    setModalState({ isVisible: false, title: "", message: "", type: "" });
    setIsLoading(true);
    let referenceToUse = "";
    let typeToUse = null;

    if (selectedMethod === "Cash") {
      referenceToUse = `CASH-${Date.now()}`;
      typeToUse = PAYMENT_TYPE.CASH;
    } else if (selectedMethod === "Bpoint") {
      setErrors({});
      if (!validateBpointCardForm()) {
        showMessage(
          "Validation Failed",
          "Please correct the errors in the card form.",
          "error"
        );
        setIsLoading(false);
        return;
      }

      try {
        showMessage(
          "Processing...",
          "Generating secure Bpoint authorization key...",
          "info"
        );
        const authKey = await getBpointAuthKey();

        showMessage(
          "Processing...",
          "Authorization successful. Attaching card securely via Bpoint...",
          "info"
        );
        const attachResult = await attachBpointCard(cardData, authKey);

        referenceToUse =
          attachResult.token || attachResult.reference || "BPOINT-SUCCESS";
        typeToUse = PAYMENT_TYPE.BPOINT_CARD_ATTACH;
      } catch (error) {
        showMessage(
          "Bpoint Failed",
          error.message || "Failed to complete Bpoint card attachment process.",
          "error"
        );
        setIsLoading(false);
        return;
      }
    } else if (selectedMethod === "Stripe") {
      referenceToUse = `STRIPE-TOKEN-${Date.now()}`;
      typeToUse = PAYMENT_TYPE.CARD;
    } else {
      showMessage("Error", "Please select a valid payment method.", "error");
      setIsLoading(false);
      return;
    }

    try {
      showMessage(
        "Processing...",
        `Recording payment of ${planCurrency} ${planPrice}...`,
        "info"
      );
      const recordResult = await recordPayment(referenceToUse, typeToUse);

      // Save purchased subscription
      await AsyncStorage.setItem(
        "USER_SUBSCRIPTION",
        JSON.stringify({
          planName,
          planPrice,
          planCurrency,
          paymentMethod: selectedMethod,
          paymentReference: referenceToUse,
          cardLast4:
            selectedMethod === "Bpoint" || selectedMethod === "Stripe"
              ? cardData.card_number.slice(-4)
              : null,
          purchasedAt: new Date().toISOString(),
        })
      );

      showMessage(
        "Payment Recorded",
        `Successfully recorded payment for ${planName} using ${selectedMethod}. Record ID: ${
          recordResult.id || "N/A"
        }`,
        "success"
      );

      // --- 👇 NEW LOCAL NOTIFICATION LOGIC (Fix for APK) 👇 ---
      // This schedules the notification immediately without needing a remote server.
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Payment Successful ✅",
          body: `Your payment for ${planName} was successful.`,
          data: { planName, amount: planPrice },
          sound: true,
        },
        trigger: null, // null means "show immediately"
      });
      // --------------------------------------------------------
    } catch (error) {
      showMessage(
        "Failed to Record",
        error.message || "An unknown error occurred while saving the record.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const PaymentMethod = ({ method, label }) => (
    <TouchableOpacity
      style={[
        styles.methodButton,
        selectedMethod === method && styles.methodButtonSelected,
      ]}
      onPress={() => {
        setSelectedMethod(method);
        setErrors({});
        setModalState({ isVisible: false, title: "", message: "", type: "" });
      }}
      disabled={isLoading}
    >
      <View
        style={[
          styles.radio,
          selectedMethod === method && styles.radioSelected,
        ]}
      />
      <Text
        style={[
          styles.methodLabel,
          selectedMethod === method && { color: "white" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        style={{ flex: 1 }}
      >
        <Spacer height={30} />

        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Confirm Payment</Text>

        <View style={styles.planBox}>
          <Text style={styles.planName}>{planName}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>
              {planCurrency} {planPrice} /month
            </Text>
            <Text style={styles.planSupport}>• Full Access</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        <View style={styles.methodGroup}>
          <PaymentMethod method="Stripe" label="Stripe" />
          <PaymentMethod method="Bpoint" label="Bpoint" />
          <PaymentMethod method="Cash" label="Cash" />
        </View>

        {selectedMethod === "Bpoint" && (
          <BpointForm
            cardData={cardData}
            setCardData={setCardData}
            errors={errors}
            isLoading={isLoading}
          />
        )}

        {selectedMethod === "Cash" && (
          <View style={styles.cashNoticeBox}>
            <Text style={styles.cashNoticeTitle}>⚠️ Cash Payment Notice</Text>
            <Text style={styles.cashNoticeText}>
              Please ensure cash payment of {planCurrency} {planPrice} is
              collected before proceeding.
            </Text>
          </View>
        )}

        {selectedMethod === "Stripe" && (
          <View style={styles.infoNoticeBox}>
            <Text style={styles.infoNoticeTitle}>ℹ️ Stripe Gateway</Text>
            <Text style={styles.infoNoticeText}>
              This is a placeholder flow. A real implementation would securely
              collect card details using the Stripe SDK.
            </Text>
          </View>
        )}

        <Spacer height={40} />

        <Pressable
          onPress={handleCompletePayment}
          style={[
            styles.completeButton,
            isLoading && styles.completeButtonDisabled,
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.completeButtonText}>Complete Payment</Text>
          )}
        </Pressable>
      </ScrollView>

      <CustomMessageModal
        isVisible={modalState.isVisible}
        title={modalState.title}
        message={modalState.message}
        onClose={handleErrorOrInfoClose}
        onSuccess={handleSuccessClose}
        type={modalState.type}
      />
    </View>
  );
};

export default PaymentScreen;

// --- STYLES ---
const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  icon: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    width: "80%",
  },
});

const bpointFormStyles = StyleSheet.create({
  formContainer: { marginTop: 20 },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  helpText: { fontSize: 12, color: "#555", marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  expiryGroup: { flex: 0.6 },
  cvnGroup: { flex: 0.35 },
  inputHalf: { flex: 1 },
  slash: { alignSelf: "center", marginHorizontal: 5 },
  errorText: { color: "red", fontSize: 12, marginBottom: 5 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { marginLeft: 5, fontSize: 14, color: "#333" },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  planBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  planName: { fontSize: 18, fontWeight: "bold" },
  priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  planPrice: { fontSize: 16, fontWeight: "600" },
  planSupport: { marginLeft: 10, fontSize: 12, color: "#555" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  methodGroup: { flexDirection: "row", marginBottom: 20 },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
  },
  methodButtonSelected: {
    backgroundColor: Colors.primary || "#007bff",
    borderColor: Colors.primary || "#007bff",
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 5,
  },
  radioSelected: { backgroundColor: "white" },
  methodLabel: { fontSize: 14 },
  completeButton: {
    backgroundColor: Colors.primary || "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonDisabled: { opacity: 0.6 },
  completeButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  cashNoticeBox: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  cashNoticeTitle: { fontWeight: "bold", marginBottom: 5 },
  cashNoticeText: { fontSize: 12 },
  infoNoticeBox: {
    backgroundColor: "#d1ecf1",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  infoNoticeTitle: { fontWeight: "bold", marginBottom: 5 },
  infoNoticeText: { fontSize: 12 },
});
