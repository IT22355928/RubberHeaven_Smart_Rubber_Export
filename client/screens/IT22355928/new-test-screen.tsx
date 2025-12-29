import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Divider,
  Menu,
  Provider,
} from "react-native-paper";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import {
  submitQualityTest,
  convertImagesToBase64,
  PredictionRequest,
} from "../../utils/ml-api";

const { width } = Dimensions.get("window");

// --- Configuration Data ---
const RUBBER_CATEGORIES = [
  "RSS Rubber",
  "Para Rubber",
  "Crepe Rubber",
  "Skim Rubber",
  "TSR Rubber",
];

const QUALITY_GRADIENTS = {
  primary: ["#667eea", "#764ba2"] as const,
  success: ["#4facfe", "#00f2fe"] as const,
  warning: ["#f093fb", "#f5576c"] as const,
};

// Batch ID validation functions
const isValidBatchId = (id: string) => {
  const batchIdRegex = /^BATCH-\d{4}-\d{4}$/;
  return batchIdRegex.test(id);
};

const getBatchIdErrorMessage = (id: string) => {
  if (id.length === 0) return "Batch/Lot ID is required";

  if (!id.startsWith("BATCH-")) {
    return 'Must start with "BATCH-"';
  }

  const parts = id.split("-");
  if (parts.length < 3) {
    return "Format: BATCH-YYYY-NNNN";
  }

  if (parts[1] && parts[1].length !== 4) {
    return "Year must be 4 digits (YYYY)";
  }

  if (parts[2] && parts[2].length !== 4) {
    return "Batch number must be 4 digits (NNNN)";
  }

  if (parts[1] && !/^\d{4}$/.test(parts[1])) {
    return "Year must contain only numbers";
  }

  if (parts[2] && !/^\d{4}$/.test(parts[2])) {
    return "Batch number must contain only numbers";
  }

  return "Invalid Batch ID format";
};

// Function to generate auto Batch ID
const generateBatchId = () => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Generate a random 4-digit number between 1000 and 9999
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  
  return `BATCH-${year}-${randomNum}`;
};

