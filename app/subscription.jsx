import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import Spacer from "../components/Spacer";

const { width } = Dimensions.get("window");

const Subscription = () => {
  const router = useRouter();
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
      description: "Access all premium features for one month.",
    },
    {
      id: 3,
      title: "3 Months",
      color: "#E6E6FA",
      description: "Get a 10% discount when you subscribe for 3 months.",
    },
    {
      id: 4,
      title: "6 Months",
      color: "#E0FFFF",
      description: "Enjoy 6 months of uninterrupted service with 15% off.",
    },
    {
      id: 5,
      title: "Yearly",
      color: "#FFFACD",
      description: "Best value! Save 25% with an annual subscription.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handleSubmit = () => {
    console.log("Subscription chosen:", data[currentIndex].title);
    console.log("Card Info:", { cardNumber, expiryDate, cvv, billingAddress });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* 🧭 Flat Header (no box) */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Subscription</Text>
        </View>
        <Spacer height={10} />

        {/* Carousel */}
        <Carousel
          width={width * 0.8}
          height={180}
          data={data}
          loop={false}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: item.color }]}>
              <Text style={styles.cardText}>{item.title}</Text>
            </View>
          )}
          mode="normal"
          scrollAnimationDuration={500}
        />

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {data[currentIndex].description}
          </Text>
        </View>

        <Spacer />

        {/* Payment Info */}
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentTitle}>Payment Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="MM/YY"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="CVV"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Billing Address"
            placeholderTextColor="#999"
            value={billingAddress}
            onChangeText={setBillingAddress}
          />
        </View>

        <Spacer />

        {/* Subscribe button */}
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
        >
          <Text style={styles.btnText}>Subscribe</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffeff1",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 50,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
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
    paddingHorizontal: 10,
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  paymentContainer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    backgroundColor: "#f9f9f9",
    fontSize: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputHalf: { width: "48%" },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  btnText: { color: "#f2f2f2", fontWeight: "bold" },
  pressed: { opacity: 0.5 },
});
