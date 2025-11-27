import React, { useContext } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../../assets/images/geekify360_logo.png";
import { Colors } from "../../constants/Colors";
import { drawerItems } from "../../constants/drawerItems";
import { UserContext } from "../../context/UserContext";
import Spacer from "../../components/Spacer";

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const { userData, logoutUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (accessToken) {
        await fetch(
          "https://api.geekifypeople.geekify.global/api/v1/logout-token",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
              "client-secret": "secret",
            },
          }
        );
      }
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      await logoutUser();
      router.replace("/auth/login");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔥 Scrollable section */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* Header */}
        <Spacer />
        <View style={styles.drawerHeader}>
          <Image source={Logo} style={styles.drawerLogo} />
          {userData ? (
            <Text style={styles.drawerSubtitle}>
              Welcome back, {userData.firstName} {userData.lastName}!
            </Text>
          ) : (
            <Text style={styles.drawerSubtitle}>Welcome back!</Text>
          )}
        </View>

        {/* Drawer Items */}
        <View style={{ paddingBottom: 20 }}>
          {drawerItems.map((item, index) => {
            if (item.type === "section") {
              return (
                <View
                  key={`section-${index}`}
                  style={{ marginTop: 20, marginBottom: 6, marginLeft: 20 }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "700", color: "#888" }}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            }

            return (
              <DrawerItem
                key={index}
                label={item.label}
                icon={({ color, size }) => item.icon(color, size)}
                onPress={() => props.navigation.navigate(item.route)}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* 🔻 Fixed Footer */}
      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: "red" }}
          icon={({ size }) => <Icon name="sign-out" color="red" size={size} />}
          onPress={handleLogout}
        />
        <Spacer />
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerLogo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },
  drawerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },
});
