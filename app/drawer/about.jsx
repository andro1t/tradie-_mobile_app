import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react'
import Logo from '../../assets/images/tradie_plus_official_logo.png'
import Icon from 'react-native-vector-icons/FontAwesome';

const About = () => {
  return (
    
    <View style={styles.container}>

        <Text style={styles.title}>At Geekify People, we understand the unique needs of tradies and mobile service providers.</Text>
        <Text style={styles.title}>You’re constantly on the move, focused on your craft – not on juggling calls, bookings, or admin tasks.</Text>   
        <Text style={styles.title}>That’s where we come in. We help you stay organized, connected, and professional with smart outsourcing solutions built for your workflow.</Text>  
        

    </View>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffeff1',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
})