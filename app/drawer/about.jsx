import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React from "react";
import Logo from "../../assets/images/geekify360_logo.png";
import { Colors } from "../../constants/Colors";

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={Logo} style={styles.logo} />

      {/* Tagline */}
      <Text style={styles.tagline}>
        Empowering mobile professionals with smart business tools.
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* About Text */}
      <Text style={styles.text}>
        At <Text style={styles.highlight}>Geekify People</Text>, we understand
        the unique needs of tradies and mobile service providers.
      </Text>

      <Text style={styles.text}>
        You’re constantly on the move, focused on your craft — not on juggling
        calls, bookings, or admin tasks.
      </Text>

      <Text style={styles.text}>
        That’s where we come in. We help you stay organized, connected, and
        professional with outsourcing solutions built for your workflow.
      </Text>

      {/* Further Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>

        <Text style={styles.bullet}>
          • Streamlined scheduling and appointments
        </Text>
        <Text style={styles.bullet}>
          • Managed communication and call handling
        </Text>
        <Text style={styles.bullet}>• Professional business support</Text>
        <Text style={styles.bullet}>
          • Built for mobile and field professionals
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        © {new Date().getFullYear()} Geekify People
      </Text>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    alignItems: "center",
    backgroundColor: "#ffeff1",
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.primary,
  },

  tagline: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    marginBottom: 20,
  },

  divider: {
    width: "70%",
    height: 1,
    backgroundColor: "#ddc1c1",
    marginVertical: 20,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "#333",
  },

  highlight: {
    fontWeight: "bold",
    color: Colors.primary,
  },

  section: {
    width: "100%",
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  bullet: {
    fontSize: 15,
    marginBottom: 8,
    color: "#444",
  },

  footer: {
    fontSize: 12,
    color: "#888",
    marginTop: 40,
    marginBottom: 20,
  },
});
