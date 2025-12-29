import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import { router } from "expo-router";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Animation for the "current" step in the timeline
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // Repeat infinitely
      true // Reverse the animation
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Raleway_600SemiBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // --- Data unchanged ---
  const quickStats = [
    {
      label: "Total Orders",
      value: "24",
      icon: "package-variant",
      color: "#4F46E5",
      lib: MaterialCommunityIcons,
    },
    {
      label: "Revenue",
      value: "$12.8K",
      icon: "currency-usd",
      color: "#10B981",
      lib: MaterialCommunityIcons,
    },
    {
      label: "Growth",
      value: "+12%",
      icon: "trending-up",
      color: "#F59E0B",
      lib: Feather,
    },
    {
      label: "Pending",
      value: "8",
      icon: "truck-fast",
      color: "#3B82F6",
      lib: MaterialCommunityIcons,
    },
    {
      label: "Inventory",
      value: "$45.2K",
      icon: "warehouse",
      color: "#6366F1",
      lib: MaterialCommunityIcons,
    },
    {
      label: "Retention",
      value: "89%",
      icon: "handshake",
      color: "#EC4899",
      lib: MaterialCommunityIcons,
    },
    {
      label: "Avg. Lead",
      value: "2.3d",
      icon: "timer-sand",
      color: "#8B5CF6",
      lib: MaterialCommunityIcons,
    },
    {
      label: "QC Pass",
      value: "97.2%",
      icon: "check-decagram",
      color: "#14B8A6",
      lib: MaterialCommunityIcons,
    },
  ];

  const quickActions = [
    {
      title: "Inventory Hub",
      icon: "archive",
      color: "#10B981",
      screen: "/routes/IT22355928/inventory",
    },
    {
      title: "Market Analysis",
      icon: "stats-chart",
      color: "#0EA5E9",
      screen: "../market",
    },
    {
      title: "QC Lab",
      icon: "flask",
      color: "#7C3AED",
      screen: "/routes/IT22355928/qclab",
    },
    {
      title: "Performance",
      icon: "analytics",
      color: "#EF4444",
      screen: "/routes/IT22355928/performance",
    },
    {
      title: "Geo Alerts",
      icon: "location-outline",
      color: "#10B981",
      screen: "../analytics",
    },
    {
      title: "Documentation",
      icon: "document-text-outline",
      color: "#0EA5E9",
      screen: "../analytics",
    },
  ];

  const recentOrders = [
    {
      id: "1",
      customer: "Global Tires Inc.",
      amount: "$2,400",
      status: "Shipped",
      flag: "🇺🇸",
    },
    {
      id: "2",
      customer: "Rubber World Ltd.",
      amount: "$1,800",
      status: "Processing",
      flag: "🇬🇧",
    },
    {
      id: "3",
      customer: "Auto Parts Co.",
      amount: "$3,200",
      status: "Delivered",
      flag: "🇩🇪",
    },
  ];

  const marketPrices = [
    { grade: "RSS1", price: "$1.82", change: "+2.1%", trend: "up" },
    { grade: "RSS3", price: "$1.68", change: "+0.8%", trend: "up" },
    { grade: "SMR20", price: "$1.55", change: "-1.2%", trend: "down" },
    { grade: "Latex", price: "$1.95", change: "+3.5%", trend: "up" },
  ];

  const topDestinations = [
    { country: "USA", value: 38, flag: "🇺🇸" },
    { country: "Germany", value: 24, flag: "🇩🇪" },
    { country: "China", value: 18, flag: "🇨🇳" },
    { country: "Japan", value: 12, flag: "🇯🇵" },
    { country: "India", value: 8, flag: "🇮🇳" },
  ];

  const supplyChain = [
    { stage: "Harvested", status: "done", date: "Nov 8" },
    { stage: "Processed", status: "done", date: "Nov 9" },
    { stage: "QC Check", status: "current", date: "Today" },
    { stage: "Shipped", status: "pending", date: "Nov 13" },
    { stage: "Delivered", status: "pending", date: "Nov 18" },
  ];

  const certifications = [
    { name: "ISO 9001", valid: true },
    { name: "RSPO", valid: true },
    { name: "FDA Compliance", valid: false, expiry: "Dec 2025" },
    { name: "EU REACH", valid: true },
  ];

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <Header />
      <SearchInput />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
      >
        {/* STATS CAROUSEL */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 14}
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.lib;
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 80).duration(400)}
                key={index}
                style={[
                  styles.statCardWrapper,
                  { marginLeft: index === 0 ? 0 : 14 },
                ]}
              >
                <View
                  style={[
                    styles.statCard,
                    { borderLeftColor: stat.color, borderLeftWidth: 4 },
                  ]}
                >
                  <View style={styles.statHeader}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: `${stat.color}18` },
                      ]}
                    >
                      <Icon
                        name={stat.icon as any}
                        size={20}
                        color={stat.color}
                      />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* QUICK ACTIONS GRID */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGridNew}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCardNew}
                onPress={() => router.push(action.screen as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[`${action.color}30`, `${action.color}05`]}
                  style={styles.actionIconNew}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={30}
                    color={action.color}
                  />
                </LinearGradient>
                <Text style={styles.actionTitleNew}>{action.title}</Text>
                <Feather
                  name="arrow-right"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginTop: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* RECENT ORDERS */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAllText}>
                View All{" "}
                <Feather name="arrow-right" size={12} color="#4F46E5" />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ordersContainer}>
            {recentOrders.map((order, i) => (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.orderCard,
                  i === recentOrders.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.orderInfo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={styles.flag}>{order.flag}</Text>
                    <Text style={styles.orderCustomer}>{order.customer}</Text>
                  </View>
                  <Text style={styles.orderAmount}>
                    Order Value: **{order.amount}**
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          order.status === "Delivered"
                            ? "#10B98118"
                            : order.status === "Shipped"
                            ? "#3B82F618"
                            : "#F59E0B18",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            order.status === "Delivered"
                              ? "#10B981"
                              : order.status === "Shipped"
                              ? "#3B82F6"
                              : "#F59E0B",
                        },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* LIVE MARKET PRICES */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Live Rubber Prices (USD/kg)</Text>
          <View style={styles.priceContainer}>
            {marketPrices.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.priceRow,
                  i === marketPrices.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.gradeText}>{item.grade}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <Text style={styles.priceText}>{item.price}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name={
                        item.trend === "up"
                          ? "arrow-top-right"
                          : "arrow-bottom-left"
                      }
                      size={16}
                      color={item.trend === "up" ? "#10B981" : "#EF4444"}
                    />
                    <Text
                      style={[
                        styles.changeText,
                        { color: item.trend === "up" ? "#10B981" : "#EF4444" },
                      ]}
                    >
                      {item.change}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* SUPPLY CHAIN TIMELINE */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Active Shipment: **PO#8821**</Text>
          <View style={styles.timelineContainer}>
            {supplyChain.map((step, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={{ alignItems: "center" }}>
                  {step.status === "current" ? (
                    <Animated.View
                      style={[
                        styles.timelinePulse,
                        animatedPulseStyle,
                        { backgroundColor: "#4F46E530" },
                      ]}
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          { backgroundColor: "#4F46E5" },
                        ]}
                      />
                    </Animated.View>
                  ) : (
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor:
                            step.status === "done" ? "#10B981" : "#D1D5DB",
                        },
                      ]}
                    >
                      {step.status === "done" && (
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                      )}
                    </View>
                  )}

                  {i < supplyChain.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor:
                            step.status === "done" ? "#10B981" : "#E5E7EB",
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStage,
                      step.status === "current" && {
                        fontFamily: "Raleway_600SemiBold",
                        color: "#4F46E5",
                      },
                    ]}
                  >
                    {step.stage}
                  </Text>
                  <Text style={styles.timelineDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* TOP EXPORT DESTINATIONS */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Top Export Destinations</Text>
          <View style={styles.destinationsContainer}>
            {topDestinations.map((dest, i) => (
              <View
                key={i}
                style={[
                  styles.destRow,
                  i === topDestinations.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    width: width * 0.3,
                  }}
                >
                  <Text style={styles.flagLg}>{dest.flag}</Text>
                  <Text style={styles.destCountry}>{dest.country}</Text>
                </View>
                <View style={styles.barContainer}>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${dest.value}%`, backgroundColor: "#4F46E5" },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>{dest.value}%</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* COMPLIANCE STATUS */}
        <Animated.View
          entering={FadeInDown.delay(900).duration(500)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Compliance & Certifications</Text>
          <View style={styles.certContainer}>
            {certifications.map((cert, i) => (
              <View
                key={i}
                style={[
                  styles.certCard,
                  {
                    borderColor: cert.valid ? "#10B98130" : "#EF444430",
                    borderLeftColor: cert.valid ? "#10B981" : "#EF4444",
                    borderLeftWidth: 4,
                    marginBottom: i === certifications.length - 1 ? 0 : 10,
                  },
                ]}
              >
                <Ionicons
                  name={cert.valid ? "shield-checkmark" : "alert-circle"}
                  size={24}
                  color={cert.valid ? "#10B981" : "#EF4444"}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  {!cert.valid && (
                    <Text style={styles.certExpiry}>
                      Expires {cert.expiry} - **Action Needed**
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.certStatus,
                    { color: cert.valid ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {cert.valid ? "Valid" : "Renew"}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* AI DEMAND FORECAST */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(500)}
          style={styles.aiCardWrapper}
        >
          <LinearGradient colors={["#1E293B", "#334155"]} style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View>
                <Text style={styles.aiTitle}>AI Demand Forecast</Text>
                <Text style={styles.aiSubtitle}>
                  Next 30 days: **+18% surge** expected
                </Text>
              </View>
              <MaterialCommunityIcons name="brain" size={36} color="#60A5FA" />
            </View>
            <TouchableOpacity style={styles.aiButton} onPress={() => {}}>
              <Text style={styles.aiButtonText}>View Full Report</Text>
              <Feather name="arrow-right" size={18} color="#60A5FA" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* FEATURED PRODUCT */}
        <Animated.View
          entering={FadeInDown.delay(1100).duration(500)}
          style={styles.featuredCardWrapper}
        >
          <LinearGradient
            colors={["#4F46E5", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredCard}
          >
            <View style={styles.featuredContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.featuredTitle}>Premium RSS1 Blocks</Text>
                <Text style={styles.featuredDescription}>
                  DRC 78% • Low dirt • ISO Certified • Ready for export
                </Text>
                <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
                  <TouchableOpacity style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Order Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>View COA</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <FontAwesome5
                name="cubes"
                size={70}
                color="#FFF"
                style={{ opacity: 0.8 }}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 30,
  },
  statCardWrapper: {
    width: CARD_WIDTH,
  },
  statCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionsGridNew: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    justifyContent: "space-between",
  },
  actionCardNew: {
    width: (width - 72) / 2,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  actionIconNew: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  actionTitleNew: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#1F2937",
    textAlign: "left",
  },
  ordersContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  orderInfo: {
    flex: 1,
  },
  flag: {
    fontSize: 20,
  },
  flagLg: {
    fontSize: 24,
  },
  orderCustomer: {
    fontSize: 16,
    fontFamily: "Raleway_600SemiBold",
    color: "#111827",
  },
  orderAmount: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#6B7280",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
  },
  priceContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  gradeText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#374151",
  },
  priceText: {
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
    color: "#111827",
  },
  changeText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    marginLeft: 4,
  },
  timelineContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 15,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelinePulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    height: 48,
    position: "absolute",
    top: 28,
    left: 14,
  },
  timelineContent: {
    marginLeft: 18,
    flex: 1,
  },
  timelineStage: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#111827",
  },
  timelineDate: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#6B7280",
    marginTop: 4,
  },
  destinationsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 15,
  },
  destRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  destCountry: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#374151",
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  barValue: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#4F46E5",
    minWidth: 32,
    textAlign: "right",
  },
  certContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 15,
  },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },
  certName: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#111827",
    flex: 1,
  },
  certExpiry: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#EF4444",
    marginTop: 4,
  },
  certStatus: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    minWidth: 50,
    textAlign: "right",
  },
  aiCardWrapper: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  aiCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  aiTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: "#FFF",
  },
  aiSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#94A3B8",
    marginTop: 4,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  aiButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#60A5FA",
  },
  featuredCardWrapper: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  featuredCard: {
    padding: 28,
    borderRadius: 22,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },
  featuredContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredTitle: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    color: "#D1D5DB",
    marginBottom: 16,
    lineHeight: 22,
  },
  featuredButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  featuredButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    color: "#4F46E5",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E7FF80",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
});
