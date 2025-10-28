import { StyleSheet, Text, View, Image, Pressable, useColorScheme } from 'react-native'
import { Link } from 'expo-router';
import { Colors } from '../../constants/Colors'
import React from 'react'
import Logo from '../../assets/images/tradie+.png'
import Spacer from '../../components/Spacer'
import ThemedTextInput from '../../components/ThemedTextInput'

const Register = () => { 
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  const handleSubmit = () => {
    console.log('register button pressed')
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    tradieLogo: { 
      bottom: 50,   
      width: 200,
      height: 200,
    },
    btn: {
      backgroundColor: Colors.primary,
      padding: 15,
      borderRadius: 5,
    },
    pressed: {
      opacity: 0.5,
    },
  })

  return (
    <View style={styles.container}>
      <Spacer />
      <Image source={Logo} style={styles.tradieLogo} />
      <Spacer />
      <Text style={{ bottom: 150 }}>Mobile Professionals</Text>

      <Spacer />
      <ThemedTextInput 
        style={{ width: '80%', bottom: 100 }}
        placeholder="Username"
        keyboardType="default"
      />

      <Spacer />
      <ThemedTextInput 
        style={{ width: '80%', bottom: 100 }}
        placeholder="Password"
        keyboardType="default"
      />

      <Spacer />
      <Text style={{ bottom: 130 }}>
        Already have an account. 
        <Link href='/login' style={{color: "#008cff"}}>
          Login Now.
        </Link>
      </Text>

      <Pressable 
        onPress={handleSubmit}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
        <Text style={{ color: '#f2f2f2' }}>Register</Text>
      </Pressable>
    </View>
  )
}

export default Register
