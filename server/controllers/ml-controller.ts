require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import * as fs from "fs";
import * as path from "path";

// ===============================================================
// Interface for ML Prediction Request
// ===============================================================
interface IPredictionRequest {
  images: string[]; // Base64 encoded images
  batchId: string;
  category: string;
  sheetCount: number;
  batchWeight: number;
  testerName: string;
}

interface IPredictionResult {
  imageName: string;
  predictions: {
    class: string;
    confidence: number;
  }[];
  defectDetected: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

// ===============================================================
// ML Model Configuration
// ===============================================================
const ML_MODEL_PATH = path.join(__dirname, "../ML_Models/RSS_Defect_Model.tflite");
const CLASS_NAMES = [
  "Good Quality with No Defects",
  "Pin Head Bubbles Defect",
  "Reaper Marks Defect",
];

// ===============================================================
// Predict Rubber Defects from Images
// ===============================================================
export const predictDefects = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { images, batchId, category, sheetCount, batchWeight, testerName } =
        req.body as IPredictionRequest;

      // Validate input
      if (!images || images.length === 0) {
        return next(new ErrorHandler("No images provided for prediction", 400));
      }

      if (!batchId || !category || !testerName) {
        return next(
          new ErrorHandler(
            "Missing required fields: batchId, category, testerName",
            400
          )
        );
      }

      // Check if TFLite model exists
      if (!fs.existsSync(ML_MODEL_PATH)) {
        return next(
          new ErrorHandler(
            "ML model not found. Please upload RSS_Defect_Model.tflite",
            500
          )
        );
      }

      // Process each image through the ML model
      const predictions: IPredictionResult[] = [];
      let totalDefectsDetected = 0;
      let highestSeverity: "LOW" | "MEDIUM" | "HIGH" = "LOW";

      for (let i = 0; i < images.length; i++) {
        const base64Image = images[i];

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(
          base64Image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        // Perform prediction (simplified mock for now)
        // In production, integrate with TensorFlow.js or Python backend
        const predictionResult = await performMLPrediction(imageBuffer);

        const result: IPredictionResult = {
          imageName: `image_${i + 1}.jpg`,
          predictions: predictionResult.predictions,
          defectDetected: predictionResult.defectDetected,
          severity: predictionResult.severity,
        };

        predictions.push(result);

        if (result.defectDetected) {
          totalDefectsDetected++;
          if (
            result.severity === "HIGH" ||
            (highestSeverity !== "HIGH" && result.severity === "MEDIUM")
          ) {
            highestSeverity = result.severity;
          }
        }
      }

      // Generate quality assessment report
      const qualityAssessment = generateQualityReport(
        predictions,
        totalDefectsDetected,
        images.length
      );

      res.status(200).json({
        success: true,
        message: "Prediction completed successfully",
        data: {
          batchId,
          category,
          testerName,
          sheetCount,
          batchWeight,
          totalImagesAnalyzed: images.length,
          defectsFound: totalDefectsDetected,
          overallQuality: qualityAssessment.overallQuality,
          recommendedAction: qualityAssessment.recommendedAction,
          predictions: predictions,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ===============================================================
// Perform ML Prediction on a Single Image
// ===============================================================
async function performMLPrediction(imageBuffer: Buffer): Promise<{
  predictions: { class: string; confidence: number }[];
  defectDetected: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH";
}> {
  try {
    // Mock prediction logic - Replace with actual TensorFlow.js or Python backend call
    // This is a placeholder that simulates the model output

    // Random prediction for demo (remove in production)
    const classIndex = Math.floor(Math.random() * CLASS_NAMES.length);
    const baseConfidence = 0.5 + Math.random() * 0.5; // 50-100%

    const predictions = CLASS_NAMES.map((className, idx) => {
      const confidence =
        idx === classIndex
          ? baseConfidence
          : (1 - baseConfidence) / (CLASS_NAMES.length - 1);

      return {
        class: className,
        confidence: Math.round(confidence * 10000) / 10000,
      };
    });

    const predictedClass = CLASS_NAMES[classIndex];
    const defectDetected = predictedClass !== "Good Quality with No Defects";
    const confidence = predictions[classIndex].confidence;

    let severity: "LOW" | "MEDIUM" | "HIGH";
    if (!defectDetected) {
      severity = "LOW";
    } else if (confidence > 0.8) {
      severity = "HIGH";
    } else {
      severity = "MEDIUM";
    }

    return {
      predictions,
      defectDetected,
      severity,
    };
  } catch (error) {
    throw new Error(`Failed to perform ML prediction: ${error}`);
  }
}

// ===============================================================
// Generate Quality Assessment Report
// ===============================================================
function generateQualityReport(
  predictions: IPredictionResult[],
  defectsFound: number,
  totalImages: number
): {
  overallQuality: "PASS" | "CONDITIONAL_PASS" | "FAIL";
  recommendedAction: string;
} {
  const defectPercentage = (defectsFound / totalImages) * 100;

  let overallQuality: "PASS" | "CONDITIONAL_PASS" | "FAIL";
  let recommendedAction: string;

  if (defectPercentage === 0) {
    overallQuality = "PASS";
    recommendedAction =
      "Batch approved for production. All samples passed quality inspection.";
  } else if (defectPercentage <= 10) {
    overallQuality = "CONDITIONAL_PASS";
    recommendedAction =
      "Batch conditionally approved. Minor defects detected. Recommend manual inspection of flagged samples.";
  } else if (defectPercentage <= 30) {
    overallQuality = "CONDITIONAL_PASS";
    recommendedAction =
      "Batch requires review. Significant defects detected in multiple samples. Manual inspection recommended.";
  } else {
    overallQuality = "FAIL";
    recommendedAction =
      "Batch rejected. High defect rate detected. Do not proceed to production. Investigate root cause.";
  }

  return { overallQuality, recommendedAction };
}

// ===============================================================
// Get ML Model Status
// ===============================================================
export const getMLModelStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modelExists = fs.existsSync(ML_MODEL_PATH);
      const modelSize = modelExists
        ? fs.statSync(ML_MODEL_PATH).size / (1024 * 1024)
        : 0;

      res.status(200).json({
        success: true,
        data: {
          modelLoaded: modelExists,
          modelPath: ML_MODEL_PATH,
          modelSize: modelSize.toFixed(2) + " MB",
          supportedClasses: CLASS_NAMES,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
