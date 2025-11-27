import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Logo from "../../assets/images/geekify360_logo.png";
import Icon from "react-native-vector-icons/FontAwesome";

import { useRouter } from "expo-router";

// Mock data to make the UI look populated
const MOCK_CHATS = [
  {
    id: "1",
    name: "John Doe",
    message: "Hey, is the job still available?",
    time: "2m ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    message: "Thanks for the quick service!",
    time: "1h ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    message: "Can we reschedule for tomorrow?",
    time: "3h ago",
  },
  {
    id: "4",
    name: "Sarah Connor",
    message: "Payment has been sent.",
    time: "1d ago",
  },
  {
    id: "5",
    name: "Support Team",
    message: "Your account has been verified.",
    time: "2d ago",
  },
];

const Chat = () => {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      // 3. Add Navigation Logic
      onPress={() =>
        router.push({
          pathname: "/chat/conversation",
          params: { name: item.name }, // Pass the person's name
        })
      }
    >
      {/* Avatar Placeholder */}
      <View style={styles.avatar}>
        <Icon name="user" size={20} color="#fff" />
      </View>

      {/* Message Content */}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Image source={Logo} style={styles.headerLogo} />
      </View>

      {/* Search Bar Placeholder */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search conversations..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={MOCK_CHATS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeff1", // Your theme background
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 20,
    // Shadow for better visuals
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: "#333",
  },

  // List Item Styles
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    // Subtle shadow for cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d31e31", // Primary color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
});