export default function NewTestScreen() {
  const [category, setCategory] = useState("RSS Rubber"); // Pre-selected as RSS Rubber
  const [sheetCount, setSheetCount] = useState("");
  const [batchWeight, setBatchWeight] = useState("");
  const [batchId, setBatchId] = useState(""); // Will be auto-generated
  const [testerName, setTesterName] = useState(""); // Changed: Empty initial state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [images, setImages] = useState<string[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Auto-generate Batch ID on component mount
  useEffect(() => {
    const generatedBatchId = generateBatchId();
    setBatchId(generatedBatchId);
  }, []);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle back button press
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Formatters
  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (d: Date) => {
    return d
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  // Image Picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Date & Time Handlers
  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // Check if all required fields are filled
  const areAllFieldsFilled = () => {
    return (
      batchId.trim() !== "" &&
      isValidBatchId(batchId) &&
      category.trim() !== "" &&
      sheetCount.trim() !== "" &&
      batchWeight.trim() !== "" &&
      testerName.trim() !== "" &&
      images.length > 0
    );
  };

  // Get missing fields for alert message
  const getMissingFields = () => {
    const missingFields = [];

    if (batchId.trim() === "" || !isValidBatchId(batchId)) {
      missingFields.push("Batch/Lot ID");
    }
    if (category.trim() === "") {
      missingFields.push("Rubber Category");
    }
    if (sheetCount.trim() === "") {
      missingFields.push("Sheet Count");
    }
    if (batchWeight.trim() === "") {
      missingFields.push("Batch Weight");
    }
    if (testerName.trim() === "") {
      missingFields.push("Tester Name");
    }
    if (images.length === 0) {
      missingFields.push("Sample Photos");
    }

    return missingFields;
  };

  const handleSubmit = async () => {
    if (!areAllFieldsFilled()) {
      const missingFields = getMissingFields();
      Alert.alert(
        "Missing Information",
        `Please fill in the following required fields:\n\n• ${missingFields.join(
          "\n• "
        )}`
      );
      return;
    }

    setIsLoading(true);
    startPulse();

    try {
      // Convert images to base64
      const base64Images = await convertImagesToBase64(images);

      // Prepare the request
      const predictionRequest: PredictionRequest = {
        images: base64Images,
        batchId,
        category,
        sheetCount: parseInt(sheetCount),
        batchWeight: parseFloat(batchWeight),
        testerName,
      };

      // Call the ML API
      const result = await submitQualityTest(predictionRequest);

      // Show success alert with results
      Alert.alert(
        "Quality Test Results",
        `Batch: ${result.data.batchId}\n\n` +
          `Overall Quality: ${result.data.overallQuality}\n` +
          `Defects Found: ${result.data.defectsFound}/${result.data.totalImagesAnalyzed}\n\n` +
          `Recommendation:\n${result.data.recommendedAction}`,
        [
          {
            text: "View Details",
            onPress: () => {
              // Navigate to results screen with the data
              console.log("✅ Navigating to QC Results with data:", result.data);
              router.push({
                pathname: "/routes/IT22355928/qc-results",
                params: { resultsData: JSON.stringify(result.data) },
              });
            },
          },
          {
            text: "Done",
            onPress: () => {
              // Reset form and go back
              setImages([]);
              setSheetCount("");
              setBatchWeight("");
              setTesterName(""); // Reset to empty
              const newBatchId = generateBatchId();
              setBatchId(newBatchId);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to submit quality test. Please try again."
      );
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Provider>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Creative Header */}
        <LinearGradient
          colors={QUALITY_GRADIENTS.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Floating Elements */}
            <View style={styles.floatingCircle1} />
            <View style={styles.floatingCircle2} />
            <View style={styles.floatingCircle3} />

            {/* Main Header Content */}
            <View style={styles.headerMain}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.iconWrapper}>
                <LinearGradient
                  colors={["#ffffff", "#f0f4ff"]}
                  style={styles.mainIconContainer}
                >
                  <MaterialCommunityIcons
                    name="test-tube"
                    size={32}
                    color="#667eea"
                  />
                  <View style={styles.badgeIcon}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.titleSection}>
                <Text style={styles.title}>Create New Test</Text>
                <Text style={styles.subtitle}>Quality Assessment Portal</Text>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.statCard}
              >
                <MaterialCommunityIcons
                  name="clipboard-check"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Today</Text>
              </LinearGradient>

              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.statCard}
              >
                <MaterialCommunityIcons
                  name="trending-up"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.statNumber}>94%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </LinearGradient>

              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.statCard}
              >
                <MaterialCommunityIcons
                  name="clock-check"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.statNumber}>8m</Text>
                <Text style={styles.statLabel}>Avg Time</Text>
              </LinearGradient>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Enhanced Form Card */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.card}>
            <Card.Content>
              {/* Test Date - Vertical Layout */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons
                    name="calendar-today"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  Test Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.dateTimeButtonVertical,
                    activeField === "date" && styles.activeField,
                  ]}
                  onPressIn={() => setActiveField("date")}
                  onPressOut={() => setActiveField("")}
                >
                  <LinearGradient
                    colors={QUALITY_GRADIENTS.success}
                    style={styles.datetimeIconContainer}
                  >
                    <MaterialCommunityIcons
                      name="calendar-today"
                      size={20}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                  <View style={styles.datetimeTextContainer}>
                    <Text style={styles.datetimeValue}>{formatDate(date)}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>

              {/* Test Time - Vertical Layout */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  Test Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={[
                    styles.dateTimeButtonVertical,
                    activeField === "time" && styles.activeField,
                  ]}
                  onPressIn={() => setActiveField("time")}
                  onPressOut={() => setActiveField("")}
                >
                  <LinearGradient
                    colors={QUALITY_GRADIENTS.warning}
                    style={styles.datetimeIconContainer}
                  >
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                  <View style={styles.datetimeTextContainer}>
                    <Text style={styles.datetimeValue}>{formatTime(time)}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>

              {/* Tester Name - UPDATED with placeholder */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  Tester Name
                </Text>
                <TextInput
                  mode="outlined"
                  value={testerName}
                  onChangeText={setTesterName}
                  placeholder="Enter tester name"
                  placeholderTextColor="#94A3B8"
                  style={styles.equalInput}
                  theme={{ roundness: 12 }}
                  outlineColor="#D1D5DB"
                  activeOutlineColor="#4F46E5"
                />
              </View>

              {/* Auto-generated Batch/Lot ID - Read Only */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, styles.requiredLabel]}>
                  <MaterialCommunityIcons
                    name="barcode"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  Batch/Lot ID *
                </Text>
                
                {/* Read-only Batch ID Display */}
                <View style={styles.readOnlyContainer}>
                  <LinearGradient
                    colors={["#f0fdf4", "#dcfce7"]}
                    style={styles.batchIdDisplay}
                  >
                    <MaterialCommunityIcons
                      name="lock"
                      size={20}
                      color="#059669"
                    />
                    <View style={styles.batchIdTextContainer}>
                      <Text style={styles.batchIdLabel}>Auto-generated ID</Text>
                      <Text style={styles.batchIdValue}>{batchId}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#10B981"
                    />
                  </LinearGradient>
                </View>

                {/* Validation Status */}
                <View style={styles.validationContainer}>
                  {batchId && isValidBatchId(batchId) && (
                    <Text style={styles.successText}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={14}
                        color="#10B981"
                      />{" "}
                      Auto-generated Batch ID
                    </Text>
                  )}
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Pre-selected Rubber Category - Read Only */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons
                    name="format-list-bulleted"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  Rubber Sheet Category
                </Text>

                {/* Read-only Category Display */}
                <View style={styles.readOnlyContainer}>
                  <LinearGradient
                    colors={["#f0fdf4", "#dcfce7"]}
                    style={styles.categoryDisplay}
                  >
                    <MaterialCommunityIcons
                      name="lock"
                      size={20}
                      color="#059669"
                    />
                    <View style={styles.categoryTextContainer}>
                      <Text style={styles.categoryLabel}>Pre-selected Category</Text>
                      <Text style={styles.categoryValue}>{category}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#10B981"
                    />
                  </LinearGradient>
                </View>

                {/* Category Info */}
                <View style={styles.categoryInfoContainer}>
                  <MaterialCommunityIcons
                    name="information"
                    size={16}
                    color="#4F46E5"
                  />
                  <Text style={styles.categoryInfoText}>
                    RSS Rubber is the standard category for quality testing
                  </Text>
                </View>
              </View>

              {/* Number of Sheets & Batch Weight */}
              <View style={styles.rowContainer}>
                <View
                  style={[styles.inputContainer, styles.equalWidthContainer]}
                >
                  <Text style={styles.label}>
                    <MaterialCommunityIcons
                      name="layers"
                      size={16}
                      color="#4F46E5"
                    />{" "}
                    Sheet Count
                  </Text>
                  <TextInput
                    mode="outlined"
                    keyboardType="numeric"
                    value={sheetCount}
                    onChangeText={setSheetCount}
                    placeholder="50"
                    placeholderTextColor="#94A3B8"
                    style={styles.equalInput}
                    theme={{ roundness: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#4F46E5"
                  />
                </View>

                <View
                  style={[styles.inputContainer, styles.equalWidthContainer]}
                >
                  <Text style={styles.label}>
                    <MaterialCommunityIcons
                      name="scale"
                      size={16}
                      color="#4F46E5"
                    />{" "}
                    Weight (kg)
                  </Text>
                  <TextInput
                    mode="outlined"
                    keyboardType="decimal-pad"
                    value={batchWeight}
                    onChangeText={setBatchWeight}
                    placeholder="350"
                    placeholderTextColor="#94A3B8"
                    style={styles.equalInput}
                    right={<TextInput.Affix text="kg" />}
                    theme={{ roundness: 12 }}
                    outlineColor="#D1D5DB"
                    activeOutlineColor="#4F46E5"
                  />
                </View>
              </View>

              {/* Image Upload */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={16}
                    color="#4F46E5"
                  />{" "}
                  
                  Sample Photos ({images.length}/5)
                </Text>
                <Text style={styles.instructionText}>( Please only upload RSS rubber sheet images)</Text>
                <View style={styles.imageSection}>
                  {images.length < 5 && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={pickImage}
                    >
                      <LinearGradient
                        colors={["#f0f4ff", "#e0e7ff"]}
                        style={styles.uploadButtonGradient}
                      >
                        <MaterialCommunityIcons
                          name="camera-plus"
                          size={28}
                          color="#4F46E5"
                        />
                        <Text style={styles.uploadText}>Add Photo</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageScrollView}
                  >
                    {images.map((uri, index) => (
                      <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.previewImage} />
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => removeImage(index)}
                        >
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={26}
                            color="#DC2626"
                          />
                        </TouchableOpacity>
                        <LinearGradient
                          colors={["transparent", "rgba(0,0,0,0.3)"]}
                          style={styles.imageOverlay}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Submit Button - Only shown when all fields are filled */}
              {areAllFieldsFilled() && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    labelStyle={styles.submitButtonLabel}
                    theme={{ roundness: 16 }}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#FFFFFF" size="small" />
                        <Text style={styles.submitButtonLabel}>
                          {"  "}Processing...
                        </Text>
                      </View>
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="rocket-launch"
                          size={20}
                          color="#FFFFFF"
                        />
                        {"  "}Launch Quality Test
                      </>
                    )}
                  </Button>
                </Animated.View>
              )}

              {/* Show message when fields are missing */}
              {!areAllFieldsFilled() && (
                <View style={styles.incompleteFieldsContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={24}
                    color="#F59E0B"
                  />
                  <Text style={styles.incompleteFieldsText}>
                    Fill all fields above to enable the Launch Quality Test
                    button
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </Provider>
  );
}

// Enhanced Creative Styles with Read-only Fields
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Enhanced Header Styles
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: -8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerPlaceholder: {
    width: 40,
  },
  headerContent: {
    position: "relative",
    zIndex: 2,
  },
  floatingCircle1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -20,
    right: -20,
  },
  floatingCircle2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: 10,
    left: -10,
  },
  floatingCircle3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: 40,
    left: "40%",
  },
  headerMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  iconWrapper: {
    marginRight: 16,
  },
  mainIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginLeft: 11,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badgeIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  // Form Styles
  formContainer: {
    marginTop: -20,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  // Updated Date/Time Button Styles for Vertical Layout
  dateTimeButtonVertical: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeField: {
    borderColor: "#4F46E5",
    backgroundColor: "#F8FAFF",
  },
  datetimeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  datetimeTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  datetimeValue: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "700",
  },
  inputContainer: {
    marginBottom: 20,
  },
  // New styles for equal width containers
  equalWidthContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  equalInput: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    height: 56,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  instructionText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 12,
    fontStyle: "italic",
  },
  requiredLabel: {
    color: "#374151",
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 24,
    backgroundColor: "#F1F5F9",
    height: 3,
  },
  // Read-only container styles
  readOnlyContainer: {
    marginTop: 4,
  },
  batchIdDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#BBF7D0",
    borderLeftWidth: 6,
    borderLeftColor: "#10B981",
    ...Platform.select({
      ios: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#BBF7D0",
    borderLeftWidth: 6,
    borderLeftColor: "#10B981",
    ...Platform.select({
      ios: {
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  batchIdTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  categoryTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  batchIdLabel: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 2,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    marginBottom: 2,
  },
  batchIdValue: {
    fontSize: 16,
    color: "#065F46",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  categoryValue: {
    fontSize: 16,
    color: "#065F46",
    fontWeight: "800",
  },
  // Category info styles
  categoryInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
  },
  categoryInfoText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#0369A1",
    fontWeight: "500",
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: -6,
  },
  imageSection: {
    marginTop: 8,
  },
  uploadButton: {
    marginBottom: 16,
  },
  uploadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
  },
  uploadText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4F46E5",
    fontWeight: "700",
  },
  imageScrollView: {
    paddingVertical: 4,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitButton: {
    marginTop: 32,
    backgroundColor: "#4F46E5",
    ...Platform.select({
      ios: {
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  submitButtonContent: {
    height: 60,
    justifyContent: "center",
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  validationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  warningText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  successText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  charCountText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
  },
  requirementsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  exampleText: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 6,
    fontWeight: "600",
    fontStyle: "italic",
  },
  // New styles for incomplete fields message
  incompleteFieldsContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  incompleteFieldsText: {
    marginLeft: 8,
    color: "#92400E",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});