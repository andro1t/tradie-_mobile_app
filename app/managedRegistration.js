import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import Spacer from "../components/Spacer";

export default function ManagedRegistrationScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [countryCode, setCountryCode] = useState("+63");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = () => {
    const fullPhone = `${countryCode}${phoneNumber}`;
    alert(
      `Information saved successfully!\nIndustry: ${industry}\nService: ${service}\nPhone: ${fullPhone}`
    );
    router.push("/managedSubscription"); // ✅ go to managed subscription
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fill up the following fields</Text>

      {/* <Spacer height={20} />
      <Text>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Spacer height={20} />
      <Text>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      /> */}

      <Spacer height={10} />
      <Text>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={company}
        onChangeText={setCompany}
      />

      <Spacer height={10} />
      <Text>Phone No.</Text>
      <View style={styles.phoneContainer}>
        <View style={styles.countryCodeContainer}>
          <Picker
            selectedValue={countryCode}
            onValueChange={(value) => setCountryCode(value)}
            style={styles.countryCodePicker}
          >
            <Picker.Item label="+63 (PH)" value="+63" />
            <Picker.Item label="+1 (US)" value="+1" />
            <Picker.Item label="+44 (UK)" value="+44" />
            <Picker.Item label="+61 (AU)" value="+61" />
            <Picker.Item label="+81 (JP)" value="+81" />
          </Picker>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <Spacer height={10} />
      <Text>Industry</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={industry}
          onValueChange={(itemValue) => setIndustry(itemValue)}
        >
          <Picker.Item
            label="Trades & Home Service"
            value="tradesHomeService"
          />
          <Picker.Item
            label="Disability & Aged Care"
            value="disabilityAgedCare"
          />
          <Picker.Item
            label="Lifestyle & Personal Services"
            value="lifestylePersonalServices"
          />
          <Picker.Item label="Education & Coaching" value="educationCoaching" />
          <Picker.Item label="E-commerce & Retail" value="eCommerceRetail" />
          <Picker.Item label="Health & Wellness" value="healthWellness" />
          <Picker.Item
            label="Real Estate & Property Management"
            value="realEstateProperty"
          />
          <Picker.Item label="Technology & SaaS" value="technologySaas" />
        </Picker>
      </View>

      <Spacer height={10} />
      <Text>Service</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={service}
          onValueChange={(itemValue) => setService(itemValue)}
        >
          <Picker.Item label="Human Assistants" value="humanAssistants" />
          <Picker.Item
            label="Customer Service Representative"
            value="customerServiceRepresentative"
          />
          <Picker.Item
            label="Administrative Support"
            value="administrativeSupport"
          />
          <Picker.Item
            label="Back Office Solutions"
            value="backOfficeSolutions"
          />
          <Picker.Item
            label="Social Media Manager"
            value="socialMediaManager"
          />
          <Picker.Item label="Marketing Support" value="marketingSupport" />
          <Picker.Item label="System Management" value="systemManagement" />
          <Picker.Item label="IT Support" value="itSupport" />
          <Picker.Item label="Website Development" value="websiteDevelopment" />
          <Picker.Item label="App Development" value="appDevelopment" />
          <Picker.Item label="IT Infrastructure" value="itInfrastructure" />
          <Picker.Item label="Project Management" value="projectManagement" />
        </Picker>
      </View>

      <Spacer />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffeff1",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  phoneContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  countryCodeContainer: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 10,
  },
  countryCodePicker: {
    width: "100%",
    height: 50,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#d22",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
