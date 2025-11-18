import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // ✅ Import this hook
import Spacer from '../../components/Spacer'

const Settings = () => {
  const router = useRouter();
  return (
    
    <View style={styles.container}>

        <Pressable onPress={() => router.push("/subscription")}>
          <Text>Manage Subscription</Text>
        </Pressable>

    </View>
  )
}

export default Settings

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