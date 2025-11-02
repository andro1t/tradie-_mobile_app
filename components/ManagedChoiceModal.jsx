import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const ManagedChoiceModal = ({ visible, onYes, onNo }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Be Managed by Tradie+</Text>
          <Text style={styles.subtitle}>
            Would you like Tradie+ to manage your profile and visibility for better opportunities?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.yesBtn} onPress={onYes}>
              <Text style={styles.btnText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noBtn} onPress={onNo}>
              <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ManagedChoiceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  yesBtn: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  noBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
