import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  useColorScheme,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Spacer from "./Spacer";
import { Colors } from "../constants/Colors";

const { width } = Dimensions.get("window");

const FirstSubscriptionModal = ({ visible, onClose }) => {
  const data = [
    {
      id: 1,
      title: "Free Trial",
      color: "#FFE4E1",
      description: "Enjoy full access for 7 days at no cost.",
    },
    {
      id: 2,
      title: "Monthly",
      color: "#FFDAB9",
      description: "Access premium features for one month.",
    },
    {
      id: 3,
      title: "3 Months",
      color: "#E6E6FA",
      description: "Get 10% off for 3 months subscription.",
    },
    {
      id: 4,
      title: "6 Months",
      color: "#E0FFFF",
      description: "15% off for 6 months of service.",
    },
    {
      id: 5,
      title: "Yearly",
      color: "#FFFACD",
      description: "Save 25% with annual plan.",
    },
  ];

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handleSubmit = () => {
    console.log("Subscription:", data[currentIndex].title);
    console.log("Payment:", { cardNumber, expiryDate, cvv, billingAddress });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* APPLY THEME HERE (inline) */}
          <View style={[styles.box, { backgroundColor: theme.background }]}>
            <Text style={styles.title}>Choose Subscription</Text>

            <Carousel
              width={width * 0.8}
              height={180}
              data={data}
              loop={false}
              onSnapToItem={setCurrentIndex}
              renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: item.color }]}>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              )}
            />

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {data[currentIndex].description}
              </Text>
            </View>

            <Spacer />

            <View style={styles.paymentContainer}>
              <Text style={styles.paymentTitle}>Payment Information</Text>

              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                />

                <TextInput
                  style={[styles.input, styles.inputHalf]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Billing Address"
                value={billingAddress}
                onChangeText={setBillingAddress}
              />
            </View>

            <Spacer />

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
            >
              <Text style={styles.btnText}>Subscribe</Text>
            </Pressable>

            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FirstSubscriptionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  box: {
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    minHeight: 600,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 16,
  },
  paymentContainer: {
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pressed: { opacity: 0.5 },
  closeBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
  closeText: {
    color: "#666",
    fontSize: 14,
  },
});
