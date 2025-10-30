import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import Env from '../../config/env' // import your env file
import Icon from 'react-native-vector-icons/FontAwesome'

console.log('API URL:', Env.API_URL)
console.log('Environment:', Env.ENV)

const Home = () => {
  return (
    <View style={styles.container}>     

      <View>
        <Text style={[styles.card, { bottom: 80 }]}>Calls</Text>
      </View>

      <View>
        <Text style={[styles.card, { bottom: 35 }]}>Tickets</Text>
      </View>

      <View>
        <Text style={[styles.card, { top: 10 }]}>Reports</Text>
      </View>

      <Text style={{bottom: 585}}>Stage: {Env.ENV}</Text>

      <Link href='/login'>Login Page</Link>

      <Link href='/chat' style={styles.chaticon}>
        <Icon name="comments" size={50} color="#900" />
      </Link>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffeff1',
  },
  tradielogo: {
    position: 'absolute',
    top: 0,
    right: 10,
    marginVertical: 20,
    width: 100,
    height: 100,
  },
  card: {
    position: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 5,
    width: 300,
    height: 150,
    boxShadow: '4px 4px #000000',
  },
  chaticon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    marginVertical: 20,
    width: 100,
    height: 100,
  }
})
