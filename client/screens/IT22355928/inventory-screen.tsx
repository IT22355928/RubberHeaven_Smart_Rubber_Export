import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
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
  Feather,
} from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function InventoryHub() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
        <LinearGradient
          colors={["#10B981", "#059669", "#047857"]}
          style={styles.loadingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated loading indicator */}
          <View style={styles.loadingContent}>
            <View style={styles.loadingAnimationContainer}>
              <View style={styles.loadingSpinner}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
              <View style={styles.loadingDots}>
                <View style={[styles.loadingDot, styles.loadingDot1]} />
                <View style={[styles.loadingDot, styles.loadingDot2]} />
                <View style={[styles.loadingDot, styles.loadingDot3]} />
              </View>
            </View>
            
            <Text style={styles.loadingTitle}>Inventory Hub</Text>
            <Text style={styles.loadingSubtitle}>Loading Smart Rubber Management System</Text>
            
            <View style={styles.loadingProgressContainer}>
              <View style={styles.loadingProgressBar}>
                <LinearGradient
                  colors={["#FFFFFF", "#E0F2FE"]}
                  style={styles.loadingProgressFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={styles.loadingProgressText}>Initializing...</Text>
            </View>
            
            <View style={styles.loadingFeatures}>
              <View style={styles.featureItem}>
                <Feather name="package" size={16} color="#FFFFFF" />
                <Text style={styles.featureText}>Loading 128 Inventory Items</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="home" size={16} color="#FFFFFF" />
                <Text style={styles.featureText}>Syncing 4 Warehouses</Text>
              </View>
              <View style={styles.featureItem}>
                <Feather name="trending-up" size={16} color="#FFFFFF" />
                <Text style={styles.featureText}>Updating Live Metrics</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Inventory data
  const inventoryCategories = [
    { id: "all", label: "All Items", count: 128, icon: "grid" },
    { id: "raw", label: "Raw Rubber", count: 45, icon: "leaf", color: "#10B981" },
    { id: "processed", label: "Processed", count: 32, icon: "layers", color: "#3B82F6" },
    { id: "finished", label: "Finished Goods", count: 28, icon: "package", color: "#8B5CF6" },
    { id: "qc", label: "QC Pending", count: 15, icon: "flask", color: "#F59E0B" },
    { id: "low", label: "Low Stock", count: 8, icon: "alert-triangle", color: "#EF4444" },
  ];

  const inventoryItems = [
    {
      id: "INV-001",
      name: "Premium RSS1 Blocks",
      type: "Raw Rubber",
      grade: "RSS1",
      quantity: "42 tons",
      location: "Warehouse A",
      status: "In Stock",
      lastUpdated: "2 hours ago",
      color: "#10B981",
      image: "🌿",
      progress: 85,
    },
    {
      id: "INV-002",
      name: "Latex Concentrate",
      type: "Processed",
      grade: "Latex 60%",
      quantity: "28 drums",
      location: "Warehouse B",
      status: "Processing",
      lastUpdated: "1 day ago",
      color: "#3B82F6",
      image: "💧",
      progress: 60,
    },
    {
      id: "INV-003",
      name: "SMR20 Sheets",
      type: "Finished Goods",
      grade: "SMR20",
      quantity: "35 pallets",
      location: "Loading Bay",
      status: "Ready for Export",
      lastUpdated: "3 hours ago",
      color: "#8B5CF6",
      image: "📦",
      progress: 95,
    },
    {
      id: "INV-004",
      name: "RSS3 Blocks",
      type: "Raw Rubber",
      grade: "RSS3",
      quantity: "18 tons",
      location: "Warehouse C",
      status: "Low Stock",
      lastUpdated: "5 days ago",
      color: "#EF4444",
      image: "🌿",
      progress: 30,
    },
    {
      id: "INV-005",
      name: "Rubber Compounded",
      type: "Processed",
      grade: "RC-45",
      quantity: "22 batches",
      location: "Processing Unit",
      status: "In Production",
      lastUpdated: "6 hours ago",
      color: "#F59E0B",
      image: "⚗️",
      progress: 45,
    },
    {
      id: "INV-006",
      name: "Tire Grade Rubber",
      type: "Finished Goods",
      grade: "TGR-78",
      quantity: "50 rolls",
      location: "Export Zone",
      status: "Shipped",
      lastUpdated: "Yesterday",
      color: "#6366F1",
      image: "🚗",
      progress: 100,
    },
    {
      id: "INV-007",
      name: "Natural Rubber Sheets",
      type: "Raw Rubber",
      grade: "NRS-90",
      quantity: "65 sheets",
      location: "Warehouse A",
      status: "In Stock",
      lastUpdated: "4 hours ago",
      color: "#10B981",
      image: "📄",
      progress: 75,
    },
    {
      id: "INV-008",
      name: "Vulcanized Rubber",
      type: "Finished Goods",
      grade: "VR-120",
      quantity: "40 units",
      location: "Quality Zone",
      status: "QC Pending",
      lastUpdated: "2 days ago",
      color: "#EC4899",
      image: "✅",
      progress: 55,
    },
  ];

  // Updated warehouse data with percentage as number
  const warehouseLocations = [
    { id: "A", name: "Warehouse A", capacity: "100 tons", used: 65, items: 45, borderColor: "#10B981" },
    { id: "B", name: "Warehouse B", capacity: "80 tons", used: 42, items: 32, borderColor: "#3B82F6" },
    { id: "C", name: "Warehouse C", capacity: "60 tons", used: 28, items: 28, borderColor: "#8B5CF6" },
    { id: "D", name: "Processing Unit", capacity: "40 tons", used: 85, items: 15, borderColor: "#F59E0B" },
  ];

  const inventoryMetrics = [
    { label: "Total Value", value: "$45.2K", change: "+12.5%", icon: "dollar-sign", color: "#10B981" },
    { label: "Active Items", value: "128", change: "+8", icon: "package", color: "#3B82F6" },
    { label: "Avg. Age", value: "15 days", change: "-2 days", icon: "calendar", color: "#8B5CF6" },
    { label: "Turnover Rate", value: "87%", change: "+5%", icon: "refresh-cw", color: "#F59E0B" },
  ];

  const filteredItems = inventoryItems.filter(item => {
    if (activeTab !== "all" && item.type !== getCategoryLabel(activeTab)) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  function getCategoryLabel(categoryId : any) {
    const category = inventoryCategories.find(cat => cat.id === categoryId);
    return category ? category.label : "";
  }

  function getStatusColor(status : any) {
    switch (status) {
      case "In Stock": return "#10B981";
      case "Processing": return "#3B82F6";
      case "Ready for Export": return "#8B5CF6";
      case "Low Stock": return "#EF4444";
      case "In Production": return "#F59E0B";
      case "Shipped": return "#6366F1";
      case "QC Pending": return "#EC4899";
      default: return "#6B7280";
    }
  }

  function getWarehouseBorderColor(warehouseName : any) {
    switch (warehouseName) {
      case "Warehouse A": return "#10B981";
      case "Warehouse B": return "#3B82F6";
      case "Warehouse C": return "#8B5CF6";
      case "Processing Unit": return "#F59E0B";
      default: return "#10B981";
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#10B981", "#059669"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Inventory Hub</Text>
              <Text style={styles.headerSubtitle}>Smart Rubber Management System</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search and Filter */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.searchSection}
          >
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search inventory items..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Feather name="filter" size={20} color="#10B981" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      >
        {/* Inventory Metrics */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.metricsContainer}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.metricsScroll}
            contentContainerStyle={styles.metricsContent}
          >
            {inventoryMetrics.map((metric, index) => (
              <Animated.View
                key={index}
                entering={SlideInDown.delay(200 + index * 100).duration(500)}
                style={styles.metricCard}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#F8FAFC"]}
                  style={styles.metricCardInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                      <Feather name={metric.icon as any} size={20} color={metric.color} />
                    </View>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <View style={styles.metricChange}>
                    <Feather name="trending-up" size={14} color="#10B981" />
                    <Text style={styles.changeText}>{metric.change}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Category Tabs */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Inventory Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {inventoryCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  activeTab === category.id && styles.activeCategoryCard,
                ]}
                onPress={() => setActiveTab(category.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color ? `${category.color}15` : "#F3F4F6" }
                ]}>
                  <Feather 
                    name={category.icon as any} 
                    size={20} 
                    color={category.color || "#6B7280"} 
                  />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  activeTab === category.id && styles.activeCategoryLabel
                ]}>
                  {category.label}
                </Text>
                <View style={[
                  styles.categoryCount,
                  activeTab === category.id && styles.activeCategoryCount
                ]}>
                  <Text style={[
                    styles.countText,
                    activeTab === category.id && styles.activeCountText
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Warehouse Locations with Left Side Borders */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Warehouse Status</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.warehouseGrid}>
            {warehouseLocations.map((warehouse, index) => (
              <Animated.View
                key={warehouse.id}
                entering={FadeInRight.delay(300 + index * 100).duration(500)}
                style={styles.warehouseCard}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#F8FAFC"]}
                  style={[
                    styles.warehouseCardInner,
                    { borderLeftColor: warehouse.borderColor, borderLeftWidth: 5 }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.warehouseHeader}>
                    <View style={[
                      styles.warehouseIcon,
                      { backgroundColor: `${warehouse.borderColor}15` }
                    ]}>
                      <Feather name="home" size={24} color={warehouse.borderColor} />
                    </View>
                    <Text style={styles.warehouseName}>{warehouse.name}</Text>
                  </View>
                  <View style={styles.capacityBar}>
                    <View style={styles.capacityBackground}>
                      <LinearGradient
                        colors={[warehouse.borderColor, `${warehouse.borderColor}80`]}
                        style={[styles.capacityFill, { width: `${warehouse.used}%` }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    <Text style={styles.capacityText}>{warehouse.used}% filled</Text>
                  </View>
                  <View style={styles.warehouseDetails}>
                    <View style={styles.detailItem}>
                      <Feather name="package" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{warehouse.items} items</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Feather name="maximize-2" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{warehouse.capacity}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Inventory Items List */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {getCategoryLabel(activeTab)} ({filteredItems.length} items)
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Feather name="plus" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="package" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter
              </Text>
            </View>
          ) : (
            <View style={styles.inventoryList}>
              {filteredItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInRight.delay(400 + index * 100).duration(500)}
                >
                  <TouchableOpacity
                    style={styles.inventoryCard}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#FFFFFF", "#F8FAFC"]}
                      style={styles.inventoryCardInner}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.itemHeader}>
                        <View style={styles.itemImage}>
                          <Text style={styles.itemEmoji}>{item.image}</Text>
                        </View>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <View style={styles.itemMeta}>
                            <Text style={styles.itemGrade}>{item.grade}</Text>
                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                            <Text style={styles.itemStatus}>{item.status}</Text>
                          </View>
                        </View>
                        <Feather name="chevron-right" size={20} color="#CBD5E1" />
                      </View>

                      <View style={styles.itemDetails}>
                        <View style={styles.detailRow}>
                          <View style={styles.detailItem}>
                            <Feather name="package" size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{item.quantity}</Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Feather name="map-pin" size={16} color="#6B7280" />
                            <Text style={styles.detailText}>{item.location}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Stock Level</Text>
                          <Text style={[styles.progressPercent, { color: item.color }]}>
                            {item.progress}%
                          </Text>
                        </View>
                        <View style={styles.progressBar}>
                          <LinearGradient
                            colors={[item.color, `${item.color}80`]}
                            style={[styles.progressFill, { width: `${item.progress}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                      </View>

                      <View style={styles.itemFooter}>
                        <Text style={styles.lastUpdated}>
                          Updated {item.lastUpdated}
                        </Text>
                        <View style={styles.itemActions}>
                          <TouchableOpacity style={styles.actionButton}>
                            <Feather name="edit-2" size={16} color="#10B981" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton}>
                            <Feather name="share-2" size={16} color="#3B82F6" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Quick Actions Footer */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.quickActions}
        >
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.quickActionIcon}
            >
              <Feather name="download" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Export Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.quickActionIcon}
            >
              <Feather name="bar-chart-2" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#8B5CF6", "#7C3AED"]}
              style={styles.quickActionIcon}
            >
              <Feather name="settings" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Enhanced Loading Screen Styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingAnimationContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  loadingDot1: {
    backgroundColor: "#FFFFFF",
  },
  loadingDot2: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingDot3: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  loadingTitle: {
    fontSize: 32,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 40,
    textAlign: "center",
  },
  loadingProgressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  loadingProgressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  loadingProgressFill: {
    height: "100%",
    width: "70%",
    borderRadius: 3,
  },
  loadingProgressText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingFeatures: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
  // Original Styles (unchanged except warehouse card)
  headerGradient: {
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#111827",
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  metricsContainer: {
    marginTop: 20,
  },
  metricsScroll: {
    paddingHorizontal: 24,
  },
  metricsContent: {
    gap: 16,
  },
  metricCard: {
    width: width * 0.42,
  },
  metricCardInner: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
    flex: 1,
  },
  metricValue: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#111827",
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changeText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: "#10B981",
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#10B981",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesContent: {
    gap: 12,
  },
  categoryCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    width: 120,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  activeCategoryCard: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
    elevation: 6,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  activeCategoryLabel: {
    color: "#FFFFFF",
  },
  categoryCount: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeCategoryCount: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  countText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: "#6B7280",
  },
  activeCountText: {
    color: "#FFFFFF",
  },
  warehouseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  warehouseCard: {
    width: 310,
  },
  warehouseCardInner: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderLeftWidth: 5,
  },
  warehouseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  warehouseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  warehouseName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#111827",
    flex: 1,
  },
  capacityBar: {
    marginBottom: 16,
  },
  capacityBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  capacityFill: {
    height: "100%",
    borderRadius: 4,
  },
  capacityText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
  warehouseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
  inventoryList: {
    gap: 16,
  },
  inventoryCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  inventoryCardInner: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#111827",
    marginBottom: 6,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemGrade: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemStatus: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
  itemDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
  progressPercent: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#9CA3AF",
  },
  itemActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderStyle: "dashed",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "Raleway_600SemiBold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#6B7280",
    textAlign: "center",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  quickAction: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#6B7280",
  },
});