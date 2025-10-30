import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/images/tradie+.png';
import { Colors } from '../../constants/Colors';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { drawerItems } from '../../constants/drawerItems';

const RootLayout = () => {
  const theme = Colors.light; // you can still use useColorScheme if you want
  const navigation = useNavigation();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: 'black',
        drawerActiveBackgroundColor: '#ffe8e8',
        drawerActiveTintColor: '#d22',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="home" options={{ title: 'Home' }} />
      <Drawer.Screen name="chat" options={{ title: 'Chat' }} />
      <Drawer.Screen name="about" options={{ title: 'About' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
    </Drawer>
  );
};

/* 🎨 Custom Sidebar Component */
const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index]; // 👈 Get the current active screen name

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* 🔹 App / User Header Section */}
      <View style={styles.drawerHeader}>
        <Image source={Logo} style={styles.drawerLogo} />
        <Text style={styles.drawerTitle}>Tradie+</Text>
        <Text style={styles.drawerSubtitle}>Welcome back!</Text>
      </View>

      {/* 🔹 Custom Drawer Items */}
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

      {/* 🔹 Custom Bottom Buttons */}
      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: 'red' }}
          icon={({ size }) => <Icon name="sign-out" color="red" size={size} />}
          onPress={() => alert('Logout pressed')}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  logo: {
    marginRight: 10,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerLogo: {
    width: 80,
    height: 30,
    resizeMode: 'contain',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
});
