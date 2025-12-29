import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

// Types
export interface Prediction {
  class: string;
  confidence: number;
}

export interface ImagePrediction {
  imageName: string;
  predictions: Prediction[];
}

export interface TestResults {
  batchId?: string;
  category?: string;
  testerName?: string;
  timestamp?: number | string | Date;
  sheetCount?: number;
  batchWeight?: number;
  totalImagesAnalyzed?: number;
  defectsFound?: number;
  overallQuality?: string;
  recommendedAction?: string;
  predictions?: ImagePrediction[];
}

export interface SavedReportInfo {
  name: string;
  uri: string;
  size?: string;
  modified?: string;
  sizeInBytes?: number;
  modifiedTimestamp?: number;
}

/**
 * Directory where reports are stored
 */
const REPORTS_DIR = FileSystem.documentDirectory + 'testReports/';

/**
 * Ensure reports directory exists
 */
export async function ensureReportsDir(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(REPORTS_DIR);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(REPORTS_DIR, {
        intermediates: true,
      });
      console.log('✅ testReports directory created');
    }
  } catch (error) {
    console.warn('❌ ensureReportsDir error', error);
    throw error;
  }
}

/**
 * Build HTML content for PDF - Optimized for one page
 */
function buildHtml(results: TestResults): string {
  const timestamp = results.timestamp
    ? new Date(results.timestamp).toLocaleString()
    : new Date().toLocaleString();

  // Calculate quality score percentage
  const getQualityScore = () => {
    const totalImages = results.totalImagesAnalyzed || 0;
    const defects = results.defectsFound || 0;
    if (totalImages === 0) return 0;
    return Math.max(0, 100 - (defects / totalImages) * 100);
  };

  const qualityScore = getQualityScore().toFixed(1);

  // Get quality color
  const getQualityColor = (score: number) => {
    if (score >= 90) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  // Prepare image predictions summary (limit to key insights)
  const predictionsSummary = (results.predictions || [])
    .slice(0, 3) // Limit to first 3 images
    .map((p: ImagePrediction) => {
      const topPrediction = (p.predictions || [])
        .sort((a, b) => b.confidence - a.confidence)[0];
      
      if (!topPrediction) return '';
      
      const shortName = p.imageName.length > 20 
        ? p.imageName.substring(0, 20) + '...' 
        : p.imageName;
      
      return `
        <div class="image-summary">
          <div class="image-name">${shortName}</div>
          <div class="prediction-detail">
            <span class="defect-type">${topPrediction.class}</span>
            <span class="confidence">${(topPrediction.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      `;
    })
    .join('');

  // Count defect types
  const defectTypes = new Map<string, number>();
  (results.predictions || []).forEach((imagePred: ImagePrediction) => {
    (imagePred.predictions || []).forEach((pred: Prediction) => {
      if (pred.confidence > 0.5) { // Only count high confidence predictions
        const count = defectTypes.get(pred.class) || 0;
        defectTypes.set(pred.class, count + 1);
      }
    });
  });

  const defectSummary = Array.from(defectTypes.entries())
    .slice(0, 5) // Limit to top 5 defect types
    .map(([defect, count]) => `
      <div class="defect-item">
        <span class="defect-name">${defect}</span>
        <span class="defect-count">${count} occurrence${count !== 1 ? 's' : ''}</span>
      </div>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>QC Test Report - ${results.batchId || 'Report'}</title>
        <style>
          /* Optimized for one-page PDF */
          @page {
            margin: 20px;
            size: A4 portrait;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            color: #2c3e50;
            line-height: 1.4;
            font-size: 11px;
          }
          
          .report-container {
            max-width: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          
          /* Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 15px;
          }
          
          .title-section {
            flex: 1;
          }
          
          .main-title {
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0 0 5px 0;
          }
          
          .subtitle {
            font-size: 12px;
            color: #7f8c8d;
            margin: 0;
          }
          
          .quality-score {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 8px;
            text-align: center;
            min-width: 120px;
            border-left: 4px solid ${getQualityColor(parseFloat(qualityScore))};
          }
          
          .score-value {
            font-size: 24px;
            font-weight: bold;
            color: ${getQualityColor(parseFloat(qualityScore))};
            line-height: 1;
          }
          
          .score-label {
            font-size: 10px;
            color: #7f8c8d;
            margin-top: 3px;
          }
          
          /* Metadata Grid */
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }
          
          .meta-item {
            padding: 5px 0;
          }
          
          .meta-label {
            font-size: 10px;
            color: #7f8c8d;
            font-weight: 500;
            margin-bottom: 3px;
          }
          
          .meta-value {
            font-size: 12px;
            font-weight: 600;
            color: #2c3e50;
          }
          
          /* Summary Grid */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .summary-item {
            background-color: #e8f4f8;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #d1ecf1;
          }
          
          .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin: 5px 0;
          }
          
          .summary-label {
            font-size: 10px;
            color: #666;
            font-weight: 500;
          }
          
          /* Two-column layout for bottom section */
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          
          .column {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }
          
          .column-title {
            font-size: 14px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 12px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #dee2e6;
          }
          
          /* Image predictions */
          .image-summary {
            padding: 8px 0;
            border-bottom: 1px dashed #dee2e6;
          }
          
          .image-summary:last-child {
            border-bottom: none;
          }
          
          .image-name {
            font-size: 10px;
            color: #6c757d;
            margin-bottom: 3px;
          }
          
          .prediction-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .defect-type {
            font-size: 11px;
            font-weight: 500;
            color: #2c3e50;
          }
          
          .confidence {
            font-size: 10px;
            color: #28a745;
            font-weight: 600;
            background-color: #d4edda;
            padding: 2px 6px;
            border-radius: 10px;
          }
          
          /* Defects summary */
          .defect-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px dashed #dee2e6;
          }
          
          .defect-item:last-child {
            border-bottom: none;
          }
          
          .defect-name {
            font-size: 11px;
            color: #2c3e50;
          }
          
          .defect-count {
            font-size: 10px;
            color: #dc3545;
            font-weight: 600;
            background-color: #f8d7da;
            padding: 2px 8px;
            border-radius: 10px;
          }
          
          /* Recommendation */
          .recommendation-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-left: 4px solid #f39c12;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
          }
          
          .rec-title {
            font-size: 13px;
            font-weight: 600;
            color: #856404;
            margin: 0 0 8px 0;
          }
          
          .rec-text {
            font-size: 11px;
            color: #856404;
            line-height: 1.4;
            margin: 0;
          }
          
          /* Footer */
          .footer {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #dee2e6;
            text-align: center;
            color: #6c757d;
            font-size: 9px;
          }
          
          /* Badge for overall quality */
          .quality-badge {
            display: inline-block;
            padding: 3px 10px;
            background-color: ${getQualityColor(parseFloat(qualityScore))}20;
            color: ${getQualityColor(parseFloat(qualityScore))};
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 10px;
          }
          
          /* Page break avoidance */
          .page-break {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <!-- Header -->
          <div class="header page-break">
            <div class="title-section">
              <h1 class="main-title">📊 Quality Control Test Report</h1>
              <p class="subtitle">RSS Rubber Sheet Inspection Analysis</p>
            </div>
            <div class="quality-score">
              <div class="score-value">${qualityScore}%</div>
              <div class="score-label">Quality Score</div>
            </div>
          </div>
          
          <!-- Metadata -->
          <div class="meta-grid page-break">
            <div class="meta-item">
              <div class="meta-label">Batch ID</div>
              <div class="meta-value">${results.batchId || 'N/A'}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Category</div>
              <div class="meta-value">${results.category || 'N/A'}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Tester</div>
              <div class="meta-value">${results.testerName || 'N/A'}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Test Date</div>
              <div class="meta-value">${timestamp.split(',')[0] || 'N/A'}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Test Time</div>
              <div class="meta-value">${timestamp.split(',')[1] ? timestamp.split(',')[1].trim() : 'N/A'}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Overall Quality</div>
              <div class="meta-value">
                ${results.overallQuality || 'N/A'}
                <span class="quality-badge">${results.overallQuality || ''}</span>
              </div>
            </div>
          </div>
          
          <!-- Summary Stats -->
          <div class="summary-grid page-break">
            <div class="summary-item">
              <div class="summary-value">${results.sheetCount || 0}</div>
              <div class="summary-label">Total Sheets</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${results.batchWeight || 0}</div>
              <div class="summary-label">Weight (kg)</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${results.totalImagesAnalyzed || 0}</div>
              <div class="summary-label">Images Analyzed</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${results.defectsFound || 0}</div>
              <div class="summary-label">Defects Found</div>
            </div>
          </div>
          
          <!-- Two-column Content -->
          <div class="content-grid page-break">
            <!-- Left Column: Image Analysis -->
            <div class="column">
              <h3 class="column-title">🖼️ Image Analysis Summary</h3>
              ${predictionsSummary || '<div style="color: #6c757d; font-size: 10px; text-align: center; padding: 20px;">No image analysis data available</div>'}
            </div>
            
            <!-- Right Column: Defects Summary -->
            <div class="column">
              <h3 class="column-title">⚠️ Top Defect Types</h3>
              ${defectSummary || '<div style="color: #6c757d; font-size: 10px; text-align: center; padding: 20px;">No defect data available</div>'}
            </div>
          </div>
          
          <!-- Recommendation -->
          <div class="recommendation-box page-break">
            <h4 class="rec-title">💡 Quality Recommendation</h4>
            <p class="rec-text">${results.recommendedAction || 'No specific recommendations available for this test.'}</p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>Report generated on ${new Date().toLocaleString()} • Quality Control System v1.0</p>
            <p>This report is system-generated. For detailed analysis, contact quality control department.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sanitize filename to remove invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_.]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Generate PDF and save to local storage - Optimized for one page
 */
export async function generateAndSaveReport(results: TestResults): Promise<string> {
  try {
    await ensureReportsDir();

    console.log('📄 Generating one-page PDF report...');
    const html = buildHtml(results);

    // Generate PDF with optimized settings for one page
    const { uri: tempPdfUri } = await Print.printToFileAsync({ 
      html,
      base64: false,
      width: 794, // A4 width in points (8.27 inches * 96 dpi)
      height: 1123 // A4 height in points (11.69 inches * 96 dpi)
    });

    const nameBase = results.batchId
      ? sanitizeFilename(results.batchId)
      : `report_${Date.now()}`;

    const destUri = REPORTS_DIR + `${nameBase}.pdf`;

    console.log('📂 Saving PDF to:', destUri);

    // Check if file already exists
    const existingFile = await FileSystem.getInfoAsync(destUri);
    if (existingFile.exists) {
      // Append timestamp if file exists
      const timestamp = Date.now();
      const uniqueDestUri = REPORTS_DIR + `${nameBase}_${timestamp}.pdf`;
      await FileSystem.moveAsync({
        from: tempPdfUri,
        to: uniqueDestUri,
      });
      console.log('✅ PDF saved with unique name:', uniqueDestUri);
      Alert.alert('Success', 'PDF exported successfully!');
      return uniqueDestUri;
    }

    // Move file to permanent directory
    await FileSystem.moveAsync({
      from: tempPdfUri,
      to: destUri,
    });

    console.log('✅ One-page PDF saved successfully');
    Alert.alert('Success', 'PDF report generated successfully!');

    return destUri;
  } catch (error: any) {
    console.error('❌ generateAndSaveReport error:', error);
    Alert.alert(
      'Export Failed', 
      error.message || 'Could not generate PDF. Please try again.'
    );
    throw new Error(`Failed to generate report: ${error.message}`);
  }
}

/**
 * List saved PDF reports with proper metadata
 */
export async function listSavedReports(): Promise<SavedReportInfo[]> {
  try {
    await ensureReportsDir();

    const files = await FileSystem.readDirectoryAsync(REPORTS_DIR);

    const reports = await Promise.all(
      files
        .filter((name) => name.toLowerCase().endsWith('.pdf'))
        .map(async (name) => {
          const uri = REPORTS_DIR + name;
          const info = await FileSystem.getInfoAsync(uri);
          
          if (info.exists && info.size !== undefined && info.modificationTime !== undefined) {
            const fileInfo = info as FileSystem.FileInfo & {
              size: number;
              modificationTime: number;
            };
            
            // Extract batch ID from filename (remove .pdf and any timestamp)
            const cleanName = name.replace(/\.pdf$/i, '').replace(/_(\d+)$/, '');
            
            return {
              name: cleanName,
              originalFileName: name,
              uri,
              size: (fileInfo.size / 1024).toFixed(2) + ' KB',
              sizeInBytes: fileInfo.size,
              modified: new Date(fileInfo.modificationTime * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              modifiedTimestamp: fileInfo.modificationTime * 1000
            };
          }
          
          return {
            name: name.replace(/\.pdf$/i, ''),
            originalFileName: name,
            uri,
            size: 'Unknown',
            modified: 'Unknown'
          };
        })
    );

    // Filter out any undefined results and sort newest first
    const validReports = reports.filter(report => report !== undefined) as SavedReportInfo[];
    
    return validReports.sort((a, b) => {
      const timeA = a.modifiedTimestamp || 0;
      const timeB = b.modifiedTimestamp || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.warn('❌ listSavedReports error', error);
    return [];
  }
}

/**
 * Get a specific PDF file by URI
 */
export async function getPdfFile(uri: string): Promise<FileSystem.FileInfo> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) {
      throw new Error('PDF file not found');
    }
    return info;
  } catch (error) {
    console.error('❌ getPdfFile error:', error);
    throw error;
  }
}

/**
 * Delete a specific PDF file
 */
export async function deletePdfFile(uri: string): Promise<boolean> {
  try {
    await FileSystem.deleteAsync(uri);
    console.log('✅ PDF deleted:', uri);
    return true;
  } catch (error) {
    console.error('❌ deletePdfFile error:', error);
    throw error;
  }
}

/**
 * Open PDF file with device's PDF viewer
 */
export async function openPdfFile(uri: string): Promise<void> {
  try {
    // You can use expo-sharing to open the PDF
    // Or use Linking.openURL for iOS/Android
    console.log('📖 Opening PDF:', uri);
    
    // Example with expo-sharing:
    // import * as Sharing from 'expo-sharing';
    // if (await Sharing.isAvailableAsync()) {
    //   await Sharing.shareAsync(uri);
    // }
    
    Alert.alert(
      'Open PDF',
      'PDF viewer functionality requires additional implementation.',
      [
        {
          text: 'OK',
          style: 'default'
        }
      ]
    );
  } catch (error) {
    console.error('❌ openPdfFile error:', error);
    Alert.alert('Error', 'Could not open PDF file.');
  }
}

/**
 * Get formatted date from timestamp
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}