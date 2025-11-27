/* UI for Sidebar Menu */

import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { Colors } from "../../constants/Colors";

export default function DrawerLayout() {
  const theme = Colors.light;

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: "black",
        drawerActiveBackgroundColor: "#ffe8e8",
        drawerActiveTintColor: "#d22",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="home" options={{ title: "Home" }} />{" "}
      {/* Can also be dashboard */}
      <Drawer.Screen name="chat" options={{ title: "Chat" }} />
      <Drawer.Screen name="profile" options={{ title: "Profile" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
      <Drawer.Screen
        name="service_categories"
        options={{ title: "Service Categories" }}
      />
      <Drawer.Screen name="service" options={{ title: "Service" }} />
      <Drawer.Screen name="service_tips" options={{ title: "Service Tips" }} />
      <Drawer.Screen
        name="all_customers"
        options={{ title: "All Customers" }}
      />
      <Drawer.Screen
        name="add_customers"
        options={{ title: "Add Customers" }}
      />
      <Drawer.Screen
        name="export_customer"
        options={{ title: "Export Customer" }}
      />
      <Drawer.Screen
        name="all_technician"
        options={{ title: "All Technician" }}
      />
      <Drawer.Screen
        name="add_technician"
        options={{ title: "Add Technician" }}
      />
      <Drawer.Screen name="about" options={{ title: "About" }} />
    </Drawer>
  );
}
