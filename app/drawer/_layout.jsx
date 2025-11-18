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
      <Drawer.Screen name="home" options={{ title: "Home" }} />
      <Drawer.Screen name="chat" options={{ title: "Chat" }} />
      <Drawer.Screen name="about" options={{ title: "About" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
}
