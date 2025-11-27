import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../../constants/Colors"; // Adjust path as needed
import Spacer from "../../components/Spacer";

const MOCK_MESSAGES = [
  {
    id: "1",
    text: "Hey, is the job still available?",
    sender: "them",
    time: "10:00 AM",
  },
  {
    id: "2",
    text: "Yes, it is! When can you start?",
    sender: "me",
    time: "10:05 AM",
  },
  {
    id: "3",
    text: "I am available from tomorrow.",
    sender: "them",
    time: "10:10 AM",
  },
  {
    id: "4",
    text: "That works perfectly. Let's meet at 9 AM.",
    sender: "me",
    time: "10:15 AM",
  },
  { id: "5", text: "Great! See you then.", sender: "them", time: "10:16 AM" },
];

const Conversation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name } = params; // Get the name passed from the previous screen

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSend = () => {
    if (messageText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[styles.messageText, isMe ? styles.myText : styles.theirText]}
        >
          {item.text}
        </Text>
        <Text
          style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/drawer/chat")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.avatarSmall}>
            <Icon name="user" size={16} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>{name || "Chat"}</Text>
        </View>

        <TouchableOpacity style={styles.callButton}>
          <Icon name="phone" size={20} color={Colors.primary || "#d31e31"} />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="plus" size={20} color="#999" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="paper-plane" size={18} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // Android status bar padding if SafeAreaView doesn't cover it automatically
    paddingTop: Platform.OS === "android" ? 40 : 15,
  },
  backButton: {
    padding: 10,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  callButton: {
    padding: 10,
  },

  // Message List
  listContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary || "#d31e31",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: "#fff",
  },
  theirText: {
    color: "#333",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myTime: {
    color: "rgba(255,255,255,0.7)",
  },
  theirTime: {
    color: "#999",
  },

  // Input Area
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 50,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    marginHorizontal: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary || "#d31e31",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
