import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import React from 'react'
import Logo from '../assets/images/tradie+.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const About = () => {
  return (
    
    <View style={styles.container}>

        <Text style={styles.title}>About</Text>

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
    fontSize: 18
  },
})