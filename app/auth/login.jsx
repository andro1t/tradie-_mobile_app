import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Modal, Dimensions } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import ThemedTextInput from '../../components/ThemedTextInput';
import Spacer from '../../components/Spacer';
import Logo from '../../assets/images/tradie_plus_official_logo.png';

const { height } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();
  const [modalIndex, setModalIndex] = useState(4); // intro modal control
  const [showManagedModal, setShowManagedModal] = useState(false); // ✅ new modal
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Show intro only on first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasSeenIntro = await AsyncStorage.getItem('hasSeenIntro');
      if (!hasSeenIntro) {
        setModalIndex(0);
        await AsyncStorage.setItem('hasSeenIntro', 'true');
      }
    };
    checkFirstLaunch();
  }, []);

  const handleNext = () => {
    if (modalIndex < 3) setModalIndex(modalIndex + 1);
    else setModalIndex(4);
  };

  const handleSkip = () => {
    setModalIndex(4);
  };

  const handleSubmit = () => {
    if (username === 'test' && password === '123') {
      alert('Login Successful');
      setShowManagedModal(true); // ✅ show new modal after login
    } else {
      alert('Invalid username or password');
    }
  };

  const handleManagedChoice = (choice) => {
    setShowManagedModal(false);
    if (choice === 'yes') {
      router.push('/managedRegistration'); // ✅ navigate to managed registration
    } else {
      router.push('/drawer/home'); // ✅ normal flow
    }
  };

  return (
    <View style={[styles.container, modalIndex < 4 && { opacity: 0.4 }]}>
      {/* ✅ Login UI */}
      <Spacer />
      <Image source={Logo} style={styles.tradieLogo} />
      <Spacer />
      <Text style={{ bottom: 150 }}>Mobile Professionals</Text>

      <Spacer />
      <ThemedTextInput
        style={{ width: '80%', bottom: 100 }}
        placeholder="Username"
        keyboardType="default"
        value={username}
        onChangeText={setUsername}
      />

      <Spacer />
      <ThemedTextInput
        style={{ width: '80%', bottom: 100 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Spacer />
      <Text style={{ bottom: 130 }}>
        Don't have an account yet?
        <Link href="/auth/register" style={{ color: '#008cff' }}>
          {' '}
          Register Now.
        </Link>
      </Text>

      <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
        <Text style={{ color: '#f2f2f2' }}>Login</Text>
      </Pressable>

      {/* ✅ Intro Modals (3/4 height) */}
      {modalIndex < 4 && (
        <Modal transparent animationType="slide" visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>

              <Image source={Logo} style={styles.logo} />
              <Text style={styles.modalTitle}>Welcome to Tradie+</Text>
              <Text style={styles.modalText}>
                {[
                  'Tradie+ helps you connect with skilled professionals quickly.',
                  'Easily manage your bookings and payments in one place.',
                  'Stay updated with real-time notifications and job progress.',
                  'Get started by logging in or creating an account.',
                ][modalIndex]}
              </Text>

              <Pressable onPress={handleNext} style={styles.nextBtn}>
                <Text style={{ color: 'white' }}>
                  {modalIndex === 3 ? 'Continue to Login' : 'Next'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* ✅ Managed Choice Modal */}
      <Modal transparent visible={showManagedModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.choiceModalContent}>
            <Text style={styles.modalTitle}>Do you want to be managed by us?</Text>
            <Text style={styles.modalText}>
              Choosing “Yes” lets Tradie+ manage your bookings and visibility as part of our verified network.
            </Text>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
              <Pressable onPress={() => handleManagedChoice('yes')} style={styles.choiceBtnYes}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Yes</Text>
              </Pressable>
              <Pressable onPress={() => handleManagedChoice('no')} style={styles.choiceBtnNo}>
                <Text style={{ color: '#333', fontWeight: '600' }}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    height: height * 0.75,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    padding: 20,
  },
  choiceModalContent: {
    height: height * 0.5,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  skipText: {
    color: '#008cff',
    fontWeight: '600',
    fontSize: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginVertical: 20,
    lineHeight: 22,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  choiceBtnYes: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  choiceBtnNo: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  tradieLogo: {
    resizeMode: 'contain',
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
});

export default Login;
