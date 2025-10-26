import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, Link } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/images/tradie+.png';

const RootLayout = () => {
  return (
    <Stack screenOptions={{
        headerStyle: { backgroundColor: '#ffeff1'},        
    }}>

        <Stack.Screen name="index" options={{
            title: '',
            // Hamburger menu on left
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert('Open menu')}>
                <Icon name="bars" size={24} color="black" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            ),
            // Tradie+ logo on right
            headerRight: () => (
              
              <Link href='/about' style={styles.chaticon}>
                <Image
                  source={Logo}
                  style={{ width: 80, height: 30, marginRight: 10, resizeMode: 'absolute' }}
                />
              </Link>
            ),
          }}
        />

        <Stack.Screen name='chat' options={{ 
            title: 'Chat',
            headerRight: () => (
              
              <Link href='/about' style={styles.chaticon}>
                <Image
                  source={Logo}
                  style={{ width: 80, height: 30, marginRight: 10, resizeMode: 'absolute' }}
                />
              </Link>
            ),
          }}
        />

        <Stack.Screen name='about' options={{ title: 'About'}}/>
        
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})