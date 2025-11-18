/* Logic for Sidebar Menu */

import React, { useContext } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import Logo from "../../assets/images/tradie_plus_official_logo.png";
import { Colors } from "../../constants/Colors";
import { drawerItems } from "../../constants/drawerItems";
import { UserContext } from "../../context/UserContext";

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const { userData, logoutUser } = useContext(UserContext);
  const theme = Colors.light;

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/auth/login");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header */}
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
      <View style={{ flex: 1 }}>
        {drawerItems.map((item, index) => (
          <DrawerItem
            key={index}
            label={item.label}
            onPress={() => props.navigation.navigate(item.route)}
            icon={({ color, size }) => item.icon(color, size)}
            focused={props.state.routeNames[props.state.index] === item.route}
            activeTintColor="#d22"
            activeBackgroundColor="#ffe8e8"
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: "red" }}
          icon={({ size }) => <Icon name="sign-out" color="red" size={size} />}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
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
    width: 80,
    height: 30,
    resizeMode: "contain",
  },
  drawerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
  },
});
