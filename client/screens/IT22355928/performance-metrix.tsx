import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
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
} from "react-native-reanimated";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

export default function PerformanceMetrics() {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Performance Metrics Data with Blue Theme
  const performanceKPIs = [
    {
      id: 1,
      title: "Inventory Turnover",
      value: "87.5%",
      change: "+5.2%",
      trend: "up",
      icon: "refresh-cw",
      color: "#3498db",
      target: 85,
      current: 87.5,
    },
    {
      id: 2,
      title: "Stock Accuracy",
      value: "98.3%",
      change: "+1.8%",
      trend: "up",
      icon: "check-circle",
      color: "#2ecc71",
      target: 95,
      current: 98.3,
    },
    {
      id: 3,
      title: "Order Fulfillment",
      value: "94.7%",
      change: "+2.4%",
      trend: "up",
      icon: "package",
      color: "#9b59b6",
      target: 92,
      current: 94.7,
    },
    {
      id: 4,
      title: "Warehouse Utilization",
      value: "72.5%",
      change: "-3.1%",
      trend: "down",
      icon: "home",
      color: "#e74c3c",
      target: 75,
      current: 72.5,
    },
  ];

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    turnover: [82, 84, 85, 86, 87, 88],
    accuracy: [96, 96.5, 97, 97.5, 98, 98.3],
    fulfillment: [91, 92, 92.5, 93, 94, 94.7],
    utilization: [75, 74, 73.5, 73, 72.5, 72],
  };

  const warehousePerformance = [
    {
      id: "A",
      name: "Warehouse A",
      efficiency: 92,
      throughput: "45 tons/day",
      accuracy: 99.1,
      color: "#3498db",
      trend: "up",
      capacity: "85%",
    },
    {
      id: "B",
      name: "Warehouse B",
      efficiency: 88,
      throughput: "38 tons/day",
      accuracy: 97.5,
      color: "#2ecc71",
      trend: "up",
      capacity: "72%",
    },
    {
      id: "C",
      name: "Warehouse C",
      efficiency: 85,
      throughput: "32 tons/day",
      accuracy: 96.8,
      color: "#9b59b6",
      trend: "stable",
      capacity: "65%",
    },
    {
      id: "D",
      name: "Processing Unit",
      efficiency: 91,
      throughput: "28 tons/day",
      accuracy: 98.2,
      color: "#e67e22",
      trend: "up",
      capacity: "88%",
    },
  ];

  const timeRanges = [
    { id: "week", label: "Day" },
    { id: "month", label: "Week" },
    { id: "quarter", label: "Month" },
    { id: "year", label: "Year" },
  ];

  const metricCategories = [
    { id: "overview", label: "Overview", icon: "grid", color: "#3498db" },
    { id: "warehouse", label: "Warehouse", icon: "home", color: "#2ecc71" },
    { id: "inventory", label: "Inventory", icon: "package", color: "#9b59b6" },
    { id: "quality", label: "Quality", icon: "award", color: "#e67e22" },
    { id: "cost", label: "Cost", icon: "dollar-sign", color: "#e74c3c" },
  ];

  const recentAlerts = [
    {
      id: 1,
      title: "Low Efficiency Alert",
      message: "Warehouse C efficiency dropped below 85%",
      type: "warning",
      time: "2 hours ago",
      icon: "alert-triangle",
      color: "#e67e22",
    },
    {
      id: 2,
      title: "High Accuracy Achieved",
      message: "Warehouse A achieved 99.1% accuracy this week",
      type: "success",
      time: "5 hours ago",
      icon: "check-circle",
      color: "#2ecc71",
    },
    {
      id: 3,
      title: "Throughput Record",
      message: "Daily throughput reached 45 tons in Warehouse A",
      type: "info",
      time: "1 day ago",
      icon: "trending-up",
      color: "#3498db",
    },
    {
      id: 4,
      title: "Maintenance Required",
      message: "Processing Unit requires routine maintenance",
      type: "maintenance",
      time: "2 days ago",
      icon: "tool",
      color: "#9b59b6",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <Feather name="trending-up" size={16} color="#2ecc71" />;
      case "down":
        return <Feather name="trending-down" size={16} color="#e74c3c" />;
      default:
        return <Feather name="minus" size={16} color="#95a5a6" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "#e67e22";
      case "success":
        return "#2ecc71";
      case "info":
        return "#3498db";
      case "maintenance":
        return "#9b59b6";
      default:
        return "#95a5a6";
    }
  };

  // Function to render line chart with connected lines inside chart area
  const renderLineChart = () => {
    const chartHeight = 160;
    const chartWidth = width - 80;
    const maxValue = 100;
    const minValue = 70;

    const calculatePoints = (data: number[]) => {
      return data.map((value, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const y = ((maxValue - value) / (maxValue - minValue)) * chartHeight;
        return { x, y };
      });
    };

    const turnoverPoints = calculatePoints(trendData.turnover);
    const accuracyPoints = calculatePoints(trendData.accuracy);
    const fulfillmentPoints = calculatePoints(trendData.fulfillment);

    const renderLine = (points: {x: number, y: number}[], color: string) => {
      return points.map((point, index) => {
        if (index < points.length - 1) {
          const nextPoint = points[index + 1];
          const distance = Math.sqrt(
            Math.pow(nextPoint.x - point.x, 2) + 
            Math.pow(nextPoint.y - point.y, 2)
          );
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
          
          return (
            <View
              key={`line-${color}-${index}`}
              style={[
                styles.lineSegment,
                {
                  left: point.x,
                  top: point.y,
                  width: distance,
                  height: 3,
                  backgroundColor: color,
                  transform: [{ rotate: `${angle}rad` }],
                }
              ]}
            />
          );
        }
        return null;
      });
    };

    const renderPoints = (points: {x: number, y: number}[], color: string) => {
      return points.map((point, index) => (
        <View
          key={`point-${color}-${index}`}
          style={[
            styles.dataPoint,
            {
              left: point.x - 6,
              top: point.y - 6,
              backgroundColor: color,
              borderColor: "#ffffff",
              borderWidth: 2,
            }
          ]}
        >
          <View style={styles.innerPoint} />
        </View>
      ));
    };

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          {[100, 90, 80, 70].map((value) => (
            <Text key={value} style={styles.axisLabel}>{value}%</Text>
          ))}
        </View>
        
        <View style={styles.chartMain}>
          {/* Grid Lines */}
          <View style={styles.gridContainer}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          {/* Chart Area Container - Lines will be drawn only inside this */}
          <View style={styles.chartArea}>
            {/* Lines */}
            <View style={styles.linesContainer}>
              {renderLine(turnoverPoints, "#3498db")}
              {renderLine(accuracyPoints, "#2ecc71")}
              {renderLine(fulfillmentPoints, "#9b59b6")}
            </View>

            {/* Data Points */}
            <View style={styles.pointsContainer}>
              {renderPoints(turnoverPoints, "#3498db")}
              {renderPoints(accuracyPoints, "#2ecc71")}
              {renderPoints(fulfillmentPoints, "#9b59b6")}
            </View>
          </View>

          {/* X-axis Labels */}
          <View style={styles.xAxis}>
            {trendData.labels.map((label, index) => (
              <View key={index} style={styles.xAxisItem}>
                <View style={styles.xAxisMarker} />
                <Text style={styles.xAxisLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <LinearGradient
          colors={["#3498db", "#2980b9", "#1c5d8a"]}
          style={styles.loadingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContent}>
            <View style={styles.loadingAnimation}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <View style={styles.loadingDots}>
                <View style={[styles.loadingDot, styles.dot1]} />
                <View style={[styles.loadingDot, styles.dot2]} />
                <View style={[styles.loadingDot, styles.dot3]} />
              </View>
            </View>
            <Text style={styles.loadingTitle}>Performance Analytics</Text>
            <Text style={styles.loadingSubtitle}>Loading real-time metrics...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#3498db", "#2980b9"]}
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
              <Text style={styles.headerTitle}>Performance Metrics</Text>
              <Text style={styles.headerSubtitle}>Real Time Analytics Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Time Range Selector */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.timeRangeContainer}
          >
            <View style={styles.timeRangeSelector}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.timeRangeButton,
                    timeRange === range.id && styles.activeTimeRangeButton,
                  ]}
                  onPress={() => setTimeRange(range.id)}
                >
                  <Text
                    style={[
                      styles.timeRangeText,
                      timeRange === range.id && styles.activeTimeRangeText,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowCalendar(true)}
            >
              <Feather name="calendar" size={20} color="#FFFFFF" />
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
            tintColor="#3498db"
            colors={["#3498db"]}
          />
        }
      >
        {/* Metric Categories */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.section}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {metricCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedMetric === category.id && { 
                    backgroundColor: category.color,
                    transform: [{ scale: 1.05 }],
                  },
                ]}
                onPress={() => setSelectedMetric(category.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  selectedMetric === category.id && { 
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                  }
                ]}>
                  <Feather 
                    name={category.icon as any} 
                    size={24} 
                    color={selectedMetric === category.id ? "#FFFFFF" : category.color} 
                  />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  selectedMetric === category.id && styles.activeCategoryLabel
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Key Performance Indicators - Fixed equal height */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.kpiGrid}>
            {performanceKPIs.map((kpi, index) => (
              <Animated.View
                key={kpi.id}
                entering={FadeInRight.delay(200 + index * 100).duration(500)}
                style={styles.kpiCard}
              >
                <LinearGradient
                  colors={["#FFFFFF", "#f8f9fa"]}
                  style={[
                    styles.kpiCardInner,
                    { borderLeftColor: kpi.color, borderLeftWidth: 5 }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.kpiHeader}>
                    <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}20` }]}>
                      <Feather name={kpi.icon as any} size={20} color={kpi.color} />
                    </View>
                    <View style={styles.kpiTrend}>
                      {getTrendIcon(kpi.trend)}
                      <Text style={[
                        styles.kpiChange,
                        { color: kpi.trend === "down" ? "#e74c3c" : "#2ecc71" }
                      ]}>
                        {kpi.change}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <Text style={styles.kpiTitle}>{kpi.title}</Text>
                  
                  {/* Progress Indicator Bar */}
                  <View style={styles.kpiProgress}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressLabel}>Current</Text>
                      <Text style={styles.progressLabel}>Target</Text>
                    </View>
                    <View style={styles.customProgressBar}>
                      <LinearGradient
                        colors={[kpi.color, `${kpi.color}DD`]}
                        style={[
                          styles.customProgressFill, 
                          { width: `${kpi.current}%` }
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressValue}>{kpi.current}%</Text>
                      <Text style={styles.progressValue}>{kpi.target}%</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Performance Trend with Improved Line Chart */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Trend</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Export Data</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.trendCard}>
            <LinearGradient
              colors={["#FFFFFF", "#f8f9fa"]}
              style={styles.trendCardInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.trendLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#3498db" }]} />
                  <Text style={styles.legendText}>Turnover Rate</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#2ecc71" }]} />
                  <Text style={styles.legendText}>Stock Accuracy</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#9b59b6" }]} />
                  <Text style={styles.legendText}>Order Fulfillment</Text>
                </View>
              </View>
              
              {/* Improved Line Chart */}
              {renderLineChart()}
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Warehouse Performance */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Warehouse Performance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Compare All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.warehouseList}>
            {warehousePerformance.map((warehouse, index) => (
              <Animated.View
                key={warehouse.id}
                entering={FadeInRight.delay(400 + index * 100).duration(500)}
                style={styles.warehousePerfCard}
              >
                <TouchableOpacity style={styles.warehouseCardTouchable}>
                  <LinearGradient
                    colors={["#FFFFFF", "#f8f9fa"]}
                    style={[
                      styles.warehousePerfInner,
                      { 
                        borderLeftColor: warehouse.color, 
                        borderLeftWidth: 5
                      }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.warehousePerfHeader}>
                      <View style={[
                        styles.warehousePerfIcon,
                        { backgroundColor: `${warehouse.color}20` }
                      ]}>
                        <Feather name="home" size={24} color={warehouse.color} />
                      </View>
                      <View style={styles.warehouseInfo}>
                        <Text style={styles.warehousePerfName}>{warehouse.name}</Text>
                        <View style={styles.warehouseTrend}>
                          {getTrendIcon(warehouse.trend)}
                          <Text style={styles.warehouseTrendText}>
                            {warehouse.trend === "up" ? "Improving" : 
                             warehouse.trend === "down" ? "Declining" : "Stable"}
                          </Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={20} color="#bdc3c7" />
                    </View>
                    
                    <View style={styles.warehouseStats}>
                      <View style={styles.warehouseStat}>
                        <View style={styles.statRow}>
                          <Text style={styles.statLabel}>Efficiency</Text>
                          <Text style={[styles.statValue, { color: warehouse.color }]}>
                            {warehouse.efficiency}%
                          </Text>
                        </View>
                        <View style={styles.customSmallProgressBar}>
                          <LinearGradient
                            colors={[warehouse.color, `${warehouse.color}DD`]}
                            style={[
                              styles.customProgressFill, 
                              { width: `${warehouse.efficiency}%` }
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.warehouseDetails}>
                        <View style={styles.detailItem}>
                          <Feather name="truck" size={16} color="#7f8c8d" />
                          <Text style={styles.detailText}>{warehouse.throughput}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Feather name="check-circle" size={16} color="#7f8c8d" />
                          <Text style={styles.detailText}>{warehouse.accuracy}% Accuracy</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Feather name="pie-chart" size={16} color="#7f8c8d" />
                          <Text style={styles.detailText}>{warehouse.capacity} Capacity</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Alerts */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(600)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertsContainer}>
            {recentAlerts.map((alert, index) => (
              <Animated.View
                key={alert.id}
                entering={FadeInRight.delay(500 + index * 100).duration(500)}
                style={styles.alertItem}
              >
                <TouchableOpacity style={styles.alertCard}>
                  <LinearGradient
                    colors={["#FFFFFF", "#f8f9fa"]}
                    style={[
                      styles.alertCardInner,
                      { borderLeftColor: getAlertColor(alert.type), borderLeftWidth: 5 }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[
                      styles.alertIcon,
                      { backgroundColor: `${getAlertColor(alert.type)}20` }
                    ]}>
                      <Feather name={alert.icon as any} size={20} color={getAlertColor(alert.type)} />
                    </View>
                    
                    <View style={styles.alertContent}>
                      <View style={styles.alertHeader}>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        <Text style={styles.alertTime}>{alert.time}</Text>
                      </View>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                    </View>
                    
                    <Feather name="chevron-right" size={20} color="#bdc3c7" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.quickActions}
        >
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#3498db", "#2980b9"]}
              style={styles.quickActionIcon}
            >
              <Feather name="download" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Export Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#2ecc71", "#27ae60"]}
              style={styles.quickActionIcon}
            >
              <Feather name="share-2" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={["#9b59b6", "#8e44ad"]}
              style={styles.quickActionIcon}
            >
              <Feather name="settings" size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Feather name="x" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            
            <Calendar
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#3498db',
                selectedDayBackgroundColor: '#3498db',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3498db',
                dayTextColor: '#2d3436',
                textDisabledColor: '#bdc3c7',
                dotColor: '#3498db',
                selectedDotColor: '#ffffff',
                arrowColor: '#3498db',
                monthTextColor: '#2d3436',
                indicatorColor: '#3498db',
              }}
              onDayPress={(day : any) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={{
                [selectedDate]: {selected: true, selectedColor: '#3498db'}
              }}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingScreen: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingAnimation: {
    alignItems: "center",
    marginBottom: 30,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dot1: { backgroundColor: "#FFFFFF" },
  dot2: { backgroundColor: "rgba(255, 255, 255, 0.8)" },
  dot3: { backgroundColor: "rgba(255, 255, 255, 0.6)" },
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
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#3498db",
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
    marginLeft: 15
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    marginLeft: -5,
    color: "rgba(255, 255, 255, 0.9)",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e74c3c",
  },
  
  // Time Range Selector
  timeRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeRangeSelector: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTimeRangeButton: {
    backgroundColor: "#FFFFFF",
  },
  timeRangeText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "rgba(255, 255, 255, 0.9)",
  },
  activeTimeRangeText: {
    color: "#3498db",
  },
  datePickerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Section Styles
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
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
    color: "#2d3436",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#3498db",
  },
  
  // Metric Categories
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    gap: 16,
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    width: 140,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#7f8c8d",
  },
  activeCategoryLabel: {
    color: "#FFFFFF",
  },
  
  // KPI Cards - Fixed equal height
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  kpiCard: {
    width: (width - 64) / 2 - 8, // Responsive width
    height: 220, // Fixed height for all cards
  },
  kpiCardInner: {
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e6ed",
    borderLeftWidth: 5,
    height: '100%', // Make inner container fill the card
    justifyContent: 'space-between', // Distribute content evenly
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  kpiChange: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
  },
  kpiValue: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    color: "#2d3436",
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#7f8c8d",
    marginBottom: 16,
  },
  kpiProgress: {
    marginTop: 'auto', // Push to bottom
  },
  
  // Progress Bars
  customProgressBar: {
    height: 8,
    backgroundColor: "#e0e6ed",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 4,
  },
  customSmallProgressBar: {
    height: 6,
    backgroundColor: "#e0e6ed",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 4,
  },
  customProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontFamily: "Nunito_400Regular",
    color: "#95a5a6",
  },
  progressValue: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#7f8c8d",
  },
  
  // Trend Chart
  trendCard: {
    borderRadius: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  trendCardInner: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  
  // Legend
  trendLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#7f8c8d",
  },
  
  // Improved Line Chart Styles
  chartContainer: {
    flexDirection: "row",
    height: 200,
  },
  chartYAxis: {
    width: 40,
    justifyContent: "space-between",
    paddingRight: 8,
    paddingBottom: 40,
  },
  axisLabel: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    color: "#95a5a6",
    textAlign: "right",
  },
  chartMain: {
    flex: 1,
    position: "relative",
    paddingBottom: 40,
  },
  chartArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    overflow: 'hidden',
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "#e0e6ed",
    width: '100%',
  },
  
  // Lines Container
  linesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Line Segments
  lineSegment: {
    position: "absolute",
    borderRadius: 1.5,
    transformOrigin: 'left center',
  },
  
  // Points Container
  pointsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Data Points
  dataPoint: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  innerPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  
  // X-axis
  xAxis: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  xAxisItem: {
    alignItems: 'center',
    flex: 1,
  },
  xAxisMarker: {
    width: 1,
    height: 8,
    backgroundColor: '#e0e6ed',
    marginBottom: 6,
  },
  xAxisLabel: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    color: "#95a5a6",
  },
  
  // Warehouse Performance
  warehouseList: {
    gap: 16,
  },
  warehousePerfCard: {
    width: '100%',
  },
  warehouseCardTouchable: {
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  warehousePerfInner: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e6ed",
    borderLeftWidth: 5,
  },
  warehousePerfHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  warehousePerfIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  warehouseInfo: {
    flex: 1,
  },
  warehousePerfName: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#2d3436",
    marginBottom: 4,
  },
  warehouseTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  warehouseTrendText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#7f8c8d",
  },
  warehouseStats: {
    gap: 16,
  },
  warehouseStat: {
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#7f8c8d",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
  },
  warehouseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#7f8c8d",
  },
  
  // Alerts
  alertsContainer: {
    gap: 12,
  },
  alertItem: {},
  alertCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  alertCardInner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e6ed",
    borderLeftWidth: 5,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#2d3436",
  },
  alertTime: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#95a5a6",
  },
  alertMessage: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#7f8c8d",
    lineHeight: 18,
  },
  
  // Quick Actions
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#e0e6ed",
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
    color: "#7f8c8d",
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: "#2d3436",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#3498db",
  },
  modalButtonSecondary: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#7f8c8d",
  },
});