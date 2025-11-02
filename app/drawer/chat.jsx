import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router';
import React from 'react'
import Logo from '../../assets/images/tradie_plus_official_logo.png'
import Icon from 'react-native-vector-icons/FontAwesome';

const chat = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Chat Page</Text>

    </View>
  )
}

export default chat

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffeff1',
  },
  tradielogo: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginVertical: 20,
    width: 100,
    height: 100,
  },
  backicon: {
    position: 'absolute',
    top: 34,
    left: 30,
    marginVertical: 20,
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
})