import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
// Temporarily replace Colors.primary with a literal color
// import { Colors } from "../../constants/Colors";
import Spacer from "../../components/Spacer";

const AllCustomers = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.geekifypeople.geekify.global/api/v1/customers?with_relation[]=organization",
        {
          headers: {
            "Client-Secret": "secret",
            Authorization:
              "Bearer 4499|8LHNSgcWmfbQHws9lHpKwIPnEeu5zOwYrQqvVXnj19837f5a",
            Accept: "application/json",
          },
        }
      );

      const json = await response.json();
      console.log("API Response:", json);

      const rawData = json?.data;

      // FIX: Convert non-array data into array
      const list = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

      console.log("Customer list:", list);

      const formatted = list.map((c) => ({
        id: c.id?.toString(),
        status: c.status || "Unknown",
        type: c.type || "Unknown",
        referralCode: c.referral_code || "None",
        subscribed: c.newsletter_subscription || "Unknown",
        createdAt: c.created_at || "Unknown",
        organization: c.organization?.name || `Org ID: ${c.organization_id}`,
        avatar:
          "https://ui-avatars.com/api/?background=random&name=" +
          encodeURIComponent(`Customer ${c.id}`),
      }));

      setCustomers(formatted);
    } catch (err) {
      console.error("❌ Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.referralCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerPress = (customer) => {
    router.push(`/drawer/customers/${customer.id}`);
  };

  const renderCustomerItem = ({ item }) => (
    <Pressable
      style={styles.customerCard}
      onPress={() => handleCustomerPress(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Customer #{item.id}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.org}>Organization: {item.organization}</Text>
        <Text style={styles.referral}>Referral: {item.referralCode}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.created}>Created: {item.createdAt}</Text>
      </View>
      <Icon
        name="chevron-right"
        size={14}
        color="#ccc"
        style={{ alignSelf: "center" }}
      />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Customers</Text>
      </View>

      {/* Remove Spacer temporarily */}
      {/* <Spacer height={10} /> */}

      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by type or referral..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* <Spacer height={10} /> */}

      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : filteredCustomers.length ? (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomerItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text>No customers found.</Text>
        </View>
      )}

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/drawer/add_customers")}
      >
        <Icon name="plus" size={20} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  listContent: { padding: 16 },
  customerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: { width: 55, height: 55, borderRadius: 50, marginRight: 12 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  type: { fontSize: 14, color: "#666", marginTop: 2 },
  org: { fontSize: 14, color: "#666", marginTop: 2 },
  referral: { fontSize: 14, color: "#666", marginTop: 2 },
  status: { fontSize: 14, color: "#666", marginTop: 2 },
  created: { fontSize: 13, color: "#999", marginTop: 2 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#007AFF",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});

export default AllCustomers;
