import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Suppress known warnings
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "ImagePicker.MediaTypeOptions",
  "Non-serializable values were found in the navigation state"
]);

// API Configuration
// For development on a physical device/emulator, change localhost to your machine's IP
// Example: http://192.168.8.114:5000/api/v1 (your current network IP)
// Get your IP by running: ipconfig (look for IPv4 Address)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.8.114:5000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for image processing
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================================================
// Image Processing Utilities
// ===============================================================

/**
 * Convert image URI to base64 string
 * @param imageUri - The local image URI from React Native
 * @returns Base64 encoded image string
 */
export const convertImageToBase64 = async (
  imageUri: string
): Promise<string> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
};

/**
 * Convert multiple image URIs to base64 strings
 * @param imageUris - Array of image URIs
 * @returns Array of base64 encoded image strings
 */
export const convertImagesToBase64 = async (
  imageUris: string[]
): Promise<string[]> => {
  try {
    const base64Images = await Promise.all(
      imageUris.map((uri) => convertImageToBase64(uri))
    );
    return base64Images;
  } catch (error) {
    throw new Error(`Failed to convert images to base64: ${error}`);
  }
};

// ===============================================================
// ML API Calls
// ===============================================================

export interface PredictionRequest {
  images: string[]; // Base64 encoded images
  batchId: string;
  category: string;
  sheetCount: number;
  batchWeight: number;
  testerName: string;
}

export interface PredictionResult {
  success: boolean;
  message: string;
  data: {
    batchId: string;
    category: string;
    testerName: string;
    sheetCount: number;
    batchWeight: number;
    totalImagesAnalyzed: number;
    defectsFound: number;
    overallQuality: "PASS" | "CONDITIONAL_PASS" | "FAIL";
    recommendedAction: string;
    predictions: Array<{
      imageName: string;
      predictions: Array<{
        class: string;
        confidence: number;
      }>;
      defectDetected: boolean;
      severity: "LOW" | "MEDIUM" | "HIGH";
    }>;
    timestamp: string;
  };
}

/**
 * Submit rubber samples for quality testing using ML model
 * @param request - Prediction request with images and metadata
 * @returns Prediction results with quality assessment
 */
export const submitQualityTest = async (
  request: PredictionRequest
): Promise<PredictionResult> => {
  try {
    // Retrieve and set auth token before making request
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      setAuthToken(token);
      console.log("✅ Auth token set for ML API request");
    } else {
      console.warn("❌ No authentication token found. Request may fail with 401.");
    }

    console.log("📤 Submitting quality test to:", API_BASE_URL + "/ml/predict");
    const response = await apiClient.post<PredictionResult>(
      "/ml/predict",
      request
    );
    console.log("✅ ML API response received:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ ML API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      headers: error.response?.headers,
    });
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      error.message || "Failed to submit quality test to ML model"
    );
  }
};

/**
 * Check ML model status and availability
 * @returns Model status information
 */
export const checkMLModelStatus = async (): Promise<any> => {
  try {
    // Retrieve and set auth token before making request
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      setAuthToken(token);
    }

    const response = await apiClient.get("/ml/status");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message || "Failed to check ML model status");
  }
};

/**
 * Set authorization token for API requests
 * @param token - JWT token from authentication
 */
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export default apiClient;
