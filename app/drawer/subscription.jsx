import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'

const Subscription = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>
    </View>
  )
}

export default Subscription

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffeff1'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
})