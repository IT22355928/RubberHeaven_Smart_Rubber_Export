import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from 'react-native';
import { generateAndSaveReport } from '../../utils/pdf';

const { width } = Dimensions.get("window");

interface PredictionData {
  imageName: string;
  predictions: Array<{
    class: string;
    confidence: number;
  }>;
  defectDetected: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

interface TestResults {
  batchId: string;
  category: string;
  testerName: string;
  sheetCount: number;
  batchWeight: number;
  totalImagesAnalyzed: number;
  defectsFound: number;
  overallQuality: "PASS" | "CONDITIONAL_PASS" | "FAIL";
  recommendedAction: string;
  predictions: PredictionData[];
  timestamp: string;
}

export default function QCResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Parse results from stringified JSON or use direct object
  let results: TestResults = {
    batchId: "",
    category: "",
    testerName: "",
    sheetCount: 0,
    batchWeight: 0,
    totalImagesAnalyzed: 0,
    defectsFound: 0,
    overallQuality: "PASS",
    recommendedAction: "",
    predictions: [],
    timestamp: "",
  };
  
  try {
    const resultsData = (route.params as any)?.resultsData;
    if (resultsData) {
      results = typeof resultsData === 'string' ? JSON.parse(resultsData) : resultsData;
    }
  } catch (error) {
    console.error("Error parsing results:", error);
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const getQualityColor = (
    quality: "PASS" | "CONDITIONAL_PASS" | "FAIL"
  ) => {
    switch (quality) {
      case "PASS":
        return { color: "#10B981", bgColor: "#D1FAE5", icon: "check-circle" };
      case "CONDITIONAL_PASS":
        return {
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          icon: "alert-circle",
        };
      case "FAIL":
        return { color: "#EF4444", bgColor: "#FEE2E2", icon: "close-circle" };
    }
  };

  const getSeverityColor = (severity: "LOW" | "MEDIUM" | "HIGH") => {
    switch (severity) {
      case "LOW":
        return "#10B981";
      case "MEDIUM":
        return "#F59E0B";
      case "HIGH":
        return "#EF4444";
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const qualityInfo = getQualityColor(results.overallQuality);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QC Test Results</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Quality Badge */}
      <Animated.View
        style={[styles.badgeContainer, { opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={[qualityInfo.bgColor, qualityInfo.bgColor]}
          style={styles.badge}
        >
          <MaterialCommunityIcons
            name={qualityInfo.icon as any}
            size={48}
            color={qualityInfo.color}
          />
          <Text style={[styles.qualityText, { color: qualityInfo.color }]}>
            {results.overallQuality?.replace(/_/g, " ")}
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Batch Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Batch Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="barcode" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Batch ID</Text>
            </View>
            <Text style={styles.infoValue}>{results.batchId}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={20}
                color="#4F46E5"
              />
              <Text style={styles.infoLabel}>Category</Text>
            </View>
            <Text style={styles.infoValue}>{results.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="account" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Tester</Text>
            </View>
            <Text style={styles.infoValue}>{results.testerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="layers" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Sheet Count</Text>
            </View>
            <Text style={styles.infoValue}>{results.sheetCount}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons name="scale" size={20} color="#4F46E5" />
              <Text style={styles.infoLabel}>Weight</Text>
            </View>
            <Text style={styles.infoValue}>{results.batchWeight} kg</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="calendar-today"
                size={20}
                color="#4F46E5"
              />
              <Text style={styles.infoLabel}>Timestamp</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(results.timestamp).toLocaleString()}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quality Assessment Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Quality Assessment</Text>
          <Divider style={styles.divider} />

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {results.totalImagesAnalyzed}
              </Text>
              <Text style={styles.statLabel}>Images</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#EF4444" }]}>
                {results.defectsFound}
              </Text>
              <Text style={styles.statLabel}>Defects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(
                  ((results.totalImagesAnalyzed - results.defectsFound) /
                    results.totalImagesAnalyzed) *
                  100
                ).toFixed(1)}
                %
              </Text>
              <Text style={styles.statLabel}>Pass Rate</Text>
            </View>
          </View>

          <View style={styles.recommendationBox}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={24}
              color="#F59E0B"
            />
            <Text style={styles.recommendationTitle}>Recommendation</Text>
            <Text style={styles.recommendationText}>
              {results.recommendedAction}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Individual Image Predictions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Image Analysis</Text>
          <Divider style={styles.divider} />

          {results.predictions?.map((prediction, index) => (
            <View key={index} style={styles.predictionItem}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionTitle}>
                  {prediction.imageName}
                </Text>
                <View
                  style={[
                    styles.severityBadge,
                    {
                      backgroundColor: getSeverityColor(prediction.severity),
                    },
                  ]}
                >
                  <Text style={styles.severityText}>{prediction.severity}</Text>
                </View>
              </View>

              {prediction.predictions.map((pred, idx) => (
                <View key={idx} style={styles.predictionRow}>
                  <View style={styles.predictionNameContainer}>
                    <MaterialCommunityIcons
                      name={
                        pred.class ===
                        "Good Quality with No Defects"
                          ? "check-circle"
                          : "alert-circle"
                      }
                      size={16}
                      color={
                        pred.class === "Good Quality with No Defects"
                          ? "#10B981"
                          : "#EF4444"
                      }
                    />
                    <Text style={styles.predictionName}>{pred.class}</Text>
                  </View>
                  <View style={styles.confidenceBar}>
                    <View
                      style={[
                        styles.confidenceFill,
                        { width: `${pred.confidence * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.confidenceValue}>
                    {(pred.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              ))}

              {index < results.predictions.length - 1 && (
                <Divider style={styles.itemDivider} />
              )}
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={{ height: 40 }} />
      <View style={{ paddingHorizontal: 16, marginBottom: 40 }}>
        <Button
          mode="contained"
          icon="file-pdf-box"
          onPress={async () => {
            try {
              const path = await generateAndSaveReport(results);
              Alert.alert('Exported', 'PDF saved to: ' + path, [{ text: 'OK' }]);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Export PDF
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  badgeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  badge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityText: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
    textTransform: "uppercase",
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4F46E5",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },
  recommendationBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    marginTop: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
    marginLeft: 12,
    marginTop: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: "#92400E",
    marginLeft: 12,
    marginTop: 6,
    lineHeight: 20,
  },
  predictionItem: {
    marginVertical: 12,
  },
  predictionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  predictionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  predictionNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
  },
  predictionName: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
    marginLeft: 8,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    minWidth: 50,
    textAlign: "right",
  },
  itemDivider: {
    marginVertical: 12,
  },
});
