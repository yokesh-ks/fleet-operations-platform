import path from 'path';
import { mapFields, validateAgainstSchema, loadConfig, processFiles } from '../helpers/transform-utils';

// Read field mapping configuration
const fieldMapping = loadConfig('../config/fuel-report/field-mapping.json');
const targetSchema = loadConfig('../config/fuel-report/target-schema.json');

/**
 * Transforms fuel report JSON data to match target schema
 * @param inputData - Raw fuel report JSON data
 * @returns Transformed data matching target schema
 */
function transformFuelReportData(inputData: any): any {
  const transformed = mapFields(inputData, fieldMapping);

  // Handle computed fields
  if (transformed.distanceNm && transformed.fuelConsumptionLiters) {
    transformed.fuelEfficiencyNmPerLiter = transformed.distanceNm / transformed.fuelConsumptionLiters;
  }

  // Validate against target schema
  validateAgainstSchema(transformed, targetSchema);

  return transformed;
}

/**
 * Main transformation function
 * @param inputDir - Directory containing raw fuel report JSON files
 * @param outputDir - Directory to save transformed JSON files
 */
async function transformFuelReport(inputDir: string, outputDir: string): Promise<void> {
  await processFiles(inputDir, outputDir, transformFuelReportData, 'Fuel report');
}

// If run directly, use default directories
if (require.main === module) {
  const inputDir = path.join(__dirname, '..', '00-extract/output/fuel-report');
  const outputDir = path.join(__dirname, '..', 'output/fuel-report');
  transformFuelReport(inputDir, outputDir);
}

export { transformFuelReportData, transformFuelReport };
