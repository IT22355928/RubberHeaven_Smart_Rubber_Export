import express, { Router } from "express";
import { predictDefects, getMLModelStatus } from "../controllers/ml-controller";
import { isAuthenticated } from "../middleware/auth";

const mlRouter: Router = express.Router();

// POST - Predict rubber defects from images
// Route: POST /api/v1/ml/predict
// Authentication: Required
mlRouter.post("/predict", isAuthenticated, predictDefects);

// GET - Get ML Model Status
// Route: GET /api/v1/ml/status
// Authentication: Required
mlRouter.get("/status", isAuthenticated, getMLModelStatus);

export default mlRouter;
