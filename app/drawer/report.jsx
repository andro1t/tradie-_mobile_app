import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../../constants/Colors"; // <-- now using your real Colors

const screenWidth = Dimensions.get("window").width;

// --- FILTER OPTIONS ---
const DURATION_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

// --- MOCK DATA ---
const mockKpis = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$12,450.00",
    change: "+4.5%",
    trend: "up",
    icon: "dollar",
  },
  {
    id: 2,
    title: "New Clients",
    value: "215",
    change: "+12",
    trend: "up",
    icon: "users",
  },
  {
    id: 3,
    title: "Avg. Transaction",
    value: "$58.14",
    change: "-1.2%",
    trend: "down",
    icon: "credit-card",
  },
];

// --- KPI CARD ---
const KPICard = ({ title, value, change, trend, icon }) => {
  const isUp = trend === "up";
  const trendColor = isUp ? "#10B981" : "#EF4444";
  const trendIcon = isUp ? "long-arrow-up" : "long-arrow-down";

  return (
    <View style={styles.kpiCard}>
      <Icon
        name={icon}
        size={24}
        color={Colors.primary}
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={styles.kpiValue}>{value}</Text>

      <View style={styles.kpiFooter}>
        <Icon name={trendIcon} size={12} color={trendColor} />
        <Text style={[styles.kpiChange, { color: trendColor }]}>
          {change} vs. last period
        </Text>
      </View>
    </View>
  );
};

// --- DATE FILTER ---
const DurationFilter = ({ selectedDuration, onSelect }) => (
  <View style={styles.filterContainer}>
    {DURATION_OPTIONS.map((option) => (
      <Pressable
        key={option.value}
        style={[
          styles.filterButton,
          selectedDuration === option.value && styles.filterButtonActive,
        ]}
        onPress={() => onSelect(option.value)}
      >
        <Text
          style={[
            styles.filterText,
            selectedDuration === option.value && styles.filterTextActive,
          ]}
        >
          {option.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

// --- MAIN SCREEN ---
const ReportScreen = () => {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState("month");
  const [data, setData] = useState(mockKpis);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (duration) => {
    setIsRefreshing(true);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const factor = { day: 0.1, week: 0.3, month: 1.0, year: 5.0 }[duration];
    const updated = mockKpis.map((kpi) => ({
      ...kpi,
      value:
        "$" +
        (
          parseFloat(kpi.value.replace("$", "").replace(",", "")) * factor
        ).toFixed(2),
      change: factor > 1 ? "+20%" : factor < 1 ? "-5%" : "+4.5%",
      trend: factor > 1 ? "up" : "down",
    }));

    setData(updated);
    setIsRefreshing(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData(selectedDuration);
  }, [selectedDuration]);

  return (
    <View style={styles.fullContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchData(selectedDuration)}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Pressable onPress={() => router.push("/drawer/profile")}>
            <Icon name="cog" size={26} color="#444" />
          </Pressable>
        </View>

        <Text style={styles.subtext}>
          Performance insights ({selectedDuration})
        </Text>

        <DurationFilter
          selectedDuration={selectedDuration}
          onSelect={setSelectedDuration}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading report data...</Text>
          </View>
        ) : (
          <>
            {/* KPI GRID */}
            <View style={styles.kpiGrid}>
              {data.map((kpi) => (
                <KPICard key={kpi.id} {...kpi} />
              ))}
            </View>

            {/* Chart Section */}
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Revenue Trend</Text>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartText}>[Line Chart Placeholder]</Text>
                <Text style={styles.chartSubText}>
                  Visualizing Total Revenue ({selectedDuration})
                </Text>
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Payment Method Breakdown</Text>

              {[
                ["Card Payments:", "65%"],
                ["Cash Payments:", "20%"],
                ["Afterpay/EFTPOS:", "15%"],
              ].map(([label, value], idx) => (
                <View key={idx} style={styles.breakdownItem}>
                  <Text style={styles.breakdownText}>{label}</Text>
                  <Text style={styles.breakdownValueText}>{value}</Text>
                </View>
              ))}

              <Pressable
                style={styles.detailsButton}
                onPress={() => router.push("/drawer/transactions")}
              >
                <Text style={styles.detailsButtonText}>
                  View Full Transaction List
                </Text>
                <Icon
                  name="angle-right"
                  size={16}
                  color={Colors.primary}
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ReportScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#ffeff1", // same as Home.jsx
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  subtext: {
    color: "#666",
    marginBottom: 20,
  },

  // Filters
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: "#666",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  // KPI Cards
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  kpiCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiTitle: {
    fontSize: 13,
    color: "#666",
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 6,
    color: "#222",
  },
  kpiFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  kpiChange: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },

  // Chart Card
  chartCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: "#ffeff1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  chartSubText: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },

  // Breakdown Card
  detailCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
  },
  breakdownText: {
    fontSize: 15,
    color: "#222",
  },
  breakdownValueText: {
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },

  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    color: "#666",
    marginTop: 10,
  },
});
